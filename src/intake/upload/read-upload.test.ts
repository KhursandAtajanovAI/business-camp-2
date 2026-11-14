import { PDFDocument, StandardFonts } from "pdf-lib";
import { expect, test } from "vitest";
import { IntakeError } from "./messages";
import { readUpload } from "./read-upload";

async function makePdf(lines: string[]): Promise<File> {
  const pdf = await PDFDocument.create();
  const page = pdf.addPage([612, 792]);
  const font = await pdf.embedFont(StandardFonts.Helvetica);
  lines.forEach((line, index) => page.drawText(line, { x: 50, y: 720 - index * 20, size: 12, font }));
  const bytes = await pdf.save();
  return new File([bytes.buffer as ArrayBuffer], "bill.pdf", { type: "application/pdf" });
}

test("a person can upload a PDF and we get its text line by line", async () => {
  const file = await makePdf(["Riverside Hospital (Sample)", "85025 Complete blood count 1 $72.50", "Total charges $72.50"]);
  const text = await readUpload(file);
  expect(text).toContain("85025 Complete blood count 1 $72.50");
  expect(text.split("\n").length).toBeGreaterThanOrEqual(3);
});

test("a text file is read as it is", async () => {
  const file = new File(["Room and board $2,400.00"], "bill.txt", { type: "text/plain" });
  expect(await readUpload(file)).toBe("Room and board $2,400.00");
});

test("a PDF without text gets a kind message", async () => {
  const pdf = await PDFDocument.create();
  pdf.addPage();
  const bytes = await pdf.save();
  const file = new File([bytes.buffer as ArrayBuffer], "scan.pdf", { type: "application/pdf" });
  await expect(readUpload(file)).rejects.toBeInstanceOf(IntakeError);
});
