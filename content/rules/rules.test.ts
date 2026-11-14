import { expect, test } from "vitest";
import { allRules } from "@/engine/checks/all-rules";
import { ruleDescriptions } from "./index";

const descriptions = Object.values(ruleDescriptions);

test("every rule the engine runs has a description, and every description has a rule", () => {
  expect(Object.keys(ruleDescriptions).sort()).toEqual(allRules.map((rule) => rule.id).sort());
});

test.each(descriptions)("$id has a source with a link and says why it is as sure as it is", (rule) => {
  expect(rule.sourceName.length).toBeGreaterThan(10);
  expect(rule.sourceUrl).toMatch(/^https:\/\//);
  expect(rule.confidenceNote).toMatch(/^(Sure|Likely|Worth asking)/);
});

test.each(descriptions)("$id is explained in at most three short sentences with the amount filled by code", (rule) => {
  const sentences = rule.explanation.split(/(?<=[.?])\s+/).filter(Boolean);
  expect(sentences.length).toBeLessThanOrEqual(3);
  expect(rule.explanation).toContain("{{amount}}");
  expect(rule.explanation).not.toMatch(/\$\d/); // numbers come from the engine, never from the text
});

test.each(descriptions)("$id uses plain words: no jargon, no advice, no promise", (rule) => {
  const text = `${rule.name} ${rule.summary} ${rule.explanation}`;
  expect(text).not.toMatch(/\bCPT\b|NCCI|adjudicat|unbundl|modifier|upcod/i);
  expect(text).not.toMatch(/you should (take|stop|see a doctor)|diagnos|treatment|lawsuit|sue\b|refund|guarantee|!/i);
  expect(text).not.toMatch(/[Ѐ-ӿ]/);
});
