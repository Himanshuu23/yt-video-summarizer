export async function updateUserRole(email: string, role: string) {
    const response = await fetch("http://localhost:8000/role", {
      method: "PATCH",
      body: JSON.stringify({ email: email, role: role }),
      headers: { "Application-Type": "application/json" }
    })

    console.log(response);
}