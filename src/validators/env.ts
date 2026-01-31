import { z } from 'zod';

const envSchema = z.object({
    // Supabase
    NEXT_PUBLIC_SUPABASE_URL: z.string().url('Invalid Supabase URL'),
    NEXT_PUBLIC_SUPABASE_ANON_KEY: z.string().min(1, 'Supabase anon key is required'),
    SUPABASE_SERVICE_ROLE_KEY: z.string().min(1, 'Supabase service role key is required'),

    // Razorpay
    NEXT_PUBLIC_RAZORPAY_KEY_ID: z.string().min(1, 'Razorpay key ID is required'),
    RAZORPAY_KEY_SECRET: z.string().min(1, 'Razorpay key secret is required'),
    RAZORPAY_WEBHOOK_SECRET: z.string().min(1, 'Razorpay webhook secret is required'),

    // Application
    NEXT_PUBLIC_APP_URL: z.string().url('Invalid app URL'),

    // Email (Resend)
    RESEND_API_KEY: z.string().min(1, 'Resend API key is required'),
});

// Validate environment variables on startup
export const env = envSchema.parse({
    NEXT_PUBLIC_SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL,
    NEXT_PUBLIC_SUPABASE_ANON_KEY: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    SUPABASE_SERVICE_ROLE_KEY: process.env.SUPABASE_SERVICE_ROLE_KEY,
    NEXT_PUBLIC_RAZORPAY_KEY_ID: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
    RAZORPAY_KEY_SECRET: process.env.RAZORPAY_KEY_SECRET,
    RAZORPAY_WEBHOOK_SECRET: process.env.RAZORPAY_WEBHOOK_SECRET,
    NEXT_PUBLIC_APP_URL: process.env.NEXT_PUBLIC_APP_URL,
    RESEND_API_KEY: process.env.RESEND_API_KEY,
});

export type Env = z.infer<typeof envSchema>;
