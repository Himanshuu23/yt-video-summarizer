import { API_URL } from "./api";

export async function updateUserRole(email: string, role: string) {
    const response = await fetch(`${API_URL}/api/role`, {
      method: "PATCH",
      body: JSON.stringify({ email: email, role: role }),
      headers: { "Application-Type": "application/json" }
    })

    console.log(response);
}