import { setCookie } from "../libs/cookie";
import { API_URL } from "../libs/api";
import { LoginProps } from "../types/props";
import Email from "./EmailInput";
import GithubLogo from "./logos/Github";
import GoogleLogo from "./logos/Google";
import { modalTitle, modalDivider, modalInput, modalPrimaryButton, modalLink, oauthButton } from "../libs/modalStyles";

export default function Login({ email, password, setEmail, setPassword, handleLogin, setShowSignUp, closeModal, setIsLoggedIn, setUserData }: LoginProps) {

  async function loginUser(email: string, password: string) {
    const res = await fetch(`${API_URL}/api/user?email=${email}&password=${password}`, {
      method: "GET",
    })

    const result = await res.json();

    if (result?.error || !result?.user) return;

    setIsLoggedIn(true)
    setUserData({
      name: result.user.name,
      email: result.user.email,
      token: result.user.token,
      role: result.user.role,
    })
    setCookie("user", JSON.stringify({
      name: result.user.name,
      email: result.user.email,
      token: result.user.token,
      role: result.user.role,
    }))

    setEmail("");
    setPassword("");
    closeModal();
  }

  return (
    <>
      <div className={modalTitle}>Login</div>
      <div className="flex justify-center gap-4 mb-2">
        <button onClick={() => handleLogin("google")} className={oauthButton} type="button" aria-label="Login with Google">
          <div className="transform scale-110"><GoogleLogo /></div>
        </button>
        <button onClick={() => handleLogin("github")} className={oauthButton} type="button" aria-label="Login with GitHub">
          <div className="transform scale-110"><GithubLogo /></div>
        </button>
      </div>
      <div className={modalDivider}>OR</div>
      <div className="flex flex-col gap-3">
        <Email value={email} onChange={(e) => setEmail(e.target.value)} />
        <input
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          type="password"
          placeholder="Password"
          className={modalInput}
        />
        <button onClick={() => loginUser(email, password)} className={modalPrimaryButton} type="button">
          Login
        </button>
      </div>
      <button onClick={() => setShowSignUp(true)} className={modalLink} type="button">
        Don&apos;t have an account? <span className="underline">Sign up</span>
      </button>
    </>
  )
}
