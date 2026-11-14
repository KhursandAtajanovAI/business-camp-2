import { expect, test } from "vitest";
import type { ParsedDocument } from "@/contracts";
import { sampleDocument } from "@/contracts/stubs";
import { balanceAboveEob } from "./balance-above-eob";
import { findEobFor } from "./find-eob";
import { insuranceNotApplied } from "./insurance-not-applied";
import { motherBabyRepeat } from "./mother-baby-repeat";

const line = (id: string, code: string, amountCents: number, extra: object = {}) => ({ id, code, description: "Service", quantity: 1, amountCents, serviceDate: "2026-03-14", ...extra });
const bill = (extra: Partial<ParsedDocument>): ParsedDocument => ({ ...sampleDocument, id: "bill", lines: [line("b1", "0120", 100_000)], totalCents: 100_000, patientBalanceCents: 30_000, ...extra });
const eob = (extra: Partial<ParsedDocument>): ParsedDocument => ({
  ...sampleDocument, id: "eob", kind: "insurance_eob", totalCents: 100_000, patientBalanceCents: 20_000,
  lines: [line("e1", "0120", 100_000, { allowedCents: 80_000, planPaidCents: 60_000, patientOwesCents: 20_000 })], ...extra,
});

test("an EOB is matched to the bill of the same provider and patient", () => {
  expect(findEobFor(bill({}), [bill({}), eob({})])?.id).toBe("eob");
  expect(findEobFor(bill({}), [eob({ provider: "Another Clinic" })])).toBeUndefined();
  expect(findEobFor(bill({}), [eob({ patientRole: "baby" })])).toBeUndefined();
});

test("finds a bill that asks for more than the EOB says the family owes", () => {
  expect(balanceAboveEob.check([bill({}), eob({})])).toEqual([
    { documentId: "bill", lineIds: [], title: "The bill asks for $300.00, but your insurance explanation says you owe $200.00", atStakeCents: 10_000, confidence: "likely" },
  ]);
});

test("stays silent when the bill matches the EOB or there is no EOB", () => {
  expect(balanceAboveEob.check([bill({ patientBalanceCents: 20_000 }), eob({})])).toEqual([]);
  expect(balanceAboveEob.check([bill({})])).toEqual([]);
});

test("finds a bill printed before the insurance payment was applied", () => {
  const findings = insuranceNotApplied.check([bill({ patientBalanceCents: 100_000 }), eob({})]);
  expect(findings).toMatchObject([{ documentId: "bill", atStakeCents: 80_000, confidence: "likely" }]);
});

test("stays silent when the bill already shows a payment or the plan paid nothing", () => {
  expect(insuranceNotApplied.check([bill({}), eob({})])).toEqual([]);
  const unpaid = eob({ lines: [line("e1", "0120", 100_000, { planPaidCents: 0 })], patientBalanceCents: 100_000 });
  expect(insuranceNotApplied.check([bill({ patientBalanceCents: 100_000 }), unpaid])).toEqual([]);
});

const motherBill = bill({ id: "mother", lines: [line("m1", "92558", 18_500, { description: "Newborn hearing screening" }), line("m2", "0120", 480_000)] });
const babyBill = bill({ id: "baby", patientRole: "baby", kind: "hospital_bill_baby", lines: [line("c1", "92558", 18_500, { description: "Newborn hearing screening" })] });

test("finds a newborn service that is on the mother's bill and on the baby's bill", () => {
  expect(motherBabyRepeat.check([motherBill, babyBill])).toEqual([
    { documentId: "mother", lineIds: ["m1"], title: '"Newborn hearing screening" on 03/14/2026 is on the mother\'s bill and on the baby\'s bill', atStakeCents: 18_500, confidence: "worth_asking" },
  ]);
});

test("stays silent when the date or the price differs, or there is only one bill", () => {
  const otherDay = { ...babyBill, lines: [line("c1", "92558", 18_500, { serviceDate: "2026-03-15" })] };
  expect(motherBabyRepeat.check([motherBill, otherDay])).toEqual([]);
  expect(motherBabyRepeat.check([motherBill])).toEqual([]);
});
