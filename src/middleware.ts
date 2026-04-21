import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const token = request.cookies.get('viewit_token')?.value;
  const { pathname } = request.nextUrl;

  // Protected routes
  const protectedRoutes = ['/dashboard', '/products', '/analytics', '/settings'];
  const isProtectedRoute = protectedRoutes.some(route => pathname.startsWith(route));

  // Auth routes (redirect to dashboard if logged in)
  const authRoutes = ['/login', '/register'];
  const isAuthRoute = authRoutes.some(route => pathname.startsWith(route));

  // Store routes are public
  if (pathname.startsWith('/store')) {
    return NextResponse.next();
  }

  // Handle protected routes
  if (isProtectedRoute && !token) {
    const url = new URL('/login', request.url);
    // Store the attempted URL to redirect back after login
    url.searchParams.set('from', pathname);
    return NextResponse.redirect(url);
  }

  // Handle auth routes
  if (isAuthRoute && token) {
    return NextResponse.redirect(new URL('/dashboard', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
};
