import type { Plan } from "@/contracts";
import { plans, safeReturnPath } from "../plans";
import type { CheckoutGateway } from "./gateway";

type Request = { plan: Plan; origin: string; returnTo: string };

const returnUrl = (origin: string, returnTo: string) =>
  `${origin}/api/payments/return?return_to=${encodeURIComponent(safeReturnPath(returnTo))}`;

// With Stripe: a real hosted checkout page in test mode. Without: our own test checkout page.
export async function createCheckoutUrl(request: Request, gateway: CheckoutGateway | null): Promise<string> {
  const plan = plans[request.plan];
  const back = returnUrl(request.origin, request.returnTo);
  if (!gateway) {
    return `${request.origin}/api/payments/test-checkout?plan=${request.plan}&return_to=${encodeURIComponent(safeReturnPath(request.returnTo))}`;
  }
  const session = await gateway.create({
    mode: plan.billing === "monthly" ? "subscription" : "payment",
    line_items: [
      {
        quantity: 1,
        price_data: {
          currency: "usd",
          unit_amount: plan.priceCents,
          product_data: { name: `Birth bill check: ${plan.name}`, description: plan.summary },
          ...(plan.billing === "monthly" ? { recurring: { interval: "month" as const } } : {}),
        },
      },
    ],
    metadata: { plan: request.plan },
    success_url: `${back}&session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${request.origin}${safeReturnPath(request.returnTo)}`,
  });
  if (!session.url) throw new Error("Stripe did not return a checkout link.");
  return session.url;
}
