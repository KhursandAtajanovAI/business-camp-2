import { expect, test } from "vitest";
import { sampleBillText } from "./fixtures";
import { IntakeError, parseDocument, redactPersonalData } from "./index";

test("pasted text and an uploaded text file give the same document", async () => {
  const fromText = await parseDocument(sampleBillText);
  const fromFile = await parseDocument(new File([sampleBillText], "bill.txt", { type: "text/plain" }));
  expect(fromFile).toEqual(fromText);
  expect(fromText.lines).toHaveLength(5);
});

test("a structured document carries no personal data at all", async () => {
  const document = await parseDocument(sampleBillText);
  const asSentToModel = JSON.stringify(document);
  for (const secret of ["Jane", "Maple", "XKT445821907", "GRP-778812", "88213377", "1994"]) {
    expect(asSentToModel).not.toContain(secret);
  }
});

test("a wrong file gets a kind message, not a crash", async () => {
  const file = new File(["x"], "bill.docx", { type: "application/msword" });
  await expect(parseDocument(file)).rejects.toBeInstanceOf(IntakeError);
});

test("the redaction function is exported for other modules", () => {
  expect(redactPersonalData("Patient: Jane Sample")).toBe("Patient: [hidden name]");
});
