import { signIn } from "next-auth/react";
import GithubLogo from "./logos/Github";
import GoogleLogo from "./logos/Google";
import { LoginModalProps } from "../types/props";

 const handleLogin = (provider: string) => {
   signIn(provider);
 };
 
export default function LoginModal ({ closeModal }: LoginModalProps) {
  return (
   <div
     className="fixed inset-0 bg-gray-500 bg-opacity-50 flex justify-center items-center z-50"
     onClick={closeModal}
   >
     <div
       className="relative bg-black p-8 rounded-xl w-[80vw] sm:w-[400px]"
       onClick={(e) => e.stopPropagation()}
     >
       <button
         onClick={closeModal}
         className="absolute p-2 top-1 right-2 text-white text-4xl"
       >
         &times;
       </button>
       <div className="text-white text-center mb-4 font-bold text-2xl">Login using</div>
       <div className="flex justify-center space-x-4">
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
 )}