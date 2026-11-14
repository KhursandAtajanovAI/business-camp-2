import { expect, test } from "vitest";
import { demoSets } from "@content/demo-documents";
import { parseDocument } from "@/intake";
import { analyze } from "./index";

const parseSet = (index: number) => Promise.all(demoSets[index].papers.map((paper) => parseDocument(paper.text)));

test("the engine finds the repeated blood test in sample set 1", async () => {
  const analysis = analyze(await parseSet(0));
  const repeated = analysis.findings.find((finding) => finding.ruleId === "duplicate-line");
  expect(repeated).toMatchObject({ atStakeCents: 7_250, confidence: "likely" });
  expect(repeated?.sourceNote).toContain("cms.gov");
});

test("the engine finds the package parts billed twice in sample set 2", async () => {
  const analysis = analyze(await parseSet(1));
  expect(analysis.findings.filter((finding) => finding.ruleId === "birth-package").map((finding) => finding.atStakeCents)).toEqual([38_000, 24_000]);
});

test("the total always equals the sum of the findings, in whole cents", async () => {
  for (let index = 0; index < demoSets.length; index += 1) {
    const analysis = analyze(await parseSet(index));
    expect(analysis.totalAtStakeCents).toBe(analysis.findings.reduce((sum, finding) => sum + finding.atStakeCents, 0));
    expect(Number.isInteger(analysis.totalAtStakeCents)).toBe(true);
    expect(analysis.healthScore).toBeGreaterThanOrEqual(0);
    expect(analysis.healthScore).toBeLessThanOrEqual(100);
  }
});

test("every finding has an id, a rule, a confidence level and a source", async () => {
  const analysis = analyze(await parseSet(0));
  const ids = analysis.findings.map((finding) => finding.id);
  expect(new Set(ids).size).toBe(ids.length);
  for (const finding of analysis.findings) {
    expect(["sure", "likely", "worth_asking"]).toContain(finding.confidence);
    expect(finding.sourceNote).not.toBe("");
    expect(finding.atStakeCents).toBeGreaterThan(0);
  }
});

test("clean papers and no papers give no findings and a score of 100", async () => {
  expect(analyze([])).toEqual({ documents: [], findings: [], totalAtStakeCents: 0, healthScore: 100 });
  const pediatrician = await parseDocument(demoSets[4].papers[5].text);
  expect(analyze([pediatrician])).toMatchObject({ findings: [], totalAtStakeCents: 0, healthScore: 100 });
});
