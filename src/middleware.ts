import type { NextRequest } from 'next/server';

import { NextResponse } from 'next/server';

export async function middleware(req: NextRequest) {
    const res = NextResponse.next();
    
    // Check for Payload auth token in cookies
    const token = req.cookies.get('payload-token')?.value;

    if (!token) {
        const loginUrl = new URL('/login', req.url);
        loginUrl.searchParams.set('returnTo', req.nextUrl.pathname);
        return NextResponse.redirect(loginUrl);
    }

    return res;
}

// Protect both pages and API routes
export const config = {
    matcher: [
        // '/admin/:path*',
        // '/home/:path*',
        '/messages/:path*',
        // '/chat/:path*',
        // '/api/chat/:path*',
        // '/api-doc/:path*',
    ],
};