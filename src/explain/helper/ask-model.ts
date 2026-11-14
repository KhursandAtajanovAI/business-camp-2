// Server only: the key never reaches the browser. Called by src/app/api/helper.
import type { Analysis } from "@/contracts";
import { explainFinding } from "../explain-finding";

const API_URL = "https://api.anthropic.com/v1/messages";
const DEFAULT_MODEL = "claude-haiku-5-5";

const SYSTEM = [
  "You are a calm, kind helper on a website that checks birth-related medical bills for new parents in the US.",
  "Answer only from the CASE FACTS below. Every amount and finding must come from them; never add or change a number or a finding.",
  "If the answer is not in the facts, say you do not know and suggest asking the billing office.",
  "Say 'money in question'. Never promise a refund or any result. Give no medical advice and no legal advice.",
  "Use plain words, no jargon, at most four short sentences, no exclamation marks.",
].join(" ");

// Only what the engine found goes to the model. A ParsedDocument carries no name,
// address or policy number, and the provider name is not personal data.
export function buildCaseFacts(analysis: Analysis): string {
  return JSON.stringify({
    totalInQuestionCents: analysis.totalAtStakeCents,
    healthScore: analysis.healthScore,
    papers: analysis.documents.map((document) => ({ kind: document.kind, provider: document.provider, issuedOn: document.issuedOn, totalCents: document.totalCents, patientBalanceCents: document.patientBalanceCents })),
    findings: analysis.findings.map((finding) => ({ title: finding.title, inQuestionCents: finding.atStakeCents, confidence: finding.confidence, explanation: explainFinding(finding) })),
  });
}

type Fetcher = (url: string, init: RequestInit) => Promise<Response>;

// Returns the model's answer, or null when the model cannot be reached, so the caller can fall back.
export async function askModel(safeQuestion: string, analysis: Analysis, apiKey: string, fetcher: Fetcher = fetch): Promise<string | null> {
  try {
    const response = await fetcher(API_URL, {
      method: "POST",
      headers: { "content-type": "application/json", "x-api-key": apiKey, "anthropic-version": "2023-06-01" },
      body: JSON.stringify({
        model: process.env.HELPER_MODEL || DEFAULT_MODEL,
        max_tokens: 300,
        system: `${SYSTEM}\n\nCASE FACTS (amounts in cents):\n${buildCaseFacts(analysis)}`,
        messages: [{ role: "user", content: safeQuestion.slice(0, 1000) }],
      }),
    });
    if (!response.ok) return null;
    const data = (await response.json()) as { content?: { type: string; text?: string }[] };
    const text = data.content?.find((block) => block.type === "text")?.text?.trim();
    return text || null;
  } catch {
    return null;
  }
}
