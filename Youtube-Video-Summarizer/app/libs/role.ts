export async function updateUserRole(email: string, role: string) {
    const response = await fetch("https://yt-video-summarizer-tzf8.vercel.app/api/role", {
      method: "PATCH",
      body: JSON.stringify({ email: email, role: role }),
      headers: { "Application-Type": "application/json" }
    })

    console.log(response);
}