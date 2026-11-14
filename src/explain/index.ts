// STUB (stage 0): Adilet replaces it with real plain-English explanations.
import type { Analysis, Finding } from "@/contracts";

export function explainFinding(finding: Finding): string {
  return finding.title;
}

export async function askHelper(_question: string, _analysis: Analysis): Promise<string> {
  return "The helper is not ready yet.";
}
