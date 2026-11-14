import { expect, test } from "vitest";
import type { Analysis } from "@/contracts";
import { sampleAnalysis } from "@/contracts/stubs";
import { loadCase } from "../store/case-store";
import { CaseFileError } from "../store/deadlines";
import { createCase } from "../store/new-case";
import { memoryStore } from "../store/storage";
import { markOutcome } from "./mark-outcome";
import { summarizeOutcomes } from "./summary";

const twoFindings: Analysis = {
  ...sampleAnalysis,
  findings: [sampleAnalysis.findings[0], { ...sampleAnalysis.findings[0], id: "finding-sample-2", atStakeCents: 30_000 }],
  totalAtStakeCents: 102_500,
};

test("a new case has nothing saved and a kind invitation", () => {
  const summary = summarizeOutcomes(createCase(twoFindings, memoryStore()));
  expect(summary).toMatchObject({ open: 2, won: 0, lost: 0, savedCents: 0, progress: 0 });
  expect(summary.message).toContain("mark it here");
});

test("a won claim counts only the amount the family entered", () => {
  const store = memoryStore();
  const caseFile = markOutcome(createCase(twoFindings, store), "finding-sample-1", "won", 50_000, store);
  const summary = summarizeOutcomes(caseFile);
  expect(summary).toMatchObject({ open: 1, won: 1, savedCents: 50_000, progress: 0.5 });
  expect(summary.message).toBe("Your family has saved $500.00 so far.");
  expect(loadCase(store)?.outcomes).toContainEqual({ findingId: "finding-sample-1", status: "won", savedCents: 50_000 });
});

test("a won claim without an amount adds nothing: we never assume money", () => {
  const store = memoryStore();
  const caseFile = markOutcome(createCase(twoFindings, store), "finding-sample-1", "won", undefined, store);
  expect(summarizeOutcomes(caseFile).savedCents).toBe(0);
});

test("a lost claim saves nothing even if an amount is passed", () => {
  const store = memoryStore();
  const caseFile = markOutcome(createCase(twoFindings, store), "finding-sample-1", "lost", 50_000, store);
  expect(summarizeOutcomes(caseFile)).toMatchObject({ lost: 1, savedCents: 0 });
});

test("when every finding has an answer the case is complete", () => {
  const store = memoryStore();
  let caseFile = markOutcome(createCase(twoFindings, store), "finding-sample-1", "won", 72_500, store);
  caseFile = markOutcome(caseFile, "finding-sample-2", "lost", undefined, store);
  const summary = summarizeOutcomes(caseFile);
  expect(summary.progress).toBe(1);
  expect(summary.message).toBe("Your family has saved $725.00 so far. Every question in this case has an answer. Well done.");
});

test("changing your mind replaces the earlier mark", () => {
  const store = memoryStore();
  let caseFile = markOutcome(createCase(twoFindings, store), "finding-sample-1", "won", 72_500, store);
  caseFile = markOutcome(caseFile, "finding-sample-1", "open", undefined, store);
  expect(caseFile.outcomes.filter((outcome) => outcome.findingId === "finding-sample-1")).toEqual([{ findingId: "finding-sample-1", status: "open" }]);
});

test("an unknown item or a strange amount gets a kind message", () => {
  const caseFile = createCase(twoFindings, memoryStore());
  expect(() => markOutcome(caseFile, "nope", "won", 100, memoryStore())).toThrow(CaseFileError);
  expect(() => markOutcome(caseFile, "finding-sample-1", "won", -5, memoryStore())).toThrow(/zero or more/);
});
