// The only file screens import from the case file.
// Every function returns the updated case, already saved in this browser.
export { clearCase, loadCase, saveCase } from "./store/case-store";
export { addDeadline, CaseFileError, setDeadlineDone } from "./store/deadlines";
export { claimFindings, createCase, updateAnalysis } from "./store/new-case";
export { calendarFileUrl } from "./reminders/calendar";
export { getReminders, type Reminder } from "./reminders/reminders";
export { markOutcome } from "./outcomes/mark-outcome";
export { summarizeOutcomes, type OutcomeSummary } from "./outcomes/summary";
