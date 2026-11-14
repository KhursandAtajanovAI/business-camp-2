import type { CaseFile } from "@/contracts";
import { saveCase } from "./case-store";
import { isIsoDay } from "./dates";
import { defaultStore, type KeyValueStore } from "./storage";

type NewDeadline = { label: string; dueOn: string; done?: boolean };

export class CaseFileError extends Error {
  readonly nextStep: string;

  constructor(message: string, nextStep: string) {
    super(message);
    this.name = "CaseFileError";
    this.nextStep = nextStep;
  }
}

// Deadlines are only the ones the family sets or a paper names. We never invent legal dates.
export function addDeadline(caseFile: CaseFile, deadline: NewDeadline, store: KeyValueStore = defaultStore()): CaseFile {
  const label = deadline.label.trim();
  if (label === "") throw new CaseFileError("This reminder needs a few words.", "Write what you want to remember, for example: Call the billing office.");
  if (!isIsoDay(deadline.dueOn)) throw new CaseFileError("This reminder needs a date.", "Pick a day on the calendar.");
  const deadlines = [...caseFile.deadlines, { label, dueOn: deadline.dueOn, done: deadline.done ?? false }];
  deadlines.sort((first, second) => first.dueOn.localeCompare(second.dueOn));
  return saveCase({ ...caseFile, deadlines }, store);
}

export function setDeadlineDone(caseFile: CaseFile, index: number, done = true, store: KeyValueStore = defaultStore()): CaseFile {
  const deadlines = caseFile.deadlines.map((deadline, position) => (position === index ? { ...deadline, done } : deadline));
  return saveCase({ ...caseFile, deadlines }, store);
}
