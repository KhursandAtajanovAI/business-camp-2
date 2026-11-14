import type { Plan } from "@/contracts";

export type PlanDetails = { name: string; priceCents: number; billing: "once" | "monthly"; summary: string };

// Prices are in cents. These two plans are the only ones in the product.
export const plans: Record<Plan, PlanDetails> = {
  one_time_29: {
    name: "One case",
    priceCents: 2900,
    billing: "once",
    summary: "The claim letter, the call script and your case file for this birth. Pay once.",
  },
  monthly_14_99: {
    name: "Monthly",
    priceCents: 1499,
    billing: "monthly",
    summary: "Everything in One case, for every new paper that arrives. Cancel any time.",
  },
};

export function isPlan(value: unknown): value is Plan {
  return typeof value === "string" && value in plans;
}

// Only paths inside our own site are allowed, so a link can never send a person elsewhere.
export function safeReturnPath(value: unknown): string {
  return typeof value === "string" && /^\/(?!\/)[\w\-./?=&%]*$/.test(value) ? value : "/";
}
