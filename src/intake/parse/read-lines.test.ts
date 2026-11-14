import { expect, test } from "vitest";
import { sampleBabyBillText, sampleBillText, sampleEobText } from "../fixtures";
import { readLines } from "./read-lines";

test("a bill line gives date, code, description, quantity and amount", () => {
  const { lines, unclear } = readLines(sampleBillText, { documentId: "doc-1", isEob: false });
  expect(lines).toHaveLength(5);
  expect(lines[0]).toEqual({
    id: "doc-1-line-1",
    serviceDate: "2026-03-14",
    code: "0120",
    description: "Room and board, semi-private",
    quantity: 2,
    amountCents: 480_000,
  });
  expect(unclear).toEqual([]);
});

test("summary rows such as totals and payments are not charges", () => {
  const { lines } = readLines(sampleBillText, { documentId: "doc-1", isEob: false });
  expect(lines.some((line) => /total|amount due|insurance/i.test(line.description))).toBe(false);
});

test("an EOB line keeps billed, allowed, plan paid and you owe", () => {
  const { lines } = readLines(sampleEobText, { documentId: "doc-2", isEob: true });
  expect(lines[2]).toMatchObject({ code: "85025", amountCents: 7_250, allowedCents: 3_100, planPaidCents: 2_480, patientOwesCents: 620 });
});

test("without a quantity column a number in the description stays there", () => {
  const { lines } = readLines(sampleBabyBillText, { documentId: "doc-3", isEob: false });
  expect(lines[0]).toMatchObject({ description: "Newborn nursery, level 1", quantity: 1, amountCents: 190_000 });
});

test("a charge we cannot read is set aside for a person to check", () => {
  const { lines, unclear } = readLines("Pharmacy supplies $45\nRoom $100.00", { documentId: "doc-4", isEob: false });
  expect(lines).toHaveLength(1);
  expect(unclear).toEqual(["Pharmacy supplies $45"]);
});
