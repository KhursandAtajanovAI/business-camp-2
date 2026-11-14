import Stripe from "stripe";

// The small part of Stripe we use. Tests pass a fake with the same shape.
export type CheckoutGateway = {
  create(params: Stripe.Checkout.SessionCreateParams): Promise<{ url: string | null }>;
  retrieve(sessionId: string): Promise<{ payment_status: string; metadata: Record<string, string> | null }>;
};

export class PaymentConfigError extends Error {}

// Returns null when no key is set: the site then uses its built-in test checkout.
export function stripeGateway(secretKey: string | undefined = process.env.STRIPE_SECRET_KEY): CheckoutGateway | null {
  if (!secretKey) return null;
  if (!secretKey.startsWith("sk_test_")) {
    throw new PaymentConfigError("Only Stripe test keys are allowed in this build.");
  }
  const stripe = new Stripe(secretKey);
  return {
    create: (params) => stripe.checkout.sessions.create(params),
    retrieve: (sessionId) => stripe.checkout.sessions.retrieve(sessionId),
  };
}
