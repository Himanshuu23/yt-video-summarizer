const FEATURES = new Map([
    ["Questions & Answers", 40 ],
    ["Flowchart & Diagrams", 50 ],
    ["Translation Options", 30 ],
    ["Generate Pdf", 35 ],
])

export function calculateTokenCost(features: string[]) {
    let cost = 0;
    
    for (const feature of features) {
        cost += FEATURES.get(feature) || 0
    }

    return cost
}

export async function updateUserTokens(email: string, amount: number) {
    const response = await fetch("https://yt-video-summarizer-e4zp.onrender.com/api/user/token", {
      method: "PATCH",
      body: JSON.stringify({ email: email, amount: amount }),
      headers: { "Content-Type": "application/json" }
    })

    return response
}