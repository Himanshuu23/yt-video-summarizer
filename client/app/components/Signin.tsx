"use client"

import { useCallback, useState } from "react";
import { SignInProps } from "../types/props";
import Password from "./PasswordInput";
import Email from "./EmailInput";
import { API_URL } from "../libs/api";
import { modalTitle, modalInput, modalPrimaryButton, modalLink } from "../libs/modalStyles";

export default function SignIn({
  email,
  password,
  setEmail,
  setPassword,
  setShowSignUp,
}: SignInProps) {
  const [name, setName] = useState<string>("")

  const signInUser = useCallback(async (name: string, email: string, password: string) => {
    await fetch(`${API_URL}/api/user`, {
      method: "POST",
      body: JSON.stringify({ name, email, password }),
      headers: { "Content-type": "application/json" },
    });
    setShowSignUp(false);
    setName("");
    setEmail("");
    setPassword("");
  }, [setShowSignUp, setEmail, setPassword]);

  return (
    <>
      <div className="flex flex-col gap-3">
        <div className={modalTitle}>Sign Up</div>
        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          type="text"
          placeholder="Full Name"
          className={modalInput}
        />
        <Email value={email} onChange={(e) => setEmail(e.target.value)} />
        <Password value={password} onChange={(e) => setPassword(e.target.value)} />
        <button onClick={() => signInUser(name, email, password)} className={modalPrimaryButton} type="button">
          Sign Up
        </button>
      </div>
      <button onClick={() => setShowSignUp(false)} className={modalLink} type="button">
        Already have an account? <span className="underline">Login</span>
      </button>
    </>
  )
}
