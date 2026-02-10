import { z } from 'zod';

const clientSchema = z.object({
    NEXT_PUBLIC_SUPABASE_URL: z.string().url(),
    NEXT_PUBLIC_SUPABASE_ANON_KEY: z.string().min(1),
    NEXT_PUBLIC_APP_URL: z.string().url().default('http://localhost:3000'),
});

const serverSchema = z.object({
    SUPABASE_URL: z.string().url(),
    SUPABASE_SERVICE_ROLE_KEY: z.string().min(1),
    SUPABASE_GOOGLE_CLIENT_ID: z.string().optional(),
    SUPABASE_GOOGLE_CLIENT_SECRET: z.string().optional(),
    NODE_ENV: z.enum(['development', 'test', 'production']).default('development'),
});

const processEnv = {
    NEXT_PUBLIC_SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL,
    NEXT_PUBLIC_SUPABASE_ANON_KEY: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    NEXT_PUBLIC_APP_URL: process.env.NEXT_PUBLIC_APP_URL,
    SUPABASE_URL: process.env.SUPABASE_URL,
    SUPABASE_SERVICE_ROLE_KEY: process.env.SUPABASE_SERVICE_ROLE_KEY,
    SUPABASE_GOOGLE_CLIENT_ID: process.env.SUPABASE_GOOGLE_CLIENT_ID,
    SUPABASE_GOOGLE_CLIENT_SECRET: process.env.SUPABASE_GOOGLE_CLIENT_SECRET,
    NODE_ENV: process.env.NODE_ENV,
};

// Validate Client
const clientParsed = clientSchema.safeParse(processEnv);

if (!clientParsed.success) {
    console.error('❌ Invalid client environment variables:', clientParsed.error.flatten().fieldErrors);
    throw new Error('Invalid client environment variables');
}

const isServer = typeof window === 'undefined';

let serverParsedData = {};

if (isServer) {
    const serverParsed = serverSchema.safeParse(processEnv);
    if (!serverParsed.success) {
        console.error('❌ Invalid server environment variables:', serverParsed.error.flatten().fieldErrors);
        throw new Error('Invalid server environment variables');
    }
    serverParsedData = serverParsed.data;
}

export const env = {
    ...clientParsed.data,
    ...serverParsedData,
} as z.infer<typeof clientSchema> & z.infer<typeof serverSchema>; // Type assumption: Server vars available on server
