import { expect, test } from "vitest";
import { sampleBabyBillText, sampleBillText, sampleEobText } from "../fixtures";
import { parseText } from "../parse/parse-text";
import { redactPersonalData } from "./redact";

const personalData = [
  "Jane Sample", "Baby Girl Sample", "04/02/1994", "12 Maple Street", "Apt 4", "Columbus, OH 43004",
  "88213377", "XKT445821907", "GRP-778812", "2026-0314-55871", "(614) 555-0142", "400 River Road",
];

test.each([sampleBillText, sampleEobText, sampleBabyBillText])("names, addresses and policy numbers are gone from sample %#", (text) => {
  const safe = redactPersonalData(text);
  for (const secret of personalData) expect(safe).not.toContain(secret);
});

test("the charges, codes and provider are still readable after hiding", () => {
  const safe = redactPersonalData(sampleBillText);
  expect(safe).toContain("Riverside Women's Hospital");
  expect(safe).toContain("85025  Complete blood count");
  expect(safe).toContain("Patient: [hidden name]");
  expect(safe).toContain("Member ID: [hidden number]");
});

test.each([sampleBillText, sampleEobText, sampleBabyBillText])("hiding does not change what the parser finds in sample %#", (text) => {
  const before = parseText(text);
  const after = parseText(redactPersonalData(text));
  expect(after.lines.map(({ id: _id, ...line }) => line)).toEqual(before.lines.map(({ id: _id, ...line }) => line));
  expect(after.totalCents).toBe(before.totalCents);
  expect(after.kind).toBe(before.kind);
});

test("emails and Social Security numbers are hidden wherever they appear", () => {
  const safe = redactPersonalData("Questions? Write to jane.sample@example.com. SSN 123-45-6789 on file.");
  expect(safe).toBe("Questions? Write to [hidden email]. SSN [hidden number] on file.");
});

test("text without personal data stays the same", () => {
  const text = "85025  Complete blood count  1  $72.50";
  expect(redactPersonalData(text)).toBe(text);
});
