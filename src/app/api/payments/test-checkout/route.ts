import { newTestSessionId } from "@/payments/server/confirm-session";
import { stripeGateway } from "@/payments/server/gateway";
import { testCheckoutPage } from "@/payments/server/pages";
import { isPlan, safeReturnPath } from "@/payments/plans";

const html = (body: string, status = 200) => new Response(body, { status, headers: { "content-type": "text/html; charset=utf-8" } });

// The built-in practice checkout. It exists only while Stripe is not set up.
export async function GET(request: Request): Promise<Response> {
  const params = new URL(request.url).searchParams;
  const plan = params.get("plan");
  const returnTo = safeReturnPath(params.get("return_to"));
  let stripeIsSetUp = true;
  try {
    stripeIsSetUp = stripeGateway() !== null;
  } catch {
    stripeIsSetUp = true;
  }
  if (!isPlan(plan) || stripeIsSetUp) return Response.redirect(new URL(returnTo, request.url), 303);
  const payUrl = `/api/payments/return?return_to=${encodeURIComponent(returnTo)}&session_id=${newTestSessionId(plan)}`;
  return html(testCheckoutPage(plan, payUrl, returnTo));
}
