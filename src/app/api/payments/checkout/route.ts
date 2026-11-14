import { createCheckoutUrl } from "@/payments/server/create-session";
import { stripeGateway } from "@/payments/server/gateway";
import { isPlan, safeReturnPath } from "@/payments/plans";

export async function POST(request: Request): Promise<Response> {
  const body = (await request.json().catch(() => ({}))) as { plan?: unknown; returnTo?: unknown };
  if (!isPlan(body.plan)) return Response.json({ message: "Unknown plan." }, { status: 400 });
  try {
    const origin = process.env.NEXT_PUBLIC_SITE_URL || new URL(request.url).origin;
    const url = await createCheckoutUrl({ plan: body.plan, origin, returnTo: safeReturnPath(body.returnTo) }, stripeGateway());
    return Response.json({ url });
  } catch {
    return Response.json({ message: "We could not open the payment page." }, { status: 502 });
  }
}
