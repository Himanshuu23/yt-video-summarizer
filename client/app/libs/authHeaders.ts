import { getSession } from "next-auth/react";
import { getCookie } from "./cookie";

export const AUTH_COOKIE = "auth_token";

type BackendSession = { backendToken?: string } | null;

// OAuth users: token comes from the NextAuth session (issued server-side).
// Email/password users: token is stored in a cookie after login.
export async function getAuthToken(): Promise<string | null> {
  try {
    const session = (await getSession()) as BackendSession;
    if (session?.backendToken) return session.backendToken;
  } catch {
    /* fall through to cookie */
  }
  return getCookie(AUTH_COOKIE) ?? null;
}

export async function authHeaders(extra: Record<string, string> = {}): Promise<Record<string, string>> {
  const token = await getAuthToken();
  return token ? { ...extra, Authorization: `Bearer ${token}` } : { ...extra };
}
