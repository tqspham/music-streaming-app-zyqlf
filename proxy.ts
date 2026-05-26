import { NextRequest, NextResponse } from 'next/server';

const publicAuthPaths = ['/auth/login', '/auth/signup'];
const apiAuthPaths = ['/api/auth'];
const protectedPaths = ['/player'];

export function proxy(request: NextRequest) {
  const pathname = request.nextUrl.pathname;
  const sessionToken = request.cookies.get('session_token')?.value;

  // Allow static/internal/next routes
  if (
    pathname.startsWith('/_next') ||
    pathname.startsWith('/favicon') ||
    pathname.includes('.') // files with extensions
  ) {
    return NextResponse.next();
  }

  // Allow auth API routes
  if (pathname.startsWith('/api/auth')) {
    return NextResponse.next();
  }

  // Allow other API routes (catalog, etc)
  if (pathname.startsWith('/api/')) {
    return NextResponse.next();
  }

  // Public auth routes - allow unauthenticated access
  if (publicAuthPaths.some((path) => pathname === path)) {
    // If already authenticated, redirect to player
    if (sessionToken) {
      return NextResponse.redirect(new URL('/player', request.url));
    }
    return NextResponse.next();
  }

  // Protected routes - require authentication
  if (protectedPaths.some((path) => pathname.startsWith(path))) {
    if (!sessionToken) {
      return NextResponse.redirect(new URL('/auth/login', request.url));
    }
    return NextResponse.next();
  }

  // Root path - redirect to login if not authenticated
  if (pathname === '/') {
    return NextResponse.next();
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'],
};
