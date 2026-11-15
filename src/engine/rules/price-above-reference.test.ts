import { expect, test } from "vitest";
import type { ParsedDocument } from "@/contracts";
import { sampleDocument } from "@/contracts/stubs";
import { priceAboveReference } from "./price-above-reference";
import { referencePrices } from "./reference-prices";

const line = (id: string, code: string, amountCents: number, quantity = 1) => ({ id, code, description: "Service", quantity, amountCents });
const doc = (extra: Partial<ParsedDocument>): ParsedDocument => ({ ...sampleDocument, ...extra });

test("finds a price more than ten times the public reference", () => {
  const findings = priceAboveReference.check([doc({ lines: [line("l1", "36415", 14_500)] })]);
  expect(findings).toMatchObject([{ lineIds: ["l1"], atStakeCents: 5_160, confidence: "worth_asking" }]);
  expect(findings[0].title).toContain("$9.34");
});

test("stays silent for a normal price and for codes without a reference", () => {
  expect(priceAboveReference.check([doc({ lines: [line("l1", "36415", 9_000), line("l2", "85025", 7_250), line("l3", "0120", 480_000)] })])).toEqual([]);
});

test("the larger table catches more lab tests, counted per unit", () => {
  const findings = priceAboveReference.check([doc({ lines: [line("l1", "86901", 4_800), line("l2", "85025", 20_000, 2), line("l3", "86850", 9_770)] })]);
  expect(findings.map((finding) => [finding.lineIds[0], finding.atStakeCents])).toEqual([["l1", 1_810], ["l2", 4_460]]);
});

test("every reference price names its public source and year", () => {
  const prices = Object.entries(referencePrices);
  expect(prices.length).toBe(31);
  for (const [code, price] of prices) {
    expect(code).toMatch(/^\d{5}$/);
    expect(Number.isInteger(price.cents) && price.cents > 0, code).toBe(true);
    expect(price.what.length, code).toBeGreaterThan(5);
    expect(price.source, code).toContain("2026");
    expect(price.sourceUrl, code).toMatch(/^https:\/\/www\.chfs\.ky\.gov\//);
    expect(price.year, code).toBe(2026);
  }
});

test("spot check against the published schedule", () => {
  expect(referencePrices["36415"].cents).toBe(934);
  expect(referencePrices["80053"].cents).toBe(1056);
  expect(referencePrices["85025"].cents).toBe(777);
  expect(referencePrices["86901"].cents).toBe(299);
  expect(referencePrices["80055"].cents).toBe(4781);
});
