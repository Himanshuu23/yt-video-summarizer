"use client";

import { persistUser, toPublicUser } from "../libs/handleToken";
import { API_URL } from "../libs/api";
import { LoginProps } from "../types/props";
import Email from "./EmailInput";
import GithubLogo from "./logos/Github";
import GoogleLogo from "./logos/Google";
import { modalTitle, modalDivider, modalInput, modalPrimaryButton, modalLink, oauthButton } from "../libs/modalStyles";
import { useState } from "react";
import { readApiError } from "../libs/apiError";

export default function Login({ email, password, setEmail, setPassword, handleLogin, setShowSignUp, closeModal, setIsLoggedIn, setUserData }: LoginProps) {
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function loginUser(email: string, password: string) {
    setError("");
    if (!email || !password) {
      setError("Email and password are required.");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch(`${API_URL}/api/user?email=${encodeURIComponent(email)}&password=${encodeURIComponent(password)}`, {
        method: "GET",
      });

      if (!res.ok) {
        setError(await readApiError(res, "Invalid email or password."));
        return;
      }

      const result = await res.json();
      if (result?.error || !result?.user) {
        setError(typeof result.error === "string" ? result.error : "Invalid email or password.");
        return;
      }

      const data = toPublicUser(result.user);
      persistUser(data);
      setUserData(data);
      setIsLoggedIn(true);
      setEmail("");
      setPassword("");
      closeModal();
    } catch {
      setError("Could not reach the server. Is the backend running?");
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      <div className={modalTitle}>Login</div>
      <div className="flex justify-center gap-4 mb-2">
        <button onClick={() => handleLogin("google")} className={oauthButton} type="button" aria-label="Login with Google">
          <div className="transform scale-110"><GoogleLogo /></div>
        </button>
        <button onClick={() => handleLogin("github")} className={oauthButton} type="button" aria-label="Login with GitHub">
          <div className="transform scale-110"><GithubLogo /></div>
        </button>
      </div>
      <div className={modalDivider}>OR</div>
      <div className="flex flex-col gap-3">
        <Email value={email} onChange={(e) => setEmail(e.target.value)} />
        <input
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          type="password"
          placeholder="Password"
          className={modalInput}
        />
        {error && <p className="text-sm text-red-400">{error}</p>}
        <button onClick={() => loginUser(email, password)} className={modalPrimaryButton} type="button" disabled={loading}>
          {loading ? "Signing in…" : "Login"}
        </button>
      </div>
      <button onClick={() => setShowSignUp(true)} className={modalLink} type="button">
        Don&apos;t have an account? <span className="underline">Sign up</span>
      </button>
    </>
  )
}
