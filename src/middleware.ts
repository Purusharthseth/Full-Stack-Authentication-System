import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
    const path = request.nextUrl.pathname;
    const isPublicPath = path === '/login' || path === '/signup';
    const token = request.cookies.get('token')?.value || "";
    const url = request.nextUrl.clone(); 
    if (path === '/') {
        url.pathname = token ? '/profile' : '/login';
        return NextResponse.redirect(url);
    }

    if (isPublicPath && token) {
        url.pathname = '/profile';
        return NextResponse.redirect(url);
    }

    if (!isPublicPath && !token) {
        url.pathname = '/login';
        return NextResponse.redirect(url);
    }

    return NextResponse.next();
}

export const config = {
    matcher: ['/', '/login', '/signup', '/profile/:path*'],
};
