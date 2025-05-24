const FEATURES = new Map([
    ["Questions & Answers", 40 ],
    ["Flowchart & Diagrams", 50 ],
    ["Translation Options", 30 ],
    ["Generate Pdf", 35 ],
])

function calculateTokenCost(features: string[]) {
    let cost = 0;
    
    for (const feature of features) {
        cost += FEATURES.get(feature) || 0
    }

    return cost
}

async function updateUserTokens(email: string, amount: number) {
    const response = await fetch("http://localhost:8000/token", {
      method: "PATCH",
      body: JSON.stringify({ email: email, amount: amount }),
      headers: { "Application-Type": "application/json" }
    })

    return response
}

module.exports = {
    calculateTokenCost,
    updateUserTokens,
}