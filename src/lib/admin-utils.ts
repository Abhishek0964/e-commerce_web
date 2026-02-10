import { createClient } from '@/lib/supabase/server';
import { NextResponse } from 'next/server';

/**
 * Middleware to verify admin role for protected routes
 * Returns user profile if admin, otherwise returns error response
 */
export async function verifyAdmin() {
    const supabase = await createClient();

    // Get current user
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
        return NextResponse.json(
            { error: 'Unauthorized - Please log in' },
            { status: 401 }
        );
    }

    // Get user profile to check role
    const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', user.id)
        .single();

    if (profileError || !profile) {
        return NextResponse.json(
            { error: 'Profile not found' },
            { status: 404 }
        );
    }

    if (profile.role !== 'admin') {
        return NextResponse.json(
            { error: 'Forbidden - Admin access required' },
            { status: 403 }
        );
    }

    return { user, profile };
}

/**
 * Generates request ID for logging
 */
export function generateRequestId(): string {
    return `req_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
}

/**
 * Standard error response format
 */
export function errorResponse(message: string, status: number = 400, details?: any) {
    return NextResponse.json(
        {
            error: message,
            details,
            timestamp: new Date().toISOString(),
        },
        { status }
    );
}

/**
 * Standard success response format
 */
export function successResponse(data: any, status: number = 200) {
    return NextResponse.json(
        {
            data,
            timestamp: new Date().toISOString(),
        },
        { status }
    );
}
