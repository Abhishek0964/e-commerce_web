const fs = require('fs');
const path = require('path');
const { spawn } = require('child_process');

// Load environment variables manually
function loadEnv(filePath) {
    if (fs.existsSync(filePath)) {
        const content = fs.readFileSync(filePath, 'utf8');
        content.split('\n').forEach(line => {
            const match = line.match(/^([^=]+)=(.*)$/);
            if (match) {
                const key = match[1].trim();
                const value = match[2].trim().replace(/^['"]|['"]$/g, ''); // Remove quotes
                if (!process.env[key]) {
                    process.env[key] = value;
                }
            }
        });
    }
}

loadEnv('.env');
loadEnv('.env.local');

const MCP_CONFIG_PATH = '.agent/mcp_config.json';
const TIMEOUT_MS = 15000; // Increased timeout for installation

async function validateMCP() {
    console.log('🔍 Starting MCP Validation...');

    if (!fs.existsSync(MCP_CONFIG_PATH)) {
        console.error(`❌ Config file not found: ${MCP_CONFIG_PATH}`);
        return;
    }

    const config = JSON.parse(fs.readFileSync(MCP_CONFIG_PATH, 'utf8'));
    const servers = config.mcpServers;

    const results = {};

    for (const [name, serverConfig] of Object.entries(servers)) {
        if (['context7', 'shadcn'].includes(name)) continue; // Skip default ones

        console.log(`\nTesting ${name}...`);
        try {
            const success = await testServer(name, serverConfig);
            results[name] = success ? '✅ Success' : '❌ Failed';
        } catch (error) {
            console.error(`Error testing ${name}:`, error.message);
            results[name] = '❌ Failed (Exception)';
        }
    }

    console.log('\n📊 Validation Summary:');
    console.table(results);
}

function testServer(name, config) {
    return new Promise((resolve) => {
        // Replace env vars in args/env
        const env = { ...process.env, ...config.env };
        // Expand env vars in args if needed (simple substitution)

        // Check for critical missing env vars
        if (config.env) {
            const missingVars = Object.entries(config.env)
                .filter(([key, value]) => value.startsWith('${') && !env[key]) // Basic check for explicitly required vars
                .map(([key]) => key);

            // Also check if the value in process.env is empty
            const emptyVars = Object.keys(config.env).filter(key => {
                // Check if substituted value is missing or if the placeholder remains
                const val = config.env[key];
                // If val is ${VAR}, we look up process.env[VAR]. 
                // If process.env[VAR] is undefined/empty, it's missing.
                if (val.startsWith('${') && val.endsWith('}')) {
                    const varName = val.slice(2, -1);
                    return !process.env[varName];
                }
                return false;
            });

            if (emptyVars.length > 0) {
                console.log(`   ⚠️  Missing Environment Variables: ${emptyVars.join(', ')}`);
                // We proceed anyway to see if it crashes or just complains, but often it crashes.
                // For validation purposes, missing auth usually means "fail" for functional test, but "pass" for binary test.
                // But let's mark it.
            }
        }

        const child = spawn(config.command, config.args, {
            env: env,
            stdio: ['pipe', 'pipe', 'pipe']
        });

        let initialized = false;
        let errorOutput = '';

        // Timeout
        const timer = setTimeout(() => {
            if (!initialized) {
                console.log(`   ⏱️  Timeout waiting for initialization`);
                child.kill();
                resolve(false);
            }
        }, TIMEOUT_MS);

        child.stdout.on('data', (data) => {
            // Look for JSON-RPC messages or just successful startup
            // MCP servers usually don't output anything until a request is sent, 
            // OR they output debug info.
            // We will send an initialize request immediately.
            // console.log(`[${name} stdout]: ${data}`);
        });

        child.stderr.on('data', (data) => {
            errorOutput += data.toString();
            // console.log(`[${name} stderr]: ${data}`); 
            // Many npx tools output installation progress to stderr, ignore that
        });

        // Send initialize request
        const initRequest = {
            jsonrpc: "2.0",
            id: 1,
            method: "initialize",
            params: {
                protocolVersion: "2024-11-05",
                capabilities: {},
                clientInfo: {
                    name: "validation-script",
                    version: "1.0.0"
                }
            }
        };

        try {
            child.stdin.write(JSON.stringify(initRequest) + '\n');
        } catch (e) {
            console.log(`   ❌ Failed to write to stdin: ${e.message}`);
        }

        // Capture stdout response specific to init
        child.stdout.on('data', (data) => {
            const str = data.toString();
            if (str.includes('"jsonrpc":"2.0"')) {
                initialized = true;
                clearTimeout(timer);
                console.log(`   ✨ Received JSON-RPC response`);
                child.kill();
                resolve(true);
            }
        });

        child.on('close', (code) => {
            clearTimeout(timer);
            if (!initialized) {
                console.log(`   ❌ Process exited with code ${code}`);
                if (errorOutput) console.log(`   Stderr: ${errorOutput.slice(0, 200)}...`);
                resolve(false);
            }
        });

        child.on('error', (err) => {
            clearTimeout(timer);
            console.log(`   ❌ Spawn error: ${err.message}`);
            resolve(false);
        });

    });
}

validateMCP();
