'use client'

import React from "react";
import { useSession } from "next-auth/react"
import { useState } from "react";
import ReactDOM from "react-dom";
import LoginModal from "./LoginModal";
import Profile from "./Profile";
import { UserDataTypes } from "../types/user";

export default function LoginButton({ userData, setUserData }: { userData: UserDataTypes, setUserData: (data: UserDataTypes) => void }) {
 const { data: session, status } = useSession();
 const [isOpen, setIsOpen] = useState(false);
 const [isLoggedIn, setIsLoggedIn] = useState(false);

 const openModal = () => setIsOpen(true);
 const closeModal = () => setIsOpen(false);

 if ((status === "authenticated") || isLoggedIn) {
   return (
     <Profile session={session} setIsLoggedIn={setIsLoggedIn} userData={userData} isLoggedIn={isLoggedIn} />
   );
 }

  if (!session || !isLoggedIn) { 
    return (
      <div>
          <button
          onClick={openModal}
          className="text-white text-sm px-4 py-2 rounded-full bg-gray-700/50 hover:bg-gray-600/50"
          >
          Login
        </button>
        {isOpen && ReactDOM.createPortal(<LoginModal session={session} closeModal={closeModal} setIsLoggedIn={setIsLoggedIn} setUserData={setUserData} />, document.body)}
      </div>
    )
  }
}