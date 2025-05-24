"use client"

import { useEffect, useState } from "react";
import { SignInProps } from "../types/props";

export default function SignIn ({ email, password, setEmail, setPassword, setShowSignUp, session }: SignInProps) {
  const [name, setName] = useState<string>("")

  async function signInUser(name: string, email: string, password: string) {
    const res = await fetch("http://localhost:8000/user", {
      method: "POST",
      body: JSON.stringify({ name: name, email: email, password: password }),
      headers: { "Content-type": "application/json" },
    })
    setShowSignUp(false);
    setName("");
    setEmail("");
    setPassword("");

    console.log(res);
  }

  useEffect(() => {
  if (session?.user?.email && session?.user?.name) {
    signInUser(session.user.name, session.user.email, "password");
  }
  }, [session]);

  return (
  <>
    <div className="flex flex-col space-y-3 mt-6">
      <input
        value={name}
        onChange={(e) => setName(e.target.value)}
        type="text"
        placeholder="Full Name"
        className="p-2 rounded bg-gray-800 text-white placeholder-gray-400"
      />
      <input
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        type="email"
        placeholder="Email"
        className="p-2 rounded bg-gray-800 text-white placeholder-gray-400"
      />
      <input
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        type="password"
        placeholder="Password"
        className="p-2 rounded bg-gray-800 text-white placeholder-gray-400"
      />
      <button onClick={() => signInUser(name, email, password)} className="bg-blue-600 text-white p-2 rounded hover:bg-blue-700 transition">
        Sign Up
      </button>
    </div>
    <button onClick={() => setShowSignUp(false)} className="text-white text-sm text-center mt-4">
      Already have an account? <span className="underline cursor-pointer">Login</span>
    </button>
  </>
  )
};
