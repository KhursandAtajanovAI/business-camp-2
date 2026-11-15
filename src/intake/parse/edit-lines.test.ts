import { expect, test } from "vitest";
import { analyze } from "@/engine";
import { sampleBillText } from "../fixtures";
import { centsFromInput, editLine, removeLine } from "./edit-lines";
import { parseText } from "./parse-text";

const bill = parseText(sampleBillText);
const repeated = bill.lines[4 - 1]; // the second "Complete blood count"

test("fixing a number changes that line only and keeps the paper's printed total", () => {
  const edited = editLine(bill, bill.lines[0].id, { amountCents: 470_000 });
  expect(edited.lines[0].amountCents).toBe(470_000);
  expect(edited.lines[1]).toEqual(bill.lines[1]);
  expect(edited.totalCents).toBe(bill.totalCents);
  expect(edited.id).toBe(bill.id);
});

test("when the lines stop adding up the person is told, and the note goes away once they add up again", () => {
  const edited = editLine(bill, bill.lines[0].id, { amountCents: 470_000 });
  expect(edited.needsReview).toEqual(["The lines add up to $11,141.00, but the paper says the total is $11,241.00."]);
  expect(editLine(edited, bill.lines[0].id, { amountCents: 480_000 }).needsReview).toBeUndefined();
});

test("the money in question is counted again after an edit", () => {
  expect(analyze([bill]).totalAtStakeCents).toBe(7_250); // the repeated blood test
  const corrected = editLine(bill, repeated.id, { description: "Blood type test", code: "86900" });
  expect(analyze([corrected]).findings).toEqual([]);
  const removed = removeLine(bill, repeated.id);
  expect(removed.lines).toHaveLength(4);
  expect(analyze([removed]).findings.map((finding) => finding.ruleId)).toEqual(["total-mismatch"]);
});

test("values that make no sense are ignored", () => {
  const edited = editLine(bill, bill.lines[0].id, { amountCents: -5, quantity: 0, description: "   " });
  expect(edited.lines[0]).toEqual(bill.lines[0]);
  expect(editLine(bill, "no-such-line", { amountCents: 1 }).lines).toEqual(bill.lines);
});

test("an amount typed by a person becomes whole cents", () => {
  expect(centsFromInput("72.50")).toBe(7_250);
  expect(centsFromInput("$1,200")).toBe(120_000);
  expect(centsFromInput("1200.5")).toBe(120_050);
  expect(centsFromInput("about 70")).toBeNull();
});
