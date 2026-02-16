/**
 * Server-Side Authentication Utilities
 *
 * Use these utilities in Server Components and API routes
 * to verify authentication server-side.
 */

import { cookies } from "next/headers";

const AUTH_COOKIE_NAME = "__session";

/**
 * Check if user is authenticated (server-side)
 * Use this in Server Components and API routes
 */
export async function isAuthenticated(): Promise<boolean> {
  const cookieStore = await cookies();
  const authToken = cookieStore.get(AUTH_COOKIE_NAME);
  return !!authToken;
}

/**
 * Get auth token from cookie (server-side)
 */
export async function getServerAuthToken(): Promise<string | undefined> {
  const cookieStore = await cookies();
  return cookieStore.get(AUTH_COOKIE_NAME)?.value;
}

/**
 * Require authentication in Server Component
 * Throws error if not authenticated (will be caught by error boundary)
 */
export async function requireAuth(): Promise<void> {
  const authenticated = await isAuthenticated();
  if (!authenticated) {
    throw new Error("Unauthorized - Please sign in");
  }
}
