// Where the case screen gets its case from. The storage functions are Khursand's (src/case-file).
import type { Analysis, CaseFile } from "@/contracts";
import { loadCase, saveCase } from "@/case-file";
import { readStored, writeStored } from "../_session/storage";

export function startCase(analysis: Analysis, chosenIds: string[] | null): CaseFile {
  return {
    id: `case-${analysis.documents.map((document) => document.id).join("-")}`,
    analysis,
    claimedFindingIds: chosenIds ?? analysis.findings.map((finding) => finding.id),
    deadlines: [],
    outcomes: analysis.findings.map((finding) => ({ findingId: finding.id, status: "open" })),
  };
}

// After a new check the case takes the new papers and findings,
// and keeps the reminders and every answer already recorded.
export function refreshCase(kept: CaseFile, analysis: Analysis, chosenIds: string[] | null): CaseFile {
  const fresh = startCase(analysis, chosenIds);
  const outcomes = fresh.outcomes.map((outcome) => kept.outcomes.find((old) => old.findingId === outcome.findingId) ?? outcome);
  return { ...fresh, id: kept.id, deadlines: kept.deadlines, outcomes };
}

export function openCase(analysis: Analysis | null, chosenIds: string[] | null): CaseFile | null {
  // STUB: src/case-file keeps the case in memory only until package H9, so a copy also
  // lives in the browser here. Remove the copy when loadCase survives a page reload.
  const kept = loadCase() ?? readStored<CaseFile>("case");
  if (!analysis) return kept;
  return kept ? refreshCase(kept, analysis, chosenIds) : startCase(analysis, chosenIds);
}

export function keepCase(caseFile: CaseFile): void {
  saveCase(caseFile);
  writeStored("case", caseFile); // STUB: see openCase
}

export function caseProgress(caseFile: CaseFile) {
  const followed = caseFile.outcomes.filter((outcome) => caseFile.claimedFindingIds.includes(outcome.findingId));
  const closed = followed.filter((outcome) => outcome.status !== "open").length;
  const savedCents = followed.reduce((sum, outcome) => sum + (outcome.status === "won" ? outcome.savedCents ?? 0 : 0), 0);
  return { total: followed.length, closed, savedCents };
}
