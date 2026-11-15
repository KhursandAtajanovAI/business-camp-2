import { expect, test } from "vitest";
import type { ParsedDocument } from "@/contracts";
import { sampleDocument } from "@/contracts/stubs";
import { preventiveCareCharged } from "./preventive-care-charged";
import { stayNotCovered } from "./stay-not-covered";

const line = (id: string, description: string, amountCents: number, extra: object = {}) => ({ id, code: "0000", description, quantity: 1, amountCents, serviceDate: "2026-10-16", ...extra });
const doc = (extra: Partial<ParsedDocument>): ParsedDocument => ({ ...sampleDocument, network: "in_network", ...extra });
const eob = (extra: Partial<ParsedDocument>) => doc({ id: "eob", kind: "insurance_eob", ...extra });

const visit = doc({ id: "bill", kind: "pediatrician_bill", patientRole: "baby", provider: "Little Sprouts Pediatrics", lines: [line("b1", "Well-baby visit", 21_000)], totalCents: 21_000, patientBalanceCents: 4_000 });
const visitEob = eob({ patientRole: "baby", provider: "Little Sprouts Pediatrics", lines: [line("e1", "Well-baby visit", 21_000, { allowedCents: 17_000, planPaidCents: 13_000, patientOwesCents: 4_000 })], patientBalanceCents: 4_000 });

test("finds a well-baby visit in network that left money for the family to pay", () => {
  expect(preventiveCareCharged.check([visit, visitEob])).toEqual([
    { documentId: "bill", lineIds: ["b1"], title: '"Well-baby visit" is preventive care, but the plan left $40.00 for you to pay', atStakeCents: 4_000, confidence: "worth_asking" },
  ]);
});

test("points at the insurance explanation when the family has no bill yet", () => {
  expect(preventiveCareCharged.check([visitEob])).toMatchObject([{ documentId: "eob", lineIds: ["e1"], atStakeCents: 4_000 }]);
});

test("finds a preventive bill that asks for money when there is no insurance explanation", () => {
  const pump = doc({ id: "pump", lines: [line("p1", "Breast pump, electric", 28_000)], totalCents: 28_000, patientBalanceCents: 28_000 });
  expect(preventiveCareCharged.check([pump])).toMatchObject([{ documentId: "pump", lineIds: ["p1"], atStakeCents: 28_000, confidence: "worth_asking" }]);
});

test("stays silent when the plan paid in full, the provider is out of network or the care is not preventive", () => {
  const paid = { ...visitEob, lines: [line("e1", "Well-baby visit", 21_000, { allowedCents: 17_000, planPaidCents: 17_000, patientOwesCents: 0 })] };
  expect(preventiveCareCharged.check([{ ...visit, patientBalanceCents: 0 }, paid])).toEqual([]);
  expect(preventiveCareCharged.check([{ ...visit, network: "out_of_network" }, { ...visitEob, network: "out_of_network" }])).toEqual([]);
  const sick = { ...visitEob, lines: [line("e1", "Office visit, fever", 21_000, { allowedCents: 17_000, planPaidCents: 13_000, patientOwesCents: 4_000 })] };
  expect(preventiveCareCharged.check([sick])).toEqual([]);
  const mixed = doc({ id: "mixed", lines: [line("m1", "Well-baby visit", 21_000), line("m2", "Office visit, fever", 9_000)], patientBalanceCents: 9_000 });
  expect(preventiveCareCharged.check([mixed])).toEqual([]);
});

const day = (id: string, columns: [number, number, number], quantity = 1) => line(id, "Room and board, semi-private", 240_000 * quantity, { quantity, allowedCents: columns[0], planPaidCents: columns[1], patientOwesCents: columns[2] });
const hospitalEob = (lines: ParsedDocument["lines"]) => eob({ lines });

test("finds a hospital day after a vaginal birth that the plan did not cover at all", () => {
  const findings = stayNotCovered.check([hospitalEob([day("d1", [180_000, 144_000, 36_000]), day("d2", [0, 0, 240_000])])]);
  expect(findings).toEqual([
    { documentId: "eob", lineIds: ["d2"], title: "Your plan paid nothing for $2,400.00 of a 2-day hospital stay after the birth", atStakeCents: 240_000, confidence: "worth_asking" },
  ]);
});

test("points at the hospital bill when the family has it", () => {
  const bill = doc({ id: "hospital", lines: [line("h1", "Room and board, semi-private", 480_000, { quantity: 2 })] });
  expect(stayNotCovered.check([bill, hospitalEob([day("d1", [180_000, 144_000, 36_000]), day("d2", [0, 0, 240_000])])])[0]).toMatchObject({ documentId: "hospital", lineIds: [] });
});

test("allows four days after a cesarean birth and stays silent beyond the protected days", () => {
  const longStay = hospitalEob([day("d1", [540_000, 432_000, 108_000], 3), day("d4", [0, 0, 240_000])]);
  expect(stayNotCovered.check([longStay])).toEqual([]);
  const cesarean = doc({ id: "ob", kind: "obstetrician_bill", provider: "Maple Grove", lines: [line("o1", "Routine obstetric care with cesarean delivery", 540_000)] });
  expect(stayNotCovered.check([cesarean, longStay])).toMatchObject([{ atStakeCents: 240_000 }]);
});

test("stays silent when the plan covered every day, even if a deductible left a share to the family", () => {
  expect(stayNotCovered.check([hospitalEob([day("d1", [360_000, 0, 360_000], 2)])])).toEqual([]);
  expect(stayNotCovered.check([hospitalEob([day("d1", [360_000, 288_000, 72_000], 2)])])).toEqual([]);
});
