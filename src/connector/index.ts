// The only file the connector route imports.
import { handleOne } from "./rpc";

export type ConnectorAnswer = { status: number; body: unknown | null };

// Takes the parsed JSON body of one HTTP request (a single message or a batch)
// and returns what to send back. Status 202 with no body means "noted, nothing to answer".
export async function handleConnectorMessage(body: unknown): Promise<ConnectorAnswer> {
  if (Array.isArray(body)) {
    const replies = (await Promise.all(body.map((message) => handleOne(message)))).filter((item) => item !== null);
    return replies.length > 0 ? { status: 200, body: replies } : { status: 202, body: null };
  }
  if (typeof body !== "object" || body === null) {
    return { status: 400, body: { jsonrpc: "2.0", id: null, error: { code: -32700, message: "Parse error" } } };
  }
  const answer = await handleOne(body);
  return answer ? { status: 200, body: answer } : { status: 202, body: null };
}
