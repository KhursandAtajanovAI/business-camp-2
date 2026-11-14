import type { CaseFile } from "@/contracts";
import { caseFileText } from "@content/letters/case-file";
import { daysBetween, todayIso } from "../store/dates";

export type Reminder = { label: string; dueOn: string; when: "upcoming" | "today" | "waiting"; message: string };

function messageFor(label: string, days: number): Pick<Reminder, "when" | "message"> {
  const fill = (template: string) => template.replace("{{label}}", label).replace("{{days}}", String(days));
  if (days > 1) return { when: "upcoming", message: fill(caseFileText.reminderUpcoming) };
  if (days === 1) return { when: "upcoming", message: fill(caseFileText.reminderTomorrow) };
  if (days === 0) return { when: "today", message: fill(caseFileText.reminderToday) };
  return { when: "waiting", message: fill(caseFileText.reminderWaiting) };
}

// Open deadlines only, nearest first. Finished ones are left out.
export function getReminders(caseFile: CaseFile, today = todayIso()): Reminder[] {
  return caseFile.deadlines
    .filter((deadline) => !deadline.done)
    .sort((first, second) => first.dueOn.localeCompare(second.dueOn))
    .map((deadline) => ({ label: deadline.label, dueOn: deadline.dueOn, ...messageFor(deadline.label, daysBetween(today, deadline.dueOn)) }));
}
