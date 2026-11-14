// The only file other modules import from explain. Safe for the browser.
import type { Analysis } from "@/contracts";
import { localAnswer } from "./helper/local-answer";

export { explainFinding } from "./explain-finding";

// Answers a question about the person's own case. The server words the answer with a
// language model when one is set up; if the server cannot be reached, ordinary code
// answers from the same case data, so the helper never goes silent.
export async function askHelper(question: string, analysis: Analysis): Promise<string> {
  try {
    const response = await fetch("/api/helper", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ question, analysis }),
    });
    const result = (await response.json()) as { answer?: string };
    if (response.ok && result.answer) return result.answer;
  } catch {
    // No server (or no network): fall through to the local answer.
  }
  return localAnswer(question, analysis);
}
