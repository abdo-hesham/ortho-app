/**
 * Authentication Session Management
 *
 * Handles Firebase auth tokens and session cookies for
 * secure server-side authentication checks.
 */

"use client";

import { User as FirebaseUser } from "firebase/auth";
import Cookies from "js-cookie";

// Cookie configuration
const AUTH_COOKIE_NAME = "__session";
const COOKIE_OPTIONS = {
  secure: process.env.NODE_ENV === "production",
  sameSite: "lax" as const,
  expires: 14, // 14 days
};

/**
 * Set authentication cookie when user signs in
 */
export const setAuthCookie = async (user: FirebaseUser): Promise<void> => {
  try {
    const token = await user.getIdToken();
    Cookies.set(AUTH_COOKIE_NAME, token, COOKIE_OPTIONS);
  } catch (error) {
    console.error("Error setting auth cookie:", error);
  }
};

/**
 * Remove authentication cookie when user signs out
 */
export const removeAuthCookie = (): void => {
  Cookies.remove(AUTH_COOKIE_NAME);
};

/**
 * Refresh authentication cookie
 */
export const refreshAuthCookie = async (user: FirebaseUser): Promise<void> => {
  try {
    const token = await user.getIdToken(true); // Force refresh
    Cookies.set(AUTH_COOKIE_NAME, token, COOKIE_OPTIONS);
  } catch (error) {
    console.error("Error refreshing auth cookie:", error);
  }
};

/**
 * Get current token from cookie
 */
export const getAuthToken = (): string | undefined => {
  return Cookies.get(AUTH_COOKIE_NAME);
};
