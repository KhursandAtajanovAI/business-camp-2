import { expect, test } from "vitest";
import { findMoney, formatCents, toCents } from "./read-money";

test("dollar amounts become whole cents", () => {
  expect(toCents("$4,800.00")).toBe(480_000);
  expect(toCents("72.50")).toBe(7_250);
  expect(toCents("-$9,100.00")).toBe(-910_000);
  expect(toCents("($25.00)")).toBe(-2_500);
});

test("all amounts on a line are found in order", () => {
  const found = findMoney("0120 Room and board 2 $4,800.00 $3,600.00 $2,880.00 $720.00");
  expect(found.map((match) => match.cents)).toEqual([480_000, 360_000, 288_000, 72_000]);
});

test("a code or a date is not mistaken for money", () => {
  expect(findMoney("03/14/2026 85025 Complete blood count")).toEqual([]);
});

test("cents are shown as dollars again", () => {
  expect(formatCents(1_124_100)).toBe("$11,241.00");
  expect(formatCents(-620)).toBe("-$6.20");
});
