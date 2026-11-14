import { describe, expect, it } from "vitest";
import { addPaper, checkPapers, checkSample } from "./check-papers";

describe("the road a paper takes", () => {
  it("runs the sample through the same steps as a real paper and marks it as a sample", async () => {
    const analysis = await checkSample();
    expect(analysis.documents).toHaveLength(1);
    expect(analysis.documents[0].isDemo).toBe(true);
    expect(analysis.findings.length).toBeGreaterThan(0);
  });

  it("keeps the money in question equal to the sum of the findings", async () => {
    const analysis = await checkSample();
    const sum = analysis.findings.reduce((total, finding) => total + finding.atStakeCents, 0);
    expect(analysis.totalAtStakeCents).toBe(sum);
  });

  it("says nothing when there is nothing to ask about", async () => {
    const calm = (await checkSample()).documents[0];
    const lines = calm.lines.filter((line, index, all) => all.findIndex((other) => other.description === line.description) === index);
    const total = lines.reduce((sum, line) => sum + line.amountCents, 0);
    expect(checkPapers([{ ...calm, lines, totalCents: total }]).findings).toEqual([]);
  });

  it("does not double a paper that is added twice", async () => {
    const paper = (await checkSample()).documents[0];
    expect(addPaper([paper], paper)).toHaveLength(1);
  });
});
