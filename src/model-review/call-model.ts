// Server only: the key never reaches the browser.
import type { Analysis } from "@/contracts";
import { buildFacts } from "./facts";
import type { LocalReason } from "./types";

const API_URL = "https://api.anthropic.com/v1/messages";
const DEFAULT_MODEL = "claude-haiku-5-5";

const SYSTEM = [
  "You explain findings on birth-related medical bills to a tired new parent in the US.",
  "You get FACTS as JSON: the bill lines and the findings that rules written in code have already made.",
  "For each finding, write up to two short plain sentences that point to the exact lines of this bill it is about.",
  "Also write a one-sentence summary of the whole case.",
  "Never add a finding, never change or invent an amount, never promise a refund, give no medical or legal advice.",
  "Use calm words, no jargon, no exclamation marks. Say 'money in question'.",
  'Answer with JSON only: {"summary": string, "explanations": [{"findingId": string, "text": string}]}',
].join(" ");

export type ModelReply = { ok: true; text: string } | { ok: false; reason: LocalReason };
type Fetcher = (url: string, init: RequestInit) => Promise<Response>;

export async function callModel(analysis: Analysis, apiKey: string, fetcher: Fetcher = fetch): Promise<ModelReply> {
  try {
    const response = await fetcher(API_URL, {
      method: "POST",
      headers: { "content-type": "application/json", "x-api-key": apiKey, "anthropic-version": "2023-06-01" },
      body: JSON.stringify({
        model: process.env.REVIEW_MODEL || DEFAULT_MODEL,
        max_tokens: 900,
        system: SYSTEM,
        messages: [{ role: "user", content: `FACTS (amounts in cents):\n${JSON.stringify(buildFacts(analysis))}` }],
      }),
      signal: AbortSignal.timeout(20_000),
    });
    if (response.status === 429 || response.status === 529) return { ok: false, reason: "model_busy" };
    if (!response.ok) return { ok: false, reason: "model_unreachable" };
    const data = (await response.json()) as { content?: { type: string; text?: string }[] };
    const text = data.content?.find((block) => block.type === "text")?.text?.trim() ?? "";
    return text ? { ok: true, text } : { ok: false, reason: "empty_answer" };
  } catch {
    return { ok: false, reason: "model_unreachable" };
  }
}
