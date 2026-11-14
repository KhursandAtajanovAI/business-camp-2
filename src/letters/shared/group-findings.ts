import type { Analysis, Finding, ParsedDocument } from "@/contracts";

export type FindingGroup = { document: ParsedDocument; findings: Finding[] };

export class LetterError extends Error {
  readonly nextStep: string;

  constructor(message: string, nextStep: string) {
    super(message);
    this.name = "LetterError";
    this.nextStep = nextStep;
  }
}

// One letter goes to one billing office, so findings are grouped by the paper they are on.
export function groupFindings(analysis: Analysis, selected: Finding[]): FindingGroup[] {
  if (selected.length === 0) {
    throw new LetterError("No findings are chosen yet.", "Choose at least one finding to ask about, then try again.");
  }
  const groups: FindingGroup[] = [];
  for (const finding of selected) {
    const document = analysis.documents.find((candidate) => candidate.id === finding.documentId);
    if (!document) continue;
    const group = groups.find((candidate) => candidate.document.id === document.id);
    if (group) group.findings.push(finding);
    else groups.push({ document, findings: [finding] });
  }
  if (groups.length === 0) {
    throw new LetterError("We could not match the chosen findings to a paper.", "Run the check again, then choose the findings once more.");
  }
  return groups;
}

export function describeLines(document: ParsedDocument, finding: Finding): string {
  return document.lines
    .filter((line) => finding.lineIds.includes(line.id))
    .map((line) => [line.code, line.description].filter(Boolean).join(" "))
    .join("; ");
}
