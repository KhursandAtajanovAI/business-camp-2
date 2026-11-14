import { handleConnectorMessage } from "@/connector";

const headers = { "access-control-allow-origin": "*", "access-control-allow-headers": "content-type, accept, mcp-protocol-version, mcp-session-id", "access-control-allow-methods": "POST, OPTIONS" };

// The MCP connector for ChatGPT and Claude. Stateless and read-only.
export async function POST(request: Request): Promise<Response> {
  const body: unknown = await request.json().catch(() => "unreadable");
  const answer = await handleConnectorMessage(body);
  if (answer.body === null) return new Response(null, { status: answer.status, headers });
  return Response.json(answer.body, { status: answer.status, headers });
}

export async function OPTIONS(): Promise<Response> {
  return new Response(null, { status: 204, headers });
}

// Assistants only POST here. A person who opens the address in a browser gets a short note.
export async function GET(): Promise<Response> {
  return new Response("This address is a connector for AI assistants (MCP). Add it in your assistant's connector settings.", { status: 405, headers: { ...headers, allow: "POST, OPTIONS" } });
}
