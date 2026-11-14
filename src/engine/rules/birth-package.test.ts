import { expect, test } from "vitest";
import type { ParsedDocument } from "@/contracts";
import { sampleDocument } from "@/contracts/stubs";
import { birthPackage } from "./birth-package";

const line = (id: string, code: string, description: string, amountCents: number) => ({ id, code, description, quantity: 1, amountCents });
const bill = (lines: ParsedDocument["lines"], extra: Partial<ParsedDocument> = {}): ParsedDocument => ({ ...sampleDocument, kind: "obstetrician_bill", lines, ...extra });

test("finds delivery of the placenta and postpartum care billed next to the full package", () => {
  const findings = birthPackage.check([
    bill([line("a", "59510", "Routine obstetric care with cesarean delivery", 540_000), line("b", "59414", "Delivery of placenta", 38_000), line("c", "59430", "Postpartum care visit", 24_000)]),
  ]);
  expect(findings.map((finding) => [finding.lineIds[0], finding.atStakeCents])).toEqual([["b", 38_000], ["c", 24_000]]);
  expect(findings[0].title).toBe('"Delivery of placenta" (59414) is usually part of the birth package (59510)');
  expect(findings.every((finding) => finding.confidence === "likely")).toBe(true);
});

test("finds a package part that the same practice put on a second bill", () => {
  const first = bill([line("a", "59400", "Routine obstetric care with vaginal delivery", 480_000)], { id: "doc-1" });
  const second = bill([line("b", "59426", "Care before the birth, 7 or more visits", 90_000)], { id: "doc-2" });
  expect(birthPackage.check([first, second]).map((finding) => finding.documentId)).toEqual(["doc-2"]);
});

test("stays silent when there is no package on the bill", () => {
  expect(birthPackage.check([bill([line("a", "59430", "Postpartum care visit", 24_000), line("b", "76805", "Pregnancy ultrasound", 31_000)])])).toEqual([]);
});

test("stays silent about services the package does not cover, such as an ultrasound", () => {
  expect(birthPackage.check([bill([line("a", "59400", "Routine obstetric care with vaginal delivery", 480_000), line("b", "76805", "Pregnancy ultrasound", 31_000)])])).toEqual([]);
});

test("stays silent when another provider billed the part", () => {
  const first = bill([line("a", "59400", "Routine obstetric care with vaginal delivery", 480_000)], { id: "doc-1" });
  const second = bill([line("b", "59430", "Postpartum care visit", 24_000)], { id: "doc-2", provider: "Another Clinic" });
  expect(birthPackage.check([first, second])).toEqual([]);
});
