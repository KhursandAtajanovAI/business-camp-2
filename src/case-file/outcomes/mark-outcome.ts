import type { CaseFile } from "@/contracts";
import { saveCase } from "../store/case-store";
import { CaseFileError } from "../store/deadlines";
import { defaultStore, type KeyValueStore } from "../store/storage";

type Status = CaseFile["outcomes"][number]["status"];

// savedCents counts only for a won claim and only when the family tells us the amount.
export function markOutcome(caseFile: CaseFile, findingId: string, status: Status, savedCents?: number, store: KeyValueStore = defaultStore()): CaseFile {
  if (!caseFile.analysis.findings.some((finding) => finding.id === findingId)) {
    throw new CaseFileError("We could not find this item in your case.", "Open your case file again and pick the item from the list.");
  }
  if (savedCents !== undefined && (!Number.isInteger(savedCents) || savedCents < 0)) {
    throw new CaseFileError("The saved amount should be a number, zero or more.", "Enter the amount that was taken off your bill, for example 72.50.");
  }
  const outcome = status === "won" && savedCents !== undefined ? { findingId, status, savedCents } : { findingId, status };
  const others = caseFile.outcomes.filter((existing) => existing.findingId !== findingId);
  return saveCase({ ...caseFile, outcomes: [...others, outcome] }, store);
}
