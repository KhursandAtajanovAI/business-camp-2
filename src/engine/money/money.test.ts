import { expect, test } from "vitest";
import type { Finding } from "@/contracts";
import { sampleAnalysis, sampleDocument } from "@/contracts/stubs";
import { healthScore, scoreParts } from "./health-score";
import { totalAtStake } from "./total";

const finding = (atStakeCents: number, confidence: Finding["confidence"]): Finding => ({ ...sampleAnalysis.findings[0], atStakeCents, confidence });

test("the money in question is the plain sum of the findings", () => {
  expect(totalAtStake([finding(7_250, "likely"), finding(99_180, "likely")])).toBe(106_430);
  expect(totalAtStake([])).toBe(0);
});

test("papers with nothing to ask about score 100", () => {
  expect(healthScore([sampleDocument], [])).toBe(100);
});

test("the score falls with every finding and with the share of money in question", () => {
  const one = healthScore([sampleDocument], [finding(12_450, "sure")]); // 1% of the bill: 5 + 3 points
  const two = healthScore([sampleDocument], [finding(12_450, "sure"), finding(12_450, "sure")]);
  expect(one).toBe(92);
  expect(two).toBe(84);
});

test("a finding we are less sure about weighs less", () => {
  expect(healthScore([sampleDocument], [finding(124_500, "sure")])).toBeLessThan(healthScore([sampleDocument], [finding(124_500, "worth_asking")]));
});

test("the score never leaves the range 0 to 100 and ignores insurance explanations in the billed total", () => {
  expect(healthScore([sampleDocument], [finding(5_000_000, "sure")])).toBe(0);
  const parts = scoreParts([sampleDocument, { ...sampleDocument, kind: "insurance_eob" }], []);
  expect(parts.billedCents).toBe(sampleDocument.totalCents);
});
