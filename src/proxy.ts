/**
 * Next.js Proxy for Route Protection
 *
 * This proxy runs on the Edge runtime and protects routes before
 * they're rendered. It checks for Firebase auth tokens and redirects
 * unauthenticated users.
 *
 * Note: Renamed from middleware.ts to proxy.ts for Next.js 16+ compatibility
 */

import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// Define protected and public routes
const protectedRoutes = ["/dashboard", "/profile"];

// Auth cookie name (Firebase sets this)
const AUTH_COOKIE_NAME = "__session";

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Check if user has auth token
  const authToken = request.cookies.get(AUTH_COOKIE_NAME)?.value;
  const isAuthenticated = !!authToken;

  // Check if route is protected
  const isProtectedRoute = protectedRoutes.some((route) =>
    pathname.startsWith(route),
  );

  // Redirect unauthenticated users from protected routes to signin
  if (isProtectedRoute && !isAuthenticated) {
    const signinUrl = new URL("/signin", request.url);
    signinUrl.searchParams.set("redirect", pathname);
    return NextResponse.redirect(signinUrl);
  }

  // Redirect authenticated users from signin to dashboard
  if (pathname === "/signin" && isAuthenticated) {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  // Redirect authenticated users from home to dashboard
  if (pathname === "/" && isAuthenticated) {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  return NextResponse.next();
}

// Configure which routes to run middleware on
export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public files (images, etc.)
     */
    "/((?!api|_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
