import { describe, expect, it } from "vitest";
import { gameBill, gameWords } from "./game";

const lineSum = gameBill.rows.reduce((sum, row) => sum + row.amountCents, 0);

describe("the detective game script", () => {
  it("hides exactly four things: three lines and the total", () => {
    expect(gameBill.rows.filter((row) => row.clue)).toHaveLength(3);
    expect(gameBill.totalClue.found).toBeTruthy();
  });

  it("tells the truth in every clue", () => {
    const hearing = gameBill.rows.filter((row) => row.description === "Newborn hearing screening");
    expect(hearing).toHaveLength(2);
    const lactation = gameBill.rows.find((row) => row.id === "lactation")!;
    expect(lactation.quantity * lactation.unitCents).not.toBe(lactation.amountCents);
    expect(lineSum).toBe(1_173_050);
    expect(gameBill.statedTotalCents - lineSum).toBe(25_000);
  });

  it("keeps every other line honest, so a fine line is really fine", () => {
    for (const row of gameBill.rows.filter((candidate) => !candidate.clue)) {
      expect(row.quantity * row.unitCents, row.id).toBe(row.amountCents);
    }
  });

  it("uses calm English with no pressure", () => {
    const all = JSON.stringify([gameBill, gameWords]);
    expect(all).not.toMatch(/!|[Ѐ-ӿ]/);
    expect(all).not.toMatch(/\b(hurry|time left|game over|wrong|fail|error|danger)\b/i);
  });
});
