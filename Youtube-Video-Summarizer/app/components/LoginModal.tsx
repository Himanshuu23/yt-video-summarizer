import { useState } from "react";
import { signIn } from "next-auth/react";
import { LoginModalProps } from "../types/props";
import Login from "./Login";
import SignIn from "./Signin";

export default function LoginModal({ closeModal }: LoginModalProps) {
  const [showSignUp, setShowSignUp] = useState(false);

  const handleLogin = (provider: string) => {
    signIn(provider);
  };

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

        {showSignUp ? (
          <SignIn setShowSignUp={setShowSignUp} />
        ) : (
          <Login handleLogin={handleLogin} setShowSignUp={setShowSignUp} />
        )}
      </div>
    </div>
  );
}
