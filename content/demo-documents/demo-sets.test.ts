import { expect, test } from "vitest";
import { parseDocument, redactPersonalData } from "@/intake";
import { demoSets } from "./index";

const papers = demoSets.flatMap((set) => set.papers.map((paper) => ({ label: `${set.id}: ${paper.name}`, text: paper.text })));

test("there are five sets and every one lists its planted mistakes", () => {
  expect(demoSets).toHaveLength(5);
  for (const set of demoSets) expect(set.planted.length).toBeGreaterThan(0);
});

test.each(papers)("$label is marked SAMPLE and its lines add up to its total", async ({ text }) => {
  const document = await parseDocument(text);
  expect(document.isDemo).toBe(true);
  expect(document.lines.reduce((sum, line) => sum + line.amountCents, 0)).toBe(document.totalCents);
  expect(document.needsReview).toBeUndefined();
  expect(document.issuedOn).toMatch(/^2026-\d{2}-\d{2}$/);
});

test("every kind of birth paper appears in the sets", async () => {
  const kinds = new Set((await Promise.all(papers.map(({ text }) => parseDocument(text)))).map((document) => document.kind));
  expect([...kinds].sort()).toEqual(["anesthesia_bill", "hospital_bill_baby", "hospital_bill_mother", "insurance_eob", "lab_bill", "obstetrician_bill", "pediatrician_bill"]);
});

test.each(papers)("$label has no name or member number left after hiding personal data", ({ text }) => {
  const safe = redactPersonalData(text);
  expect(safe).not.toMatch(/Jane Sample|Baby (Girl|Boy) Sample|SMP\d{6}/);
});

test("the sets are in English only", () => {
  expect(JSON.stringify(demoSets)).not.toMatch(/[Ѐ-ӿ]/);
});
