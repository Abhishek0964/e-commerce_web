# MCP Configuration Lock

## Status: 🔒 LOCKED

The MCP configuration file (`.agent/mcp_config.json`) has been locked to prevent accidental modifications by agents or editors.

## Why Locked?

- Ensures stability of working MCP servers (GitHub, Supabase, MeiliSearch, Playwright, Figma)
- Prevents accidental reconfiguration during automated tasks
- Maintains consistency across development sessions

## How to Unlock (if needed)

⚠️ **Only unlock if you need to modify MCP configuration. Re-lock immediately after changes.**

### Step 1: Remove read-only permissions
```bash
chmod 0644 .agent/mcp_config.json
```

### Step 2: Re-enable git tracking
```bash
git update-index --no-assume-unchanged .agent/mcp_config.json
```

### Step 3: Remove the "locked" field
Edit `.agent/mcp_config.json` and remove the `"locked": true` field from the top-level object.

### Step 4: Make your changes
Modify the MCP configuration as needed.

### Step 5: Re-lock (IMPORTANT)
```bash
# Add "locked": true back to config
# Commit changes
git update-index --assume-unchanged .agent/mcp_config.json
chmod 0444 .agent/mcp_config.json
```

## Check Lock Status

Run the safety check script:
```bash
bash scripts/check_mcp_lock.sh
```

## Backup

A backup of the configuration is saved as:
`.agent/mcp_config.json.bak.{timestamp}`

To restore from backup:
```bash
# Unlock first (see above)
cp .agent/mcp_config.json.bak.{timestamp} .agent/mcp_config.json
# Re-lock (see above)
```

## Locked MCPs

The following MCPs are actively locked and working:
- ✅ **github-mcp-server** - GitHub operations
- ✅ **supabase-mcp-server** - Database operations  
- ✅ **meilisearch** - Search functionality
- ✅ **playwright** - Browser automation & E2E testing
- ✅ **figma** - Design file access

## Disabled MCPs

The following remain disabled and must not be enabled:
- ❌ Stripe
- ❌ SMTP
