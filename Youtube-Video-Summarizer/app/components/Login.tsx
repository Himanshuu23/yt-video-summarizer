'use client'

import { signIn, signOut, useSession } from "next-auth/react"
import { useState } from "react";
import ReactDOM from "react-dom";
import GoogleLogo from "./logos/Google";
import GithubLogo from "./logos/Github";

export default function Login() {
 const { data: session } = useSession();
 const [isOpen, setIsOpen] = useState(false);

 const closeModal = () => setIsOpen(false);
 const openModal = () => setIsOpen(true);

 const handleLogin = (provider: string) => {
   signIn(provider);
 };

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

 const modalContent = (
   <div
     className="fixed inset-0 bg-gray-500 bg-opacity-50 flex justify-center items-center z-50"
     onClick={closeModal}
   >
     <div
       className="relative bg-black p-8 rounded-xl w-96"
       onClick={(e) => e.stopPropagation()}
     >
       <button
         onClick={closeModal}
         className="absolute p-2 top-1 right-2 text-white text-2xl"
       >
         &times;
       </button>
       <div className="text-white text-center mb-4">Login using</div>
       <div className="flex justify-center">
         <button onClick={() => handleLogin("google")} className="flex items-center justify-center w-12 h-12">
           <div className="transform scale-125">
             <GoogleLogo />
           </div>
         </button>
         <button onClick={() => handleLogin("github")} className="flex items-center justify-center w-12 h-12">
           <div className="transform scale-125">
             <GithubLogo />
           </div>
         </button>
       </div>
     </div>
   </div>
 );

 return (
   <div>
     <button
       onClick={openModal}
       className="text-white text-sm px-4 py-2 rounded-full bg-gray-700/50 hover:bg-gray-600/50"
     >
       Login
     </button>
     {isOpen && ReactDOM.createPortal(modalContent, document.body)}
   </div>
 );
}
