import { useCallback, useEffect, useState } from "react";
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

  const getUserData = useCallback(async (email: string) => {
  const response = await fetch(`https://yt-video-summarizer-tzf8.vercel.app/api/user?email=${email}`, {
    method: "GET",
  });

  const result = await response.json();

  if (result) {
    setUserData({
      name: result.user.name,
      email: result.user.email,
      token: result.user.token,
      role: result.user.role,
    });

    setCookie(
      "user",
      JSON.stringify({
        name: result.user.name,
        email: result.user.email,
        token: result.user.token,
        role: result.user.role,
      })
    );
  }

  console.log(response);
}, [setUserData]);


  useEffect(() => {
    if (session && session?.user?.email) {
      closeModal()
      getUserData(session?.user?.email)
    }
  }, [session, closeModal, getUserData])

  return (
    <div
      className="fixed inset-0 backdrop-blur-md bg-black/35 bg-opacity-50 flex justify-center items-center z-50"
      onClick={closeModal}
    >
      <div
        className="relative backdrop-blur-md bg-black p-8 rounded-xl w-[80vw] sm:w-[400px]"
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
