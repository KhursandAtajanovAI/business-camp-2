import type { CaseFile } from "@/contracts";
import { caseFileText } from "@content/letters/case-file";

export type OutcomeSummary = {
  open: number;
  won: number;
  lost: number;
  savedCents: number; // only amounts the family entered for won claims
  progress: number; // 0..1, share of findings that have an answer; drives the growing sprout
  message: string;
};

function dollars(cents: number): string {
  return `$${Math.floor(cents / 100).toLocaleString("en-US")}.${String(cents % 100).padStart(2, "0")}`;
}

export function summarizeOutcomes(caseFile: CaseFile): OutcomeSummary {
  const statusOf = (findingId: string) => caseFile.outcomes.find((outcome) => outcome.findingId === findingId)?.status ?? "open";
  const statuses = caseFile.analysis.findings.map((finding) => statusOf(finding.id));
  const count = (status: string) => statuses.filter((value) => value === status).length;
  const savedCents = caseFile.outcomes
    .filter((outcome) => outcome.status === "won")
    .reduce((sum, outcome) => sum + (outcome.savedCents ?? 0), 0);
  const closed = count("won") + count("lost");
  const progress = statuses.length === 0 ? 0 : closed / statuses.length;

  let message = caseFileText.savedNothingYet;
  if (savedCents > 0) message = caseFileText.savedSoFar.replace("{{amount}}", dollars(savedCents));
  if (statuses.length > 0 && closed === statuses.length) message = `${message === caseFileText.savedNothingYet ? "" : `${message} `}${caseFileText.allClosed}`;
  return { open: count("open"), won: count("won"), lost: count("lost"), savedCents, progress, message };
}
