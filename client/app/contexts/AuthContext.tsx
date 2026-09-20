"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { useSession } from "next-auth/react";
import { UserDataTypes } from "../types/user";
import { getCookie, removeCookie } from "../libs/cookie";
import { persistUser } from "../libs/handleToken";
import { syncUserFromSession } from "../libs/authUser";

type AuthContextValue = {
  user: UserDataTypes | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  setUser: (user: UserDataTypes) => void;
  refreshUser: () => Promise<UserDataTypes | null>;
  clearUser: () => void;
};

const AuthContext = createContext<AuthContextValue | null>(null);

function readCookieUser(): UserDataTypes | null {
  const raw = getCookie("user");
  if (!raw) return null;
  try {
    const parsed = JSON.parse(raw) as UserDataTypes;
    if (parsed?.email) return parsed;
  } catch {
    return null;
  }
  return null;
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const { data: session, status } = useSession();
  const [user, setUserState] = useState<UserDataTypes | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const setUser = useCallback((next: UserDataTypes) => {
    setUserState(next);
    persistUser(next);
  }, []);

  const clearUser = useCallback(() => {
    setUserState(null);
    removeCookie("user");
  }, []);

  useEffect(() => {
    const onUser = (event: Event) => {
      const detail = (event as CustomEvent<UserDataTypes>).detail;
      if (detail?.email) setUserState(detail);
    };
    window.addEventListener("summarify-user", onUser);
    return () => window.removeEventListener("summarify-user", onUser);
  }, []);

  useEffect(() => {
    let cancelled = false;

    async function sync() {
      if (status === "loading") return;

      if (session?.user?.email) {
        setIsLoading(true);
        const synced = await syncUserFromSession(session.user.email, session.user.name);
        if (!cancelled) {
          setUserState(synced);
          setIsLoading(false);
        }
        return;
      }

      const cookieUser = readCookieUser();
      if (!cancelled) {
        setUserState(cookieUser);
        setIsLoading(false);
      }
    }

    sync();
    return () => {
      cancelled = true;
    };
  }, [status, session?.user?.email, session?.user?.name]);

  const refreshUser = useCallback(async () => {
    if (session?.user?.email) {
      const synced = await syncUserFromSession(session.user.email, session.user.name);
      if (synced) setUser(synced);
      return synced;
    }
    const cookieUser = readCookieUser();
    setUserState(cookieUser);
    return cookieUser;
  }, [session?.user?.email, session?.user?.name, setUser]);

  const value = useMemo(
    () => ({
      user,
      isAuthenticated: !!user,
      isLoading,
      setUser,
      refreshUser,
      clearUser,
    }),
    [user, isLoading, setUser, refreshUser, clearUser]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return ctx;
}
