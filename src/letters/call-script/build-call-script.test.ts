import { expect, test } from "vitest";
import { sampleAnalysis } from "@/contracts/stubs";
import { groupFindings } from "../shared/group-findings";
import { buildCallScript } from "./build-call-script";

const script = buildCallScript(groupFindings(sampleAnalysis, sampleAnalysis.findings));

test("the script goes in the order of a real call", () => {
  const order = ["BEFORE YOU CALL", "WHAT TO SAY", "WHAT TO WRITE DOWN", "WHAT TO ASK BEFORE YOU HANG UP", "IF THE ANSWER IS NO"];
  const positions = order.map((title) => script.indexOf(title));
  expect(positions.every((position) => position >= 0)).toBe(true);
  expect([...positions].sort((a, b) => a - b)).toEqual(positions);
});

test("the script names the provider, the finding and the amount", () => {
  expect(script).toContain("CALL TO: Riverside Women's Hospital (Sample)");
  expect(script).toContain("statement dated March 20, 2026");
  expect(script).toContain("questions about one charge");
  expect(script).toContain("Question 1: The same blood test appears twice on the same day. The amount in question is $725.00.");
});

test("no place is left unfilled", () => {
  expect(script).not.toContain("{{");
});
