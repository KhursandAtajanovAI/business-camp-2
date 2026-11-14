import { describe, expect, it } from "vitest";
import { countOf, formatDate, formatMoney } from "./format";

describe("formatting for people in the United States", () => {
  it("shows cents as dollars", () => {
    expect(formatMoney(124_500)).toBe("$1,245.00");
    expect(formatMoney(7_250)).toBe("$72.50");
  });
  it("writes dates the US way and stays quiet about a missing date", () => {
    expect(formatDate("2026-03-20")).toBe("March 20, 2026");
    expect(formatDate("")).toBe("");
  });
  it("counts things in plain English", () => {
    expect(countOf(1, ["paper", "papers"])).toBe("1 paper");
    expect(countOf(3, ["paper", "papers"])).toBe("3 papers");
  });
});
