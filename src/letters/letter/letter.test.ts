import { extractText, getDocumentProxy } from "unpdf";
import { expect, test } from "vitest";
import { sampleAnalysis } from "@/contracts/stubs";
import { groupFindings } from "../shared/group-findings";
import { buildLetterContent } from "./letter-content";
import { renderLettersPdf } from "./letter-pdf";
import { dataUrlToBytes, pdfToDataUrl } from "./pdf-url";
import { toPdfSafe, wrapText } from "./wrap-text";

const options = { today: "2026-04-01", explain: () => "The same test is listed twice for the same day." };
const group = groupFindings(sampleAnalysis, sampleAnalysis.findings)[0];

test("the letter names the provider, each finding and the amount in question", () => {
  const letter = buildLetterContent(group, options).map((block) => block.text).join("\n");
  expect(letter).toContain("To the Billing Department of Riverside Women's Hospital (Sample):");
  expect(letter).toContain("statement dated March 20, 2026");
  expect(letter).toContain("1. The same blood test appears twice on the same day");
  expect(letter).toContain("Amount in question: $725.00");
  expect(letter).toContain("Total amount in question: $725.00");
  expect(letter).toContain("not medical or legal advice");
});

test("long text is wrapped to the page width", () => {
  const lines = wrapText("one two three four five six", 10, (piece) => piece.length);
  expect(lines).toEqual(["one two", "three four", "five six"]);
  expect(toPdfSafe("it’s — ok \u{1F600}")).toBe("it's - ok ?");
});

test("the letter becomes a real PDF that contains the same words", async () => {
  const bytes = await renderLettersPdf([buildLetterContent(group, options)]);
  expect(new TextDecoder().decode(bytes.slice(0, 5))).toBe("%PDF-");
  const { text } = await extractText(await getDocumentProxy(bytes), { mergePages: true });
  expect(text).toContain("Request for review of charges");
  expect(text).toContain("Amount in question: $725.00");
});

test("the PDF survives the trip into a download link and back", async () => {
  const bytes = await renderLettersPdf([buildLetterContent(group, options)]);
  const url = pdfToDataUrl(bytes);
  expect(url.startsWith("data:application/pdf;base64,")).toBe(true);
  expect(dataUrlToBytes(url)).toEqual(bytes);
});
