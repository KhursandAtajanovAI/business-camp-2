import { expect, test } from "vitest";
import { demoSets } from "@content/demo-documents";
import { sampleAnalysis } from "@/contracts/stubs";
import { analyze } from "@/engine";
import { parseDocument } from "@/intake";
import { explainFinding } from "./index";

test("a finding is explained with the rule's words and the engine's amount", () => {
  const text = explainFinding(sampleAnalysis.findings[0]);
  expect(text).toContain("the amount in question is $725.00");
  expect(text).toContain("A service done once is billed once.");
});

test("a finding from an unknown rule still gets a plain sentence", () => {
  expect(explainFinding({ ...sampleAnalysis.findings[0], ruleId: "new-rule" })).toBe("The same blood test appears twice on the same day. The amount in question is $725.00.");
});

test("every finding in every sample set is explained in at most three sentences, with its own amount", async () => {
  for (const set of demoSets) {
    const analysis = analyze(await Promise.all(set.papers.map((paper) => parseDocument(paper.text))));
    for (const finding of analysis.findings) {
      const text = explainFinding(finding);
      expect(text.split(/(?<=[.?])\s+/).length).toBeLessThanOrEqual(3);
      expect(text).not.toContain("{{");
      const amount = `$${Math.floor(finding.atStakeCents / 100).toLocaleString("en-US")}.${String(finding.atStakeCents % 100).padStart(2, "0")}`;
      expect(text).toContain(amount);
    }
  }
});
