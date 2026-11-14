import { expect, test } from "vitest";
import { sampleBabyBillText, sampleBillText, sampleEobText } from "../fixtures";
import { parseText } from "./parse-text";

const samples = { bill: sampleBillText, eob: sampleEobText, babyBill: sampleBabyBillText };

test.each(Object.entries(samples))("in the %s sample the lines add up to the total", (_name, text) => {
  const document = parseText(text);
  const sum = document.lines.reduce((total, line) => total + line.amountCents, 0);
  expect(sum).toBe(document.totalCents);
  expect(document.needsReview).toBeUndefined();
});

test("a hospital bill for the mother is recognised", () => {
  const document = parseText(sampleBillText);
  expect(document).toMatchObject({
    kind: "hospital_bill_mother",
    provider: "Riverside Women's Hospital",
    patientRole: "mother",
    issuedOn: "2026-03-20",
    totalCents: 1_124_100,
    patientBalanceCents: 214_100,
    network: "in_network",
    isDemo: true,
  });
});

test("an insurance explanation (EOB) is recognised with what the family owes", () => {
  const document = parseText(sampleEobText);
  expect(document).toMatchObject({ kind: "insurance_eob", provider: "Riverside Women's Hospital", issuedOn: "2026-03-28", totalCents: 1_116_850, patientBalanceCents: 166_420 });
});

test("a newborn bill is recognised as the baby's paper", () => {
  const document = parseText(sampleBabyBillText);
  expect(document).toMatchObject({ kind: "hospital_bill_baby", patientRole: "baby", issuedOn: "2026-03-21", patientBalanceCents: 41_700 });
});

test("the same text always gets the same id", () => {
  expect(parseText(sampleBillText).id).toBe(parseText(sampleBillText).id);
  expect(parseText(sampleBillText).id).not.toBe(parseText(sampleEobText).id);
});

test("a total that does not match the lines is flagged for a person to check", () => {
  const document = parseText(sampleBillText.replace("Total charges: $11,241.00", "Total charges: $11,500.00"));
  expect(document.needsReview?.[0]).toContain("$11,241.00");
  expect(document.needsReview?.[0]).toContain("$11,500.00");
});

test("text without charges gets a kind message", () => {
  expect(() => parseText("Thank you for choosing our hospital.\nWe wish you well.")).toThrow(/could not find any charge lines/);
});
