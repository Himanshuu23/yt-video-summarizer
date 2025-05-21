'use client'

import React from "react";
import { signOut, useSession } from "next-auth/react"
import { useState } from "react";
import ReactDOM from "react-dom";
import LoginModal from "./LoginModal";

export default function LoginButton() {
 const { data: session } = useSession();
 const [isOpen, setIsOpen] = useState(false);

 const openModal = () => setIsOpen(true);
 const closeModal = () => setIsOpen(false);

 if (session) {
   return (
     <div>
       <button
         className="text-white text-sm px-4 py-2 rounded-full bg-gray-700/50 hover:bg-gray-600/50"
         onClick={() => signOut()}
       >
         Logout
       </button>
     </div>
   );
 }

 return (
   <div>
     <button
       onClick={openModal}
       className="text-white text-sm px-4 py-2 rounded-full bg-gray-700/50 hover:bg-gray-600/50"
     >
       Login
     </button>
     {isOpen && ReactDOM.createPortal(<LoginModal closeModal={closeModal} />, document.body)}
   </div>
 );
}