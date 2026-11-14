import { expect, test } from "vitest";
import type { ParsedDocument } from "@/contracts";
import { sampleDocument } from "@/contracts/stubs";
import { duplicateLine } from "./duplicate-line";

const line = (id: string, extra: object = {}) => ({ id, code: "85025", description: "Complete blood count", quantity: 1, amountCents: 7_250, serviceDate: "2026-03-14", ...extra });
const bill = (lines: ParsedDocument["lines"]): ParsedDocument => ({ ...sampleDocument, lines });

test("finds a line that is repeated with the same code, date and price", () => {
  const findings = duplicateLine.check([bill([line("a"), line("b"), line("c", { code: "0250", description: "Pharmacy" })])]);
  expect(findings).toEqual([
    { documentId: "doc-sample-1", lineIds: ["a", "b"], title: '"Complete blood count" is listed 2 times on 03/14/2026', atStakeCents: 7_250, confidence: "likely" },
  ]);
});

test("three copies put two of them in question", () => {
  expect(duplicateLine.check([bill([line("a"), line("b"), line("c")])])[0].atStakeCents).toBe(14_500);
});

test("stays silent when the dates or the prices differ", () => {
  expect(duplicateLine.check([bill([line("a"), line("b", { serviceDate: "2026-03-15" })])])).toEqual([]);
  expect(duplicateLine.check([bill([line("a"), line("b", { amountCents: 8_000 })])])).toEqual([]);
});

test("stays silent on an insurance explanation, which only mirrors the bill", () => {
  expect(duplicateLine.check([{ ...bill([line("a"), line("b")]), kind: "insurance_eob" }])).toEqual([]);
});

test("is less sure when the lines have no code or date", () => {
  const findings = duplicateLine.check([bill([line("a", { code: undefined, serviceDate: undefined }), line("b", { code: undefined, serviceDate: undefined })])]);
  expect(findings[0].confidence).toBe("worth_asking");
});
