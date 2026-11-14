import { expect, test } from "vitest";
import type { ParsedDocument } from "@/contracts";
import { sampleDocument } from "@/contracts/stubs";
import { priceAboveReference } from "./price-above-reference";

const line = (id: string, code: string, amountCents: number, quantity = 1) => ({ id, code, description: "Service", quantity, amountCents });
const doc = (extra: Partial<ParsedDocument>): ParsedDocument => ({ ...sampleDocument, ...extra });

test("finds a price more than ten times the public reference", () => {
  const findings = priceAboveReference.check([doc({ lines: [line("l1", "36415", 14_500)] })]);
  expect(findings).toMatchObject([{ lineIds: ["l1"], atStakeCents: 5_160, confidence: "worth_asking" }]);
  expect(findings[0].title).toContain("$9.34");
});

test("stays silent for a normal price and for codes without a reference", () => {
  expect(priceAboveReference.check([doc({ lines: [line("l1", "36415", 9_000), line("l2", "85025", 7_250)] })])).toEqual([]);
});
