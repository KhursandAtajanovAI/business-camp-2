import { expect, test } from "vitest";
import type { ParsedDocument } from "@/contracts";
import { sampleDocument } from "@/contracts/stubs";
import { oncePerBirth } from "./once-per-birth";
import { totalMismatch } from "./total-mismatch";

const line = (id: string, code: string, amountCents: number, quantity = 1) => ({ id, code, description: "Service", quantity, amountCents });
const doc = (extra: Partial<ParsedDocument>): ParsedDocument => ({ ...sampleDocument, ...extra });

test("finds a birth package billed twice for one birth", () => {
  expect(oncePerBirth.check([doc({ lines: [line("o1", "59400", 960_000, 2)] })])).toMatchObject([{ lineIds: ["o1"], atStakeCents: 480_000, confidence: "likely" }]);
});

test("stays silent for quantity one and for services that repeat normally", () => {
  expect(oncePerBirth.check([doc({ lines: [line("o1", "59400", 480_000), line("o2", "0120", 480_000, 2)] })])).toEqual([]);
});

test("finds a total that is higher than the sum of the lines", () => {
  const findings = totalMismatch.check([doc({ lines: [line("t1", "0120", 100_000)], totalCents: 125_000 })]);
  expect(findings).toEqual([{ documentId: "doc-sample-1", lineIds: [], title: "The lines add up to $1,000.00, but the bill says the total is $1,250.00", atStakeCents: 25_000, confidence: "sure" }]);
});

test("stays silent when the lines add up", () => {
  expect(totalMismatch.check([sampleDocument])).toEqual([]);
});
