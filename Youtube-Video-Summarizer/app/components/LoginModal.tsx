import { useEffect, useState } from "react";
import { signIn } from "next-auth/react";
import { LoginModalProps } from "../types/props";
import Login from "./Login";
import SignIn from "./Signin";
import { setCookie } from "../libs/cookie";

export default function LoginModal({ session, closeModal, setIsLoggedIn, setUserData }: LoginModalProps) {
  const [showSignUp, setShowSignUp] = useState(false);
  const [email, setEmail] = useState<string>("")
  const [password, setPassword] = useState<string>("")

  const handleLogin = (provider: string) => {
    signIn(provider);
  };

  async function getUserData(email: string) {
    const response = await fetch(`http://localhost:8000/user?email=${email}`, {
      method: "GET"
    })

    const result = await response.json();
    {result && setUserData({
      name: result.name,
      email: result.email,
      token: result.token,
      role: result.role,
    })}

    setCookie("user", JSON.stringify({ name: result.name, email: result.email, token: result.token, role: result.token }))
    
    console.log(response);
  }

  useEffect(() => {
    if (session && session?.user?.email) {
      closeModal()
      getUserData(session?.user?.email)
    }
  }, [session])

  async function updateUserRole(email: string, role: string) {
    const response = await fetch("http://localhost:8000/role", {
      method: "PATCH",
      body: JSON.stringify({ email: email, role: role }),
      headers: { "Application-Type": "application/json" }
    })

    console.log(response);
  }

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
          <SignIn email={email} password={password} setEmail={setEmail} setPassword={setPassword} setShowSignUp={setShowSignUp} session={session} />
        ) : (
          <Login email={email} password={password} setEmail={setEmail} setPassword={setPassword} handleLogin={handleLogin} setShowSignUp={setShowSignUp} closeModal={closeModal} setIsLoggedIn={setIsLoggedIn} setUserData={setUserData} />
        )}
      </div>
    </div>
  );
}
