import { expect, test } from "vitest";
import { sampleAnalysis } from "@/contracts/stubs";
import { buildLetterPackage, LetterError } from "./index";

test("chosen findings become a letter link and a call script", async () => {
  const letterPackage = await buildLetterPackage(sampleAnalysis, sampleAnalysis.findings);
  expect(letterPackage.letterPdfUrl.startsWith("data:application/pdf;base64,JVBER")).toBe(true);
  expect(letterPackage.callScript).toContain("WHAT TO SAY");
});

test("nothing chosen gives a kind message with a next step", async () => {
  await expect(buildLetterPackage(sampleAnalysis, [])).rejects.toBeInstanceOf(LetterError);
});
