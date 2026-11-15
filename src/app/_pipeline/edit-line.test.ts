import { describe, expect, it } from "vitest";
import { checkPapers, checkSample } from "./check-papers";
import { correctLine as editLine, readDollars } from "./edit-line";

describe("correcting a line", () => {
  it("reads dollar amounts the way people type them", () => {
    expect(readDollars("$1,234.50")).toBe(123_450);
    expect(readDollars("72.5")).toBe(7_250);
    expect(readDollars("0")).toBe(0);
    expect(readDollars("about 70")).toBeNull();
    expect(readDollars("-5")).toBeNull();
    expect(readDollars("")).toBeNull();
  });

  it("changes only the chosen line and leaves the first papers untouched", async () => {
    const { documents } = await checkSample();
    const line = documents[0].lines[0];
    const edited = editLine(documents, documents[0].id, line.id, { amountCents: 100 });
    expect(edited[0].lines[0].amountCents).toBe(100);
    expect(documents[0].lines[0].amountCents).toBe(line.amountCents);
    expect(edited[0].lines.slice(1)).toEqual(documents[0].lines.slice(1));
  });

  it("makes the engine recount the money in question", async () => {
    const before = await checkSample();
    const finding = before.findings.find((candidate) => candidate.lineIds.length > 0)!;
    const paper = before.documents.find((document) => document.id === finding.documentId)!;
    // A line the check asked about becomes a different, cheaper service.
    const after = checkPapers(editLine(before.documents, paper.id, finding.lineIds[finding.lineIds.length - 1], { description: "Corrected by the family", amountCents: 100, code: "" }));
    const sum = after.findings.reduce((total, item) => total + item.atStakeCents, 0);
    expect(after.totalAtStakeCents).toBe(sum);
    expect(JSON.stringify(after.findings)).not.toBe(JSON.stringify(before.findings));
  });
});
