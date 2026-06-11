'use client'

import Profile from "./Profile";
import { useAuth } from "../contexts/AuthContext";

export default function LoginButton() {
  const { user, setUser } = useAuth();

  return (
    <Profile userData={user} setUserData={setUser} onLogout={() => window.location.reload()} />
  );
}
