import type { Analysis } from "@/contracts";
import { reviewOnServer } from "@/model-review/review";

const MAX_BODY_CHARS = 300_000;

function looksLikeAnalysis(value: unknown): value is Analysis {
  const candidate = value as Partial<Analysis> | null;
  return Boolean(candidate && Array.isArray(candidate.documents) && Array.isArray(candidate.findings) && typeof candidate.totalAtStakeCents === "number");
}

// The live model on the person's own papers. Owner: Khursand (calls src/model-review).
export async function POST(request: Request): Promise<Response> {
  const raw = await request.text();
  if (raw.length > MAX_BODY_CHARS) return Response.json({ message: "These papers are too long to explain in one go." }, { status: 413 });
  let analysis: unknown = null;
  try {
    analysis = (JSON.parse(raw) as { analysis?: unknown }).analysis;
  } catch {
    // handled below
  }
  if (!looksLikeAnalysis(analysis)) return Response.json({ message: "Please run the check first." }, { status: 400 });
  return Response.json(await reviewOnServer(analysis));
}

// Tells which mode the site is in, without spending a model call: "model" when a key is set.
export async function GET(): Promise<Response> {
  return Response.json({ mode: process.env.ANTHROPIC_API_KEY ? "model" : "local" });
}
