import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

/**
 * Authentication & Authorization Middleware
 *
 * Protects routes based on user authentication and role
 * - /admin/* requires authenticated admin user
 * - /student/* requires authenticated student user
 * - Public routes: /, /login, /api/*
 */

// Public routes that don't require authentication
const PUBLIC_ROUTES = ['/', '/login', '/unauthorized'];

// Route patterns that require authentication
const PROTECTED_ROUTES = {
  admin: /^\/admin/,
  student: /^\/student/,
};

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Allow public routes
  if (PUBLIC_ROUTES.includes(pathname)) {
    return NextResponse.next();
  }

  // Allow API routes (they handle their own auth)
  if (pathname.startsWith('/api')) {
    return NextResponse.next();
  }

  // Allow static files and images
  if (
    pathname.startsWith('/_next') ||
    pathname.startsWith('/assets') ||
    pathname.match(/\.(png|jpg|jpeg|gif|svg|webp|ico)$/)
  ) {
    return NextResponse.next();
  }

  // Check for authentication token
  // TODO: Replace with actual Firebase Auth token verification
  const authToken = request.cookies.get('auth-token');
  const userRole = request.cookies.get('user-role');

  // No auth token - redirect to login
  if (!authToken || !userRole) {
    const loginUrl = new URL('/login', request.url);
    loginUrl.searchParams.set('from', pathname);
    return NextResponse.redirect(loginUrl);
  }

  // Check admin routes
  if (PROTECTED_ROUTES.admin.test(pathname)) {
    if (userRole.value !== 'admin') {
      return NextResponse.redirect(new URL('/unauthorized', request.url));
    }
  }

  // Check student routes
  if (PROTECTED_ROUTES.student.test(pathname)) {
    if (userRole.value !== 'student') {
      return NextResponse.redirect(new URL('/unauthorized', request.url));
    }
  }

  // Add security headers
  const response = NextResponse.next();

  // Prevent clickjacking
  response.headers.set('X-Frame-Options', 'DENY');

  // Prevent MIME type sniffing
  response.headers.set('X-Content-Type-Options', 'nosniff');

  // Enable XSS protection
  response.headers.set('X-XSS-Protection', '1; mode=block');

  // Referrer policy
  response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');

  return response;
}

export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public files (images, etc)
     */
    '/((?!_next/static|_next/image|favicon.ico|assets).*)',
  ],
};
