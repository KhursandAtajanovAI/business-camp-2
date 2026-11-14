// STUB (stage 0): returns no findings. Adilet replaces it with the real rule engine.
import type { Analysis, ParsedDocument } from "@/contracts";

export function analyze(documents: ParsedDocument[]): Analysis {
  return { documents, findings: [], totalAtStakeCents: 0, healthScore: 100 };
}
