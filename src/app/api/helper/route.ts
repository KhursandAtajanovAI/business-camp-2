import type { Analysis } from "@/contracts";
import { answerQuestion } from "@/explain/helper/answer";

const MAX_BODY_CHARS = 200_000;

function looksLikeAnalysis(value: unknown): value is Analysis {
  const candidate = value as Partial<Analysis> | null;
  return Boolean(candidate && Array.isArray(candidate.documents) && Array.isArray(candidate.findings) && typeof candidate.totalAtStakeCents === "number");
}

// The helper chat. Owner: Adilet (calls src/explain/helper).
export async function POST(request: Request): Promise<Response> {
  const raw = await request.text();
  if (raw.length > MAX_BODY_CHARS) return Response.json({ message: "That is a lot of text. Please ask a shorter question." }, { status: 413 });
  let body: { question?: unknown; analysis?: unknown } = {};
  try {
    body = JSON.parse(raw);
  } catch {
    // handled below as a missing question
  }
  if (typeof body.question !== "string" || body.question.trim() === "" || !looksLikeAnalysis(body.analysis)) {
    return Response.json({ message: "Please ask a question about your papers." }, { status: 400 });
  }
  return Response.json(await answerQuestion(body.question, body.analysis));
}
