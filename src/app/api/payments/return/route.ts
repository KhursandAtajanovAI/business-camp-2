import { returnPage } from "@/payments/server/pages";
import { safeReturnPath } from "@/payments/plans";

// Where Stripe (or the practice checkout) sends the person after paying.
export async function GET(request: Request): Promise<Response> {
  const params = new URL(request.url).searchParams;
  const sessionId = (params.get("session_id") ?? "").replace(/[^\w-]/g, "");
  const page = returnPage(sessionId, safeReturnPath(params.get("return_to")));
  return new Response(page, { headers: { "content-type": "text/html; charset=utf-8" } });
}
