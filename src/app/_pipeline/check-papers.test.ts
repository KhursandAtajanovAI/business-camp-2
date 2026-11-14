import { describe, expect, it } from "vitest";
import { demoSets } from "@content/demo-documents";
import { addPaper, checkPapers, checkSample, readPaper } from "./check-papers";

describe("the road a paper takes", () => {
  it("runs the sample through the same steps as a real paper and marks it as a sample", async () => {
    const analysis = await checkSample();
    expect(analysis.documents).toHaveLength(demoSets[0].papers.length);
    expect(analysis.documents.every((document) => document.isDemo)).toBe(true);
    expect(analysis.findings.length).toBeGreaterThan(0);
  });

  it("keeps the money in question equal to the sum of the findings", async () => {
    const analysis = await checkSample();
    const sum = analysis.findings.reduce((total, finding) => total + finding.atStakeCents, 0);
    expect(analysis.totalAtStakeCents).toBe(sum);
  });

  it("says nothing when there is nothing to ask about", async () => {
    const calm = await readPaper(demoSets[4].papers[5].text, true); // the pediatrician bill has no planted mistake
    expect(checkPapers([calm]).findings).toEqual([]);
  });

  it("does not double a paper that is added twice", async () => {
    const paper = (await checkSample()).documents[0];
    expect(addPaper([paper], paper)).toHaveLength(1);
  });
});
