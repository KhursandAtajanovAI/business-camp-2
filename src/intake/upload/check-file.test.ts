import { expect, test } from "vitest";
import { checkFile, MAX_FILE_BYTES } from "./check-file";
import { IntakeError } from "./messages";

test("a PDF, a photo and a text file are accepted", () => {
  expect(checkFile({ name: "bill.pdf", type: "application/pdf", size: 1000 })).toBe("pdf");
  expect(checkFile({ name: "bill.jpg", type: "image/jpeg", size: 1000 })).toBe("photo");
  expect(checkFile({ name: "bill.txt", type: "text/plain", size: 1000 })).toBe("text");
});

test("a file without a type is recognised by its name", () => {
  expect(checkFile({ name: "Scan.PDF", type: "", size: 1000 })).toBe("pdf");
});

test("a wrong type gets a kind message with a next step", () => {
  try {
    checkFile({ name: "bill.docx", type: "application/msword", size: 1000 });
    expect.unreachable();
  } catch (error) {
    expect(error).toBeInstanceOf(IntakeError);
    expect((error as IntakeError).nextStep).toContain("paste the text");
  }
});

test("empty and oversized files are refused kindly", () => {
  expect(() => checkFile({ name: "a.pdf", type: "application/pdf", size: 0 })).toThrow(/empty/);
  expect(() => checkFile({ name: "a.pdf", type: "application/pdf", size: MAX_FILE_BYTES + 1 })).toThrow(/too big/);
});
