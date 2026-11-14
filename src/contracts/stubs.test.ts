import { expect, test } from "vitest";
import { sampleAnalysis, sampleCaseFile, sampleDocument } from "./stubs";

test("the sample document lines add up to its total", () => {
  const sum = sampleDocument.lines.reduce((total, line) => total + line.amountCents, 0);
  expect(sum).toBe(sampleDocument.totalCents);
});

test("the sample analysis total equals the sum of its findings", () => {
  const sum = sampleAnalysis.findings.reduce((total, finding) => total + finding.atStakeCents, 0);
  expect(sum).toBe(sampleAnalysis.totalAtStakeCents);
});

test("the sample case file points at findings that exist", () => {
  const ids = sampleCaseFile.analysis.findings.map((finding) => finding.id);
  expect(sampleCaseFile.claimedFindingIds.every((id) => ids.includes(id))).toBe(true);
});
