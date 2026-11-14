import type { Plan } from "@/contracts";
import { isPlan } from "../plans";
import type { CheckoutGateway } from "./gateway";

export type Confirmation = { paid: boolean; plan: Plan | null };

const TEST_SESSION = /^test_(one_time_29|monthly_14_99)_[a-z0-9]{6,}$/;

export function newTestSessionId(plan: Plan): string {
  return `test_${plan}_${Math.random().toString(36).slice(2, 10)}`;
}

// Asks Stripe whether the session was really paid. Built-in test sessions count
// only when Stripe is not set up, so they can never open access on a real setup.
export async function confirmSession(sessionId: string, gateway: CheckoutGateway | null): Promise<Confirmation> {
  if (!gateway) {
    const match = sessionId.match(TEST_SESSION);
    return match ? { paid: true, plan: match[1] as Plan } : { paid: false, plan: null };
  }
  try {
    const session = await gateway.retrieve(sessionId);
    const plan = session.metadata?.plan;
    const paid = session.payment_status === "paid" && isPlan(plan);
    return { paid, plan: paid ? (plan as Plan) : null };
  } catch {
    return { paid: false, plan: null };
  }
}
