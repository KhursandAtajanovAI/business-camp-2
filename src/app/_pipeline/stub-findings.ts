// STUB: two tiny checks so the screens have something honest to show while the real
// rule engine (Adilet, src/engine) still returns nothing. Both are plain arithmetic.
// When the engine finds anything itself, this file is not used. Delete it after the merge.
import type { Finding, ParsedDocument } from "@/contracts";
import { stubText } from "../_strings/stub";

function repeatedLines(document: ParsedDocument): Finding[] {
  const seen = new Map<string, string>();
  const findings: Finding[] = [];
  for (const line of document.lines) {
    const key = [line.serviceDate, line.code, line.description, line.amountCents].join("|");
    const first = seen.get(key);
    if (!first) {
      seen.set(key, line.id);
      continue;
    }
    findings.push({
      id: `stub-repeat-${line.id}`,
      ruleId: "duplicate-line",
      documentId: document.id,
      lineIds: [first, line.id],
      title: stubText.repeatTitle(line.description),
      atStakeCents: line.amountCents,
      confidence: "likely",
      sourceNote: stubText.repeatSource,
    });
  }
  return findings;
}

function totalDisagrees(document: ParsedDocument): Finding[] {
  const lineSum = document.lines.reduce((sum, line) => sum + line.amountCents, 0);
  const gap = document.totalCents - lineSum;
  if (gap <= 0) return [];
  return [{
    id: `stub-total-${document.id}`,
    ruleId: "total-mismatch",
    documentId: document.id,
    lineIds: [],
    title: stubText.totalTitle,
    atStakeCents: gap,
    confidence: "worth_asking",
    sourceNote: stubText.totalSource,
  }];
}

export function stubFindings(documents: ParsedDocument[]): Finding[] {
  return documents.flatMap((document) => [...repeatedLines(document), ...totalDisagrees(document)]);
}

// A rough stand-in for the bill health score (Adilet, package A13).
export function stubHealthScore(findingCount: number): number {
  return Math.max(40, 100 - findingCount * 8);
}
