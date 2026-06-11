"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  type ReactNode,
} from "react";
import { UserDataTypes } from "../types/user";
import { DEV_USER } from "../libs/devUser";
import { setCookie } from "../libs/cookie";

type AuthContextValue = {
  user: UserDataTypes;
  isAuthenticated: boolean;
  isLoading: boolean;
  setUser: (user: UserDataTypes) => void;
  refreshUser: () => Promise<UserDataTypes>;
  clearUser: () => void;
};

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  useEffect(() => {
    setCookie("user", JSON.stringify(DEV_USER));
  }, []);

  const setUser = useCallback((next: UserDataTypes) => {
    setCookie("user", JSON.stringify(next));
  }, []);

  const clearUser = useCallback(() => {
    setCookie("user", JSON.stringify(DEV_USER));
  }, []);

  const refreshUser = useCallback(async () => DEV_USER, []);

  const value = useMemo(
    () => ({
      user: DEV_USER,
      isAuthenticated: true,
      isLoading: false,
      setUser,
      refreshUser,
      clearUser,
    }),
    [setUser, refreshUser, clearUser]
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
