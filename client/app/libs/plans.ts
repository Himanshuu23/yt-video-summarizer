export type PaidPlanId = "PRO" | "PREMIUM";

export type PlanId = "FREE" | PaidPlanId;

export const PLAN_DETAILS: Record<
  PlanId,
  {
    name: string;
    priceLabel: string;
    amountUsd: number;
    tokens: number;
    description: string;
    features: string[];
  }
> = {
  FREE: {
    name: "Free",
    priceLabel: "Free",
    amountUsd: 0,
    tokens: 100,
    description: "A great starting point with essential features.",
    features: [
      "Basic video and document summaries",
      "Limited summarization length",
      "Single language",
      "Text narration",
      "Basic PDF download",
    ],
  },
  PRO: {
    name: "Pro",
    priceLabel: "$5",
    amountUsd: 5,
    tokens: 250,
    description: "Unlock premium features for an enhanced experience.",
    features: [
      "Detailed summaries + questions",
      "Multiple languages",
      "Higher length limits",
      "Diagrams and flowcharts",
      "Customizable PDF themes",
    ],
  },
  PREMIUM: {
    name: "Premium",
    priceLabel: "$12",
    amountUsd: 12,
    tokens: 600,
    description: "Best quality for heavy study sessions.",
    features: [
      "Highest quality summaries and quizzes",
      "Multiple languages",
      "Largest upload limits",
      "Diagrams and flowcharts",
      "Customizable PDF themes",
    ],
  },
};

export function planRank(role: string): number {
  if (role === "PREMIUM") return 2;
  if (role === "PRO") return 1;
  return 0;
}
