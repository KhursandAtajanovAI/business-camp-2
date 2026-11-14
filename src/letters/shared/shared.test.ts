import { expect, test } from "vitest";
import { sampleAnalysis } from "@/contracts/stubs";
import { fillTemplate } from "./fill-template";
import { formatDate, formatMoney } from "./format";
import { describeLines, groupFindings, LetterError } from "./group-findings";

test("places in a template are filled and unknown places stay visible", () => {
  expect(fillTemplate("Dear {{name}}, {{missing}}", { name: "Billing" })).toBe("Dear Billing, {{missing}}");
});

test("money and dates are written the American way", () => {
  expect(formatMoney(1_124_100)).toBe("$11,241.00");
  expect(formatDate("2026-03-20")).toBe("March 20, 2026");
  expect(formatDate("")).toBe("");
});

test("findings are grouped by the paper they are on", () => {
  const groups = groupFindings(sampleAnalysis, sampleAnalysis.findings);
  expect(groups).toHaveLength(1);
  expect(groups[0].document.provider).toContain("Riverside");
  expect(describeLines(groups[0].document, groups[0].findings[0])).toBe("85025 Complete blood count; 85025 Complete blood count");
});

test("no chosen findings gives a kind message", () => {
  expect(() => groupFindings(sampleAnalysis, [])).toThrow(LetterError);
});
