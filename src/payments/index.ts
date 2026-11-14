// The only file screens import from payments. Safe for the browser: no Stripe code here.
import type { Plan } from "@/contracts";
import { readPayment } from "./client/payment-store";

export { plans, type PlanDetails } from "./plans";

export class PaymentError extends Error {
  readonly nextStep = "Nothing was charged. Please try again in a moment.";
}

// Returns the link to the payment page for the chosen plan. Send the person there.
// After paying they come back to returnTo (a path on our site, "/" by default).
export async function startCheckout(plan: Plan, returnTo = "/"): Promise<string> {
  try {
    const response = await fetch("/api/payments/checkout", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ plan, returnTo }),
    });
    const result = (await response.json()) as { url?: string };
    if (!response.ok || !result.url) throw new Error("no link");
    return result.url;
  } catch {
    throw new PaymentError("We could not open the payment page.");
  }
}

// True once a payment was confirmed in this browser. Free check stays open either way.
export function hasPaid(): boolean {
  return readPayment() !== null;
}

export function paidPlan(): Plan | null {
  return readPayment()?.plan ?? null;
}
