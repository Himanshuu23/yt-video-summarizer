import { API_URL } from "./api";
import { setCookie } from "./cookie";
import { UserDataTypes } from "../types/user";

export async function syncUserFromSession(
  email: string,
  name?: string | null
): Promise<UserDataTypes | null> {
  const params = new URLSearchParams({ email });
  if (name) params.set("name", name);

  const response = await fetch(
    `${API_URL}/api/user/sync?${params.toString()}`,
    { method: "GET", cache: "no-store" }
  );

  if (!response.ok) return null;

  const result = await response.json();
  if (!result?.user?.email) return null;

  const data: UserDataTypes = {
    name: result.user.name,
    email: result.user.email,
    token: result.user.token,
    role: result.user.role,
  };

  setCookie("user", JSON.stringify(data));
  return data;
}
