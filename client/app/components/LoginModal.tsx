"use client";

import { useCallback, useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { signIn } from "next-auth/react";
import { LoginModalProps } from "../types/props";
import Login from "./Login";
import SignIn from "./Signin";
import { syncUserFromSession } from "../libs/authUser";
import { modalOverlay, modalPanel } from "../libs/modalStyles";

export default function LoginModal({ session, closeModal, setIsLoggedIn, setUserData }: LoginModalProps) {
  const [showSignUp, setShowSignUp] = useState(false);
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");

  const handleLogin = (provider: string) => {
    signIn(provider, { callbackUrl: window.location.href });
  };

  const getUserData = useCallback(async (userEmail: string, name?: string | null) => {
    const data = await syncUserFromSession(userEmail, name);
    if (data) {
      setUserData(data);
      setIsLoggedIn(true);
      closeModal();
    }
  }, [setUserData, setIsLoggedIn, closeModal]);

  useEffect(() => {
    if (session?.user?.email) {
      getUserData(session.user.email, session.user.name);
    }
  }, [session, getUserData]);

  return createPortal(
    <div className={modalOverlay} onClick={closeModal}>
      <div className={modalPanel} onClick={(e) => e.stopPropagation()}>
        <button
          onClick={closeModal}
          className="absolute top-3 right-4 text-white/60 hover:text-white text-2xl leading-none transition-colors"
          aria-label="Close"
        >
          &times;
        </button>

        {showSignUp ? (
          <SignIn
            email={email}
            password={password}
            setEmail={setEmail}
            setPassword={setPassword}
            setShowSignUp={setShowSignUp}
            session={session}
          />
        ) : (
          <Login
            email={email}
            password={password}
            setEmail={setEmail}
            setPassword={setPassword}
            handleLogin={handleLogin}
            setShowSignUp={setShowSignUp}
            closeModal={closeModal}
            setIsLoggedIn={setIsLoggedIn}
            setUserData={setUserData}
          />
        )}
      </div>
    </div>,
    document.body
  );
}
