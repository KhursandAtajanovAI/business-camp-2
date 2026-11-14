import { confirmSession } from "@/payments/server/confirm-session";
import { stripeGateway } from "@/payments/server/gateway";

export async function GET(request: Request): Promise<Response> {
  const sessionId = new URL(request.url).searchParams.get("session_id") ?? "";
  try {
    return Response.json(await confirmSession(sessionId, stripeGateway()));
  } catch {
    return Response.json({ paid: false, plan: null });
  }
}
