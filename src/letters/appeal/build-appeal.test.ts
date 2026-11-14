import { expect, test } from "vitest";
import type { CaseFile, ParsedDocument } from "@/contracts";
import { sampleCaseFile, sampleDocument } from "@/contracts/stubs";
import { LetterError } from "../shared/group-findings";
import { buildAppealContent, unpaidLines } from "./build-appeal";

const eob: ParsedDocument = {
  ...sampleDocument,
  id: "doc-eob-1",
  kind: "insurance_eob",
  issuedOn: "2026-03-28",
  lines: [
    { id: "e1", code: "0120", description: "Room and board", quantity: 2, amountCents: 480_000, allowedCents: 360_000, planPaidCents: 288_000, patientOwesCents: 72_000 },
    { id: "e2", code: "01967", description: "Anesthesia for labor", quantity: 1, amountCents: 210_000, allowedCents: 0, planPaidCents: 0, patientOwesCents: 210_000 },
  ],
};
const caseWithEob: CaseFile = { ...sampleCaseFile, analysis: { ...sampleCaseFile.analysis, documents: [sampleDocument, eob] } };

test("only services the plan paid nothing for count as not paid", () => {
  expect(unpaidLines(eob).map((line) => line.id)).toEqual(["e2"]);
});

test("the appeal pulls the provider, date, unpaid services and raised questions from the case file", () => {
  const letter = buildAppealContent(caseWithEob, "2026-04-05")[0].map((block) => block.text).join("\n");
  expect(letter).toContain("services from Riverside Women's Hospital (Sample)");
  expect(letter).toContain("explanation of benefits dated March 28, 2026");
  expect(letter).toContain("1. 01967 Anesthesia for labor: billed $2,100.00, plan paid $0.00");
  expect(letter).toContain("Total billed for these services: $2,100.00");
  expect(letter).toContain("The same blood test appears twice on the same day ($725.00 in question)");
  expect(letter).toContain("Member ID: ____");
  expect(letter).toContain("not medical or legal advice");
});

test("without an EOB, or with nothing unpaid, the person gets a kind next step", () => {
  expect(() => buildAppealContent(sampleCaseFile, "2026-04-05")).toThrow(LetterError);
  const allPaid: CaseFile = { ...caseWithEob, analysis: { ...caseWithEob.analysis, documents: [{ ...eob, lines: [eob.lines[0]] }] } };
  expect(() => buildAppealContent(allPaid, "2026-04-05")).toThrow(/does not show an unpaid service/);
});
