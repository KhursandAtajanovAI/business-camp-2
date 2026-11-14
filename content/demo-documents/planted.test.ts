import { expect, test } from "vitest";
import { analyze } from "@/engine";
import { parseDocument } from "@/intake";
import { demoSets } from "./index";

const byRuleAndAmount = (first: [string, number], second: [string, number]) => first[0].localeCompare(second[0]) || first[1] - second[1];

test.each(demoSets)("in $id the engine finds exactly the planted mistakes, no more and no less", async (set) => {
  const analysis = analyze(await Promise.all(set.papers.map((paper) => parseDocument(paper.text))));
  const found = analysis.findings.map((finding): [string, number] => [finding.ruleId, finding.atStakeCents]).sort(byRuleAndAmount);
  const planted = set.planted.map((mistake): [string, number] => [mistake.ruleId, mistake.atStakeCents]).sort(byRuleAndAmount);
  expect(found).toEqual(planted);
  expect(analysis.totalAtStakeCents).toBe(set.planted.reduce((sum, mistake) => sum + mistake.atStakeCents, 0));
});

test("the bill-against-EOB check fires on at least two sets and the mother-and-baby check on at least one", async () => {
  const rulesBySet = await Promise.all(
    demoSets.map(async (set) => analyze(await Promise.all(set.papers.map((paper) => parseDocument(paper.text)))).findings.map((finding) => finding.ruleId)),
  );
  expect(rulesBySet.filter((rules) => rules.includes("balance-above-eob")).length).toBeGreaterThanOrEqual(2);
  expect(rulesBySet.filter((rules) => rules.includes("mother-baby-repeat")).length).toBeGreaterThanOrEqual(1);
});

test("the same money is never counted by two rules on one paper", async () => {
  const set4 = analyze(await Promise.all(demoSets[3].papers.map((paper) => parseDocument(paper.text))));
  expect(set4.findings.map((finding) => finding.ruleId).sort()).toEqual(["insurance-not-applied", "out-of-network-surprise"]);
});
