'use client'

import { useState } from "react";
import { useSession } from "next-auth/react";
import Profile from "./Profile";
import LoginModal from "./LoginModal";
import { useAuth } from "../contexts/AuthContext";

export default function LoginButton() {
  const { user, setUser, clearUser } = useAuth();
  const { data: session } = useSession();
  const [isModalOpen, setIsModalOpen] = useState(false);

  if (!user) {
    return (
      <>
        <button
          onClick={() => setIsModalOpen(true)}
          className="text-white text-sm px-4 py-2 rounded-full bg-gray-700/50 hover:bg-gray-600/50"
        >
          Sign in
        </button>
        {isModalOpen && (
          <LoginModal
            session={session}
            closeModal={() => setIsModalOpen(false)}
            setIsLoggedIn={() => {}}
            setUserData={setUser}
          />
        )}
      </>
    );
  }

  return (
    <Profile userData={user} setUserData={setUser} onLogout={clearUser} />
  );
}
