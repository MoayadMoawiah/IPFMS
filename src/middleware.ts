import { NextRequest, NextResponse } from 'next/server';

const PUBLIC_ROUTES = ['/login', '/forgot-password', '/reset-password'];
const AUTH_ROUTES = ['/login'];

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Allow Next.js internal routes and static files
  if (
    pathname.startsWith('/_next') ||
    pathname.startsWith('/api') ||
    pathname.startsWith('/brand') ||
    pathname.startsWith('/images') ||
    pathname.includes('.')
  ) {
    return NextResponse.next();
  }

  // Check if user has access token (stored in localStorage — readable from cookie via custom header)
  // Note: JWT is stored in localStorage, so server-side check uses a cookie set after login
  const sessionCookie = request.cookies.get('gpfms_session');
  const isLoggedIn = !!sessionCookie?.value;

  const isPublicRoute = PUBLIC_ROUTES.some((route) => pathname.startsWith(route));
  const isAuthRoute = AUTH_ROUTES.some((route) => pathname.startsWith(route));

  // Redirect authenticated users away from auth pages
  if (isLoggedIn && isAuthRoute) {
    return NextResponse.redirect(new URL('/dashboard', request.url));
  }

  // Redirect unauthenticated users to login (only for protected routes)
  if (!isLoggedIn && !isPublicRoute) {
    const loginUrl = new URL('/login', request.url);
    loginUrl.searchParams.set('from', pathname);
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico
     * - public files
     */
    '/((?!_next/static|_next/image|favicon.ico).*)',
  ],
};
