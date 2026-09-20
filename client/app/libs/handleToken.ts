import { API_URL } from "./api";
import { UserDataTypes } from "../types/user";
import { setCookie } from "./cookie";

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

export function persistUser(user: UserDataTypes) {
    setCookie("user", JSON.stringify(user));
    if (typeof window !== "undefined") {
        window.dispatchEvent(new CustomEvent("summarify-user", { detail: user }));
    }
}

export function toPublicUser(data: { name: string; email: string; token: number; role: string }): UserDataTypes {
    return {
        name: data.name,
        email: data.email,
        token: data.token,
        role: data.role,
    };
}

export async function updateUserTokens(email: string, amount: number) {
    const response = await fetch(`${API_URL}/api/user/token`, {
      method: "PATCH",
      body: JSON.stringify({ email: email, amount: amount }),
      headers: { "Content-Type": "application/json" }
    })

    return response
}

export async function consumeFeatureTokens(
    user: UserDataTypes,
    features: string[],
    setUser: (user: UserDataTypes) => void
) {
    const cost = calculateTokenCost(features);
    if (cost <= 0 || !user.email) return;

    const response = await updateUserTokens(user.email, -cost);
    if (!response.ok) return;

    const data = await response.json();
    const next = toPublicUser(data);
    persistUser(next);
    setUser(next);
}