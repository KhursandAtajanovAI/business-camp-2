import { expect, test } from "vitest";
import { sampleBillText } from "@/intake/fixtures";
import { handleConnectorMessage } from "./index";

const call = (method: string, params?: Record<string, unknown>) => handleConnectorMessage({ jsonrpc: "2.0", id: 1, method, params });

test("an assistant can say hello and learns we offer tools", async () => {
  const { status, body } = await call("initialize", { protocolVersion: "2025-03-26", capabilities: {}, clientInfo: { name: "test", version: "1" } });
  expect(status).toBe(200);
  expect(body).toMatchObject({ id: 1, result: { protocolVersion: "2025-03-26", capabilities: { tools: {} }, serverInfo: { name: "birth-bill-check" } } });
});

test("a notification needs no answer", async () => {
  expect(await handleConnectorMessage({ jsonrpc: "2.0", method: "notifications/initialized" })).toEqual({ status: 202, body: null });
});

test("the tool list has one read-only tool", async () => {
  const { body } = await call("tools/list");
  const tools = (body as { result: { tools: { name: string; annotations: { readOnlyHint: boolean } }[] } }).result.tools;
  expect(tools.map((tool) => tool.name)).toEqual(["check_birth_bill"]);
  expect(tools[0].annotations.readOnlyHint).toBe(true);
});

test("an assistant can read a bill review through the connector", async () => {
  const { body } = await call("tools/call", { name: "check_birth_bill", arguments: { papers: [sampleBillText] } });
  const result = (body as { result: { content: { text: string }[]; isError?: boolean } }).result;
  expect(result.isError).toBeUndefined();
  const review = JSON.parse(result.content[0].text);
  expect(review.papers[0]).toMatchObject({ kind: "hospital_bill_mother", provider: "Riverside Women's Hospital", totalCents: 1_124_100, lineCount: 5 });
  expect(review.note).toContain("not a promise of a refund");
  expect(Array.isArray(review.findings)).toBe(true);
});

test("the review never contains personal data from the paper", async () => {
  const { body } = await call("tools/call", { name: "check_birth_bill", arguments: { papers: [sampleBillText] } });
  const text = JSON.stringify(body);
  for (const secret of ["Jane", "Maple Street", "XKT445821907", "GRP-778812", "88213377"]) expect(text).not.toContain(secret);
});

test("bad input gets a clear message instead of a crash", async () => {
  const empty = await call("tools/call", { name: "check_birth_bill", arguments: { papers: [] } });
  expect((empty.body as { result: { isError: boolean } }).result.isError).toBe(true);
  const noCharges = await call("tools/call", { name: "check_birth_bill", arguments: { papers: ["Thank you for choosing our hospital today."] } });
  expect((noCharges.body as { result: { content: { text: string }[] } }).result.content[0].text).toContain("dollar amounts");
  expect((await call("resources/list")).body).toMatchObject({ error: { code: -32601 } });
  expect((await handleConnectorMessage("not json")).status).toBe(400);
});
