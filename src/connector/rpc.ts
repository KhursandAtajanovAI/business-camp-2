import { callTool, tools } from "./tools";

type RpcMessage = { jsonrpc?: string; id?: string | number | null; method?: string; params?: Record<string, unknown> };
type RpcReply = { jsonrpc: "2.0"; id: string | number | null; result?: unknown; error?: { code: number; message: string } };

const LATEST_PROTOCOL = "2025-06-18";
const SERVER = { name: "birth-bill-check", title: "Birth bill check", version: "0.1.0" };

const reply = (id: RpcMessage["id"], result: unknown): RpcReply => ({ jsonrpc: "2.0", id: id ?? null, result });
const fail = (id: RpcMessage["id"], code: number, message: string): RpcReply => ({ jsonrpc: "2.0", id: id ?? null, error: { code, message } });

// Answers one MCP message. Returns null for notifications, which expect no answer.
export async function handleOne(message: RpcMessage): Promise<RpcReply | null> {
  if (message?.jsonrpc !== "2.0" || typeof message.method !== "string") return fail(message?.id, -32600, "Invalid request");
  if (message.id === undefined) return null; // a notification, for example notifications/initialized

  switch (message.method) {
    case "initialize": {
      const asked = message.params?.protocolVersion;
      return reply(message.id, {
        protocolVersion: typeof asked === "string" ? asked : LATEST_PROTOCOL,
        capabilities: { tools: {} },
        serverInfo: SERVER,
        instructions: "Use check_birth_bill to check birth bills. Report only what the tool returns. Not medical or legal advice.",
      });
    }
    case "ping":
      return reply(message.id, {});
    case "tools/list":
      return reply(message.id, { tools });
    case "tools/call": {
      const name = message.params?.name;
      if (typeof name !== "string") return fail(message.id, -32602, "Missing tool name");
      return reply(message.id, await callTool(name, message.params?.arguments));
    }
    default:
      return fail(message.id, -32601, `Method not found: ${message.method}`);
  }
}
