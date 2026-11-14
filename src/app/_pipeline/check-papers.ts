// The one road every paper takes, a sample and a real upload alike:
// read it (src/intake) -> look for things worth asking about (src/engine).
import type { Analysis, ParsedDocument } from "@/contracts";
import { analyze } from "@/engine";
import { parseDocument } from "@/intake";
import { samplePaperText } from "./sample-paper";
import { stubFindings, stubHealthScore } from "./stub-findings";

export async function readPaper(input: File | string, isDemo = false): Promise<ParsedDocument> {
  return parseDocument(input, { isDemo });
}

export function checkPapers(documents: ParsedDocument[]): Analysis {
  const analysis = analyze(documents);
  if (analysis.findings.length > 0) return analysis;
  // STUB: the engine is not merged yet, so two simple checks stand in for it.
  const findings = stubFindings(documents);
  if (findings.length === 0) return analysis;
  const totalAtStakeCents = findings.reduce((sum, finding) => sum + finding.atStakeCents, 0);
  return { documents, findings, totalAtStakeCents, healthScore: stubHealthScore(findings.length) };
}

// Adding a paper again replaces the old copy instead of doubling it.
export function addPaper(documents: ParsedDocument[], paper: ParsedDocument): ParsedDocument[] {
  return [...documents.filter((document) => document.id !== paper.id), paper];
}

export async function checkSample(): Promise<Analysis> {
  return checkPapers([await readPaper(samplePaperText, true)]);
}
