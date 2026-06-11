import { Session } from "next-auth";
import { syncUserFromSession } from "./authUser";
import { getCookie, setCookie } from "./cookie";
import { UserDataTypes } from "../types/user";

export function readUserFromCookie(): UserDataTypes | null {
  const raw = getCookie("user");
  if (!raw) return null;
  try {
    const parsed = JSON.parse(raw);
    if (parsed?.email) return parsed;
  } catch {
    /* ignore */
  }
  return null;
}

export function userFromSession(session: Session | null): UserDataTypes | null {
  if (!session?.user?.email) return null;

  return {
    name: session.user.name || session.user.email.split("@")[0],
    email: session.user.email,
    token: 100,
    role: "FREE",
  };
}

export async function resolveAppUser(session: Session | null): Promise<UserDataTypes | null> {
  const fromCookie = readUserFromCookie();
  if (fromCookie) return fromCookie;

  if (session?.user?.email) {
    try {
      const synced = await syncUserFromSession(session.user.email, session.user.name);
      if (synced) return synced;
    } catch {
      /* ignore */
    }

    const fallback = userFromSession(session);
    if (fallback) {
      setCookie("user", JSON.stringify(fallback));
      return fallback;
    }
  }

  return null;
}
