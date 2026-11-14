import { expect, test } from "vitest";
import type { Analysis } from "@/contracts";
import { sampleAnalysis, sampleCaseFile } from "@/contracts/stubs";
import { CASE_KEY, clearCase, loadCase, saveCase } from "./case-store";
import { addDays, daysBetween } from "./dates";
import { addDeadline, CaseFileError, setDeadlineDone } from "./deadlines";
import { claimFindings, createCase, updateAnalysis } from "./new-case";
import { memoryStore } from "./storage";

test("a saved case is still there after a reload", () => {
  const store = memoryStore();
  expect(loadCase(store)).toBeNull();
  saveCase(sampleCaseFile, store);
  expect(loadCase(store)).toEqual(sampleCaseFile); // a fresh read, as after a page reload
  clearCase(store);
  expect(loadCase(store)).toBeNull();
});

test("damaged saved data does not crash the site", () => {
  const store = memoryStore();
  store.setItem(CASE_KEY, "{broken");
  expect(loadCase(store)).toBeNull();
  store.setItem(CASE_KEY, JSON.stringify({ id: 1 }));
  expect(loadCase(store)).toBeNull();
});

test("a new case starts with every finding open and nothing claimed", () => {
  const store = memoryStore();
  const caseFile = createCase(sampleAnalysis, store);
  expect(caseFile.outcomes).toEqual([{ findingId: "finding-sample-1", status: "open" }]);
  expect(caseFile.claimedFindingIds).toEqual([]);
  expect(loadCase(store)?.id).toBe(caseFile.id);
});

test("claiming findings adds one gentle follow-up 30 days later", () => {
  const store = memoryStore();
  const claimed = claimFindings(createCase(sampleAnalysis, store), ["finding-sample-1"], "2026-04-01", store);
  expect(claimed.claimedFindingIds).toEqual(["finding-sample-1"]);
  expect(claimed.deadlines).toEqual([{ label: "Look for a written reply from Riverside Women's Hospital (Sample)", dueOn: "2026-05-01", done: false }]);
  expect(claimFindings(claimed, ["finding-sample-1"], "2026-04-02", store).deadlines).toHaveLength(1);
});

test("when new papers arrive the family's earlier work is kept", () => {
  const store = memoryStore();
  const started = claimFindings(createCase(sampleAnalysis, store), ["finding-sample-1"], "2026-04-01", store);
  const bigger: Analysis = { ...sampleAnalysis, findings: [...sampleAnalysis.findings, { ...sampleAnalysis.findings[0], id: "finding-new" }] };
  const updated = updateAnalysis(started, bigger, store);
  expect(updated.claimedFindingIds).toEqual(["finding-sample-1"]);
  expect(updated.outcomes.map((outcome) => outcome.findingId)).toEqual(["finding-sample-1", "finding-new"]);
  expect(updated.deadlines).toHaveLength(1);
});

test("the family can add its own deadline and mark it done", () => {
  const store = memoryStore();
  const withDeadline = addDeadline(createCase(sampleAnalysis, store), { label: " Call the billing office ", dueOn: "2026-04-10" }, store);
  expect(withDeadline.deadlines).toEqual([{ label: "Call the billing office", dueOn: "2026-04-10", done: false }]);
  expect(setDeadlineDone(withDeadline, 0, true, store).deadlines[0].done).toBe(true);
  expect(loadCase(store)?.deadlines[0].done).toBe(true);
});

test("a deadline without words or a date gets a kind message", () => {
  const caseFile = createCase(sampleAnalysis, memoryStore());
  expect(() => addDeadline(caseFile, { label: "", dueOn: "2026-04-10" }, memoryStore())).toThrow(CaseFileError);
  expect(() => addDeadline(caseFile, { label: "Call", dueOn: "next week" }, memoryStore())).toThrow(/needs a date/);
});

test("day arithmetic does not depend on the time zone", () => {
  expect(addDays("2026-01-31", 30)).toBe("2026-03-02");
  expect(daysBetween("2026-04-01", "2026-05-01")).toBe(30);
});
