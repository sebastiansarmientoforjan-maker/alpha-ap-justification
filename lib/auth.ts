/**
 * Authentication Utilities
 * Server-side helpers for getting authenticated user from cookies
 */

import { cookies } from "next/headers";

export interface AuthUser {
  id: string;
  role: "student" | "admin";
}

/**
 * Get the currently authenticated user from cookies (server-side only)
 * Returns null if not authenticated
 *
 * TODO: Replace with Firebase Auth token verification
 */
export async function getAuthUser(): Promise<AuthUser | null> {
  const cookieStore = await cookies();

  const authToken = cookieStore.get("auth-token");
  const userRole = cookieStore.get("user-role");
  const userId = cookieStore.get("user-id");

  if (!authToken || !userRole || !userId) {
    return null;
  }

  // Validate role
  if (userRole.value !== "student" && userRole.value !== "admin") {
    return null;
  }

  return {
    id: userId.value,
    role: userRole.value as "student" | "admin",
  };
}

/**
 * Require authentication - throws if not authenticated
 * Use in server components that require auth
 */
export async function requireAuth(): Promise<AuthUser> {
  const user = await getAuthUser();

  if (!user) {
    throw new Error("Authentication required");
  }

  return user;
}

/**
 * Require specific role - throws if not authenticated or wrong role
 */
export async function requireRole(role: "student" | "admin"): Promise<AuthUser> {
  const user = await requireAuth();

  if (user.role !== role) {
    throw new Error(`Role '${role}' required`);
  }

  return user;
}

/**
 * Client-side: Get user ID from cookie
 * Use only in client components
 */
export function getClientUserId(): string | null {
  if (typeof window === "undefined") return null;

  const cookies = document.cookie.split("; ");
  const userIdCookie = cookies.find((c) => c.startsWith("user-id="));

  if (!userIdCookie) return null;

  return userIdCookie.split("=")[1];
}

/**
 * Client-side: Get user role from cookie
 */
export function getClientUserRole(): "student" | "admin" | null {
  if (typeof window === "undefined") return null;

  const cookies = document.cookie.split("; ");
  const roleCookie = cookies.find((c) => c.startsWith("user-role="));

  if (!roleCookie) return null;

  const role = roleCookie.split("=")[1];
  return role === "student" || role === "admin" ? role : null;
}
