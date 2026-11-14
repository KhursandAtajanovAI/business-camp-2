import { expect, test } from "vitest";
import { sampleAnalysis } from "@/contracts/stubs";
import { addDeadline, calendarFileUrl, claimFindings, clearCase, createCase, getReminders, loadCase, markOutcome, summarizeOutcomes } from "./index";

test("the whole path of a case works through the main file", () => {
  clearCase();
  let caseFile = createCase(sampleAnalysis);
  caseFile = claimFindings(caseFile, ["finding-sample-1"], "2026-04-01");
  caseFile = addDeadline(caseFile, { label: "Call the billing office", dueOn: "2026-04-10" });
  expect(getReminders(caseFile, "2026-04-08")).toHaveLength(2);
  expect(calendarFileUrl(caseFile)).toContain("data:text/calendar");
  caseFile = markOutcome(caseFile, "finding-sample-1", "won", 72_500);
  expect(summarizeOutcomes(caseFile).savedCents).toBe(72_500);
  expect(loadCase()).toEqual(caseFile); // nothing is lost between calls
  clearCase();
});
