import { expect, test } from "vitest";
import { demoSets } from "@content/demo-documents";
import { parseDocument } from "@/intake";
import { analyze, describeHealthScore } from "../index";

const analyzeSet = async (index: number) => analyze(await Promise.all(demoSets[index].papers.map((paper) => parseDocument(paper.text))));

test("clean papers get 100 and a plain reason", () => {
  expect(describeHealthScore(analyze([]))).toBe("100 out of 100: we found nothing to ask about in these papers.");
});

test("the reason names the score, the number of findings and the share of money in question", async () => {
  const analysis = await analyzeSet(0);
  expect(analysis.healthScore).toBe(70);
  expect(describeHealthScore(analysis)).toBe("70 out of 100: 2 things are worth asking about, and about 7% of what was billed is in question.");
});

test("every sample set gets a score from 0 to 100 with a short reason", async () => {
  for (let index = 0; index < demoSets.length; index += 1) {
    const analysis = await analyzeSet(index);
    expect(analysis.healthScore).toBeGreaterThanOrEqual(0);
    expect(analysis.healthScore).toBeLessThan(100);
    expect(describeHealthScore(analysis)).toMatch(/^\d+ out of 100: /);
  }
});
