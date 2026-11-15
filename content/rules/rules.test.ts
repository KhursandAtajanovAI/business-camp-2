import { readFileSync } from "node:fs";
import { expect, test } from "vitest";
import { sampleDocument } from "@/contracts/stubs";
import { allRules } from "@/engine/checks/all-rules";
import { runRules } from "@/engine/checks/run-rules";
import type { Rule } from "@/engine/rules/rule";
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

test.each(descriptions)("$id says what its source says and when a person checked it", (rule) => {
  expect(rule.sourceSays.length).toBeGreaterThan(40);
  expect(rule.checkedOn).toMatch(/^\d{4}-\d{2}-\d{2}$/);
  expect(rule.sourceUrl).toMatch(/^https:\/\/[a-z.]+\.gov\//);
  if (rule.sourceCheck !== "confirmed") expect(rule.confidenceNote).toMatch(/^Worth asking/);
  if (rule.sourceCheck === "not_confirmed") expect(rule.sourceSays).toMatch(/^Source not verified/);
});

test("a rule without a confirmed source never says more than worth asking", () => {
  const document = { ...sampleDocument, lines: [] };
  for (const rule of descriptions) {
    const sure: Rule = { id: rule.id, check: () => [{ documentId: document.id, lineIds: [], title: "t", atStakeCents: 100, confidence: "sure" }] };
    const expected = rule.sourceCheck === "confirmed" ? "sure" : "worth_asking";
    expect(runRules([document], [sure])[0].confidence, rule.id).toBe(expected);
  }
});

test("content/rules/SOURCES.md lists every rule with its link", () => {
  const page = readFileSync("content/rules/SOURCES.md", "utf8");
  for (const rule of descriptions) {
    expect(page, rule.id).toContain(`\`${rule.id}\``);
    expect(page, rule.id).toContain(rule.sourceUrl);
  }
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
