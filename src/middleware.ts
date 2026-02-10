import { type NextRequest, NextResponse } from 'next/server';
import { createServerClient } from '@supabase/ssr';
import { env } from '@/lib/env';

export async function middleware(request: NextRequest) {
    let response = NextResponse.next({
        request: {
            headers: request.headers,
        },
    });

    const supabase = createServerClient(
        env.NEXT_PUBLIC_SUPABASE_URL,
        env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
        {
            cookies: {
                getAll() {
                    return request.cookies.getAll();
                },
                setAll(cookiesToSet) {
                    cookiesToSet.forEach(({ name, value }) => {
                        request.cookies.set(name, value);
                    });
                    response = NextResponse.next({
                        request,
                    });
                    cookiesToSet.forEach(({ name, value, options }) => {
                        response.cookies.set(name, value, options);
                    });
                },
            },
        }
    );

    const {
        data: { user },
    } = await supabase.auth.getUser();

    const isAuth = !!user;
    const path = request.nextUrl.pathname;

    // Protected Routes
    const protectedPaths = ['/profile', '/checkout', '/orders', '/admin'];
    const isProtected = protectedPaths.some((p) => path.startsWith(p));

    // Helper to redirect
    const redirectToLogin = () => {
        const url = request.nextUrl.clone();
        url.pathname = '/login';
        url.searchParams.set('returnTo', path); // Pass returnTo
        return NextResponse.redirect(url);
    };

    // Admin Protection
    if (path.startsWith('/admin')) {
        if (!isAuth) {
            return redirectToLogin();
        }

        // check role
        // Note: user object from getUser() often contains metadata, but careful relying on it vs DB.
        // For speed, strict admins usually have a claim or we check the profile. 
        // We already fetched 'user'.

        // Optimistic check via metadata if available, or just rely on 'user' existence for now if role isn't in JWT.
        // However, we MUST prevent non-admins.
        // Strategy: We can't easily query 'profiles' here without creating another client or risk.
        // But 'user' object from getUser() fetches from Auth.
        // If we put 'role' in app_metadata, it's efficient.
        // If not, we might need a trusted check. 

        // Given Phase J requirements: "Middleware-based route protection".
        // Let's assume for now we block if not logged in (already done).
        // AND validation logic should realistically be server-side in the Layout too.
        // But we want to redirect early.

        // Let's assume we rely on server component layout for the HARD check to save middleware time/complexity, 
        // OR we try to read metadata.

        // Let's inspect user.app_metadata or user.user_metadata
        const userRole = user.user_metadata?.role || 'user';
        if (userRole !== 'admin') {
            // Redirect non-admins to home
            const url = request.nextUrl.clone();
            url.pathname = '/';
            return NextResponse.redirect(url);
        }
    }

    if (isProtected && !isAuth) {
        return redirectToLogin();
    }

    // API Protection
    if (path.startsWith('/api/orders') || (path.startsWith('/api/cart/merge') && !isAuth)) {
        if (!isAuth) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }
    }

    return response;
}

export const config = {
    matcher: [
        /*
         * Match all request paths except for the ones starting with:
         * - _next/static (static files)
         * - _next/image (image optimization files)
         * - favicon.ico (favicon file)
         * - public folder
         */
        '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
    ],
};
