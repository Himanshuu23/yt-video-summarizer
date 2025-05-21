import { LoginProps } from "../types/props";
import GithubLogo from "./logos/Github";
import GoogleLogo from "./logos/Google";

export default function Login({ email, password, setEmail, setPassword, handleLogin, setShowSignUp, session }: LoginProps) {
  
  async function loginUser(email: string, password: string) {
    const res = await fetch(`http://localhost:8000/user?email=${email}&password=${password}`, {
      method: "GET",
    })

    setEmail("");
    setPassword("");

    console.log(res);
  }

    return (
        <>
          <div className="text-white text-center mb-4 font-bold text-2xl">Login using</div>
            <div className="flex justify-center space-x-4 mb-4">
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
                    <div className="text-white text-center mb-4">--------- OR ---------</div>
                    <div className="flex flex-col space-y-3">
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
                      <button onClick={() => loginUser(email, password)} className="bg-blue-600 text-white p-2 rounded hover:bg-blue-700 transition">
                        Login
                      </button>
                    </div>
                    <button
                      onClick={() => setShowSignUp(true)}
                      className="text-white text-sm text-center mt-4"
                    >
                      Don’t have an account?{" "}
                      <span className="underline cursor-pointer">Sign up</span>
                    </button>
                  </>
    )
}