// STUB (stage 0): keeps the case in memory only. Real storage arrives in stage 3.
import type { CaseFile } from "@/contracts";

type Deadline = CaseFile["deadlines"][number];
type OutcomeStatus = CaseFile["outcomes"][number]["status"];

let current: CaseFile | null = null;

export function saveCase(caseFile: CaseFile): void {
  current = caseFile;
}

export function loadCase(): CaseFile | null {
  return current;
}

export function addDeadline(caseFile: CaseFile, deadline: Deadline): CaseFile {
  return { ...caseFile, deadlines: [...caseFile.deadlines, deadline] };
}

export function markOutcome(caseFile: CaseFile, findingId: string, status: OutcomeStatus, savedCents?: number): CaseFile {
  const others = caseFile.outcomes.filter((outcome) => outcome.findingId !== findingId);
  return { ...caseFile, outcomes: [...others, { findingId, status, savedCents }] };
}
