// The only file other modules import from explain. Safe for the browser.
import type { Analysis } from "@/contracts";

export { explainFinding } from "./explain-finding";

// STUB: the helper chat arrives in stage 3 (package A14).
export async function askHelper(_question: string, _analysis: Analysis): Promise<string> {
  return "The helper is not ready yet.";
}
