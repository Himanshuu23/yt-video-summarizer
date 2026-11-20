import { API_URL } from "./api";
import { authHeaders, AUTH_COOKIE } from "./authHeaders";
import { removeCookie } from "./cookie";
import { persistUser, toPublicUser } from "./handleToken";
import { UserDataTypes } from "../types/user";

// Loads the signed-in user from the API using the auth token.
// (Arguments kept for backwards compatibility; identity now comes from the token, not the email.)
export async function syncUserFromSession(
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  _email?: string | null,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  _name?: string | null
): Promise<UserDataTypes | null> {
  const headers = await authHeaders();
  if (!headers.Authorization) return null;

  const response = await fetch(`${API_URL}/api/user/me`, {
    method: "GET",
    headers,
    cache: "no-store",
  });

  if (response.status === 401) {
    removeCookie(AUTH_COOKIE);
    removeCookie("user");
    return null;
  }

  if (!response.ok) return null;

  const result = await response.json();
  if (!result?.user?.email) return null;

  const data = toPublicUser(result.user);
  persistUser(data);
  return data;
}
