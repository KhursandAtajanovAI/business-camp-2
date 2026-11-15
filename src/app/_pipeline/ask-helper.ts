import type { Analysis } from "@/contracts";
import { askHelper } from "@/explain";

// Who worded the answer: the language model on the server, or ordinary code (local).
export type HelperReply = { answer: string; answeredBy: "model" | "local" };

// Asks the helper about the person's own case and reports honestly who answered.
// The server says "model" only when a language model really wrote the words.
export async function askAboutCase(question: string, analysis: Analysis): Promise<HelperReply> {
  try {
    const response = await fetch("/api/helper", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ question, analysis }),
    });
    const result = (await response.json()) as { answer?: string; answeredBy?: string };
    if (response.ok && result.answer) return { answer: result.answer, answeredBy: result.answeredBy === "model" ? "model" : "local" };
  } catch {
    // The server could not be reached: answer below with ordinary code.
  }
  return { answer: await askHelper(question, analysis), answeredBy: "local" };
}
