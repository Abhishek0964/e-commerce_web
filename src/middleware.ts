import { type NextRequest } from 'next/server';
import { updateSession } from '@/lib/supabase/middleware';

export async function middleware(request: NextRequest) {
    const { supabaseResponse, user } = await updateSession(request);

    // Protected routes that require authentication
    const protectedRoutes = ['/cart', '/wishlist', '/checkout', '/profile', '/orders'];

    // Admin-only routes
    const adminRoutes = ['/admin'];

    const path = request.nextUrl.pathname;

    // Check if route requires authentication
    if (protectedRoutes.some((route) => path.startsWith(route))) {
        if (!user) {
            const url = request.nextUrl.clone();
            url.pathname = '/login';
            url.searchParams.set('redirectTo', path);
            return Response.redirect(url);
        }
    }

    // Check if route requires admin access
    if (adminRoutes.some((route) => path.startsWith(route))) {
        if (!user) {
            const url = request.nextUrl.clone();
            url.pathname = '/login';
            url.searchParams.set('redirectTo', path);
            return Response.redirect(url);
        }

        // TODO: Check if user has admin role
        // This will be implemented when we have profile data
    }

    return supabaseResponse;
}

export const config = {
    matcher: [
        /*
         * Match all request paths except:
         * - _next/static (static files)
         * - _next/image (image optimization files)
         * - favicon.ico (favicon file)
         * - public folder
         */
        '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
    ],
};
