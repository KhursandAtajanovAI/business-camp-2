import type { Analysis, CaseFile } from "@/contracts";
import { caseFileText } from "@content/letters/case-file";
import { saveCase } from "./case-store";
import { addDays, todayIso } from "./dates";
import { defaultStore, type KeyValueStore } from "./storage";

const FOLLOW_UP_DAYS = 30; // the letter asks for a reply within 30 days

export function createCase(analysis: Analysis, store: KeyValueStore = defaultStore()): CaseFile {
  const caseFile: CaseFile = {
    id: `case-${Date.now().toString(36)}`,
    analysis,
    claimedFindingIds: [],
    deadlines: [],
    outcomes: analysis.findings.map((finding) => ({ findingId: finding.id, status: "open" })),
  };
  return saveCase(caseFile, store);
}

// New papers arrived and the check ran again: keep what the family already did.
export function updateAnalysis(caseFile: CaseFile, analysis: Analysis, store: KeyValueStore = defaultStore()): CaseFile {
  const stillThere = new Set(analysis.findings.map((finding) => finding.id));
  const known = new Set(caseFile.outcomes.map((outcome) => outcome.findingId));
  return saveCase(
    {
      ...caseFile,
      analysis,
      claimedFindingIds: caseFile.claimedFindingIds.filter((id) => stillThere.has(id)),
      outcomes: [
        ...caseFile.outcomes.filter((outcome) => stillThere.has(outcome.findingId)),
        ...analysis.findings.filter((finding) => !known.has(finding.id)).map((finding) => ({ findingId: finding.id, status: "open" as const })),
      ],
    },
    store,
  );
}

// The family sent a letter about these findings: remember it and add one gentle
// follow-up date per billing office, the same 30 days the letter itself asks for.
export function claimFindings(caseFile: CaseFile, findingIds: string[], today = todayIso(), store: KeyValueStore = defaultStore()): CaseFile {
  const claimed = [...new Set([...caseFile.claimedFindingIds, ...findingIds])];
  const deadlines = [...caseFile.deadlines];
  for (const document of caseFile.analysis.documents) {
    const hasNewClaim = caseFile.analysis.findings.some((finding) => finding.documentId === document.id && findingIds.includes(finding.id));
    const label = caseFileText.followUpLabel.replace("{{provider}}", document.provider);
    if (hasNewClaim && !deadlines.some((deadline) => deadline.label === label && !deadline.done)) {
      deadlines.push({ label, dueOn: addDays(today, FOLLOW_UP_DAYS), done: false });
    }
  }
  return saveCase({ ...caseFile, claimedFindingIds: claimed, deadlines }, store);
}
