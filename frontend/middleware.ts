import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export async function middleware(request: NextRequest) {
  // Get the pathname
  const { pathname } = request.nextUrl;
  
  // Debug logging
  console.log('=== MIDDLEWARE DEBUG ===');
  console.log('Pathname:', pathname);
  console.log('Full URL:', request.url);
  console.log('Search params:', request.nextUrl.searchParams.toString());

  // Define routes that don't require authentication
  const publicRoutes = ['/', '/login'];
  const authRoutes = ['/api/auth'];  // This will match all auth-related routes
  const staticRoutes = ['/_next', '/static', '/favicon.ico'];
  
  // Check if it's an auth route first
  if (pathname.startsWith('/api/auth')) {
    console.log('Auth route detected, allowing through');
    return NextResponse.next();
  }

  // Check if the current route is public
  const isPublicRoute = publicRoutes.includes(pathname);
  const isAuthRoute = authRoutes.some(route => pathname.startsWith(route));
  const isStaticRoute = staticRoutes.some(route => pathname.startsWith(route));

  // Get authentication status
  const authCookie = request.cookies.get('appSession');
  const isAuthenticated = !!authCookie;

  // Debug route status
  console.log('Route checks:');
  console.log('- isPublicRoute:', isPublicRoute);
  console.log('- isAuthRoute:', isAuthRoute);
  console.log('- isStaticRoute:', isStaticRoute);
  console.log('- isAuthenticated:', isAuthenticated);
  console.log('- authCookie present:', !!authCookie);
  if (authCookie) {
    console.log('- authCookie value:', authCookie.value);
  }

  // Allow public and static routes
  if (isPublicRoute || isAuthRoute || isStaticRoute) {
    console.log('Route allowed (public/auth/static), proceeding');
    return NextResponse.next();
  }

  // Protected routes (like /weather)
  if (!isAuthenticated) {
    // Save the current URL to redirect back after login
    const loginUrl = new URL('/api/auth/login', request.url);
    loginUrl.searchParams.set('returnTo', pathname);
    console.log('Redirecting to login:', loginUrl.toString());
    return NextResponse.redirect(loginUrl);
  }

  // User is authenticated and accessing a protected route
  console.log('User authenticated, allowing access to protected route');
  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!_next/static|_next/image|favicon.ico).*)',
  ],
};
