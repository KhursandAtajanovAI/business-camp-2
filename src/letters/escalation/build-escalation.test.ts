import { expect, test } from "vitest";
import type { Analysis } from "@/contracts";
import { sampleAnalysis, sampleDocument } from "@/contracts/stubs";
import { buildEscalationSteps } from "./build-escalation";

const withEob: Analysis = {
  ...sampleAnalysis,
  documents: [{ ...sampleDocument, network: "out_of_network" }, { ...sampleDocument, id: "doc-eob", kind: "insurance_eob" }],
};

test("the steps are numbered in order, starting from one", () => {
  const steps = buildEscalationSteps(sampleAnalysis, sampleAnalysis.findings);
  expect(steps.map((step) => step.step)).toEqual([1, 2, 3, 4]);
  expect(steps[0].text).toContain("in writing");
});

test("insurance steps appear only when the case has an insurance paper", () => {
  const without = buildEscalationSteps(sampleAnalysis, sampleAnalysis.findings).map((step) => step.text).join(" ");
  const withPaper = buildEscalationSteps(withEob, sampleAnalysis.findings).map((step) => step.text).join(" ");
  expect(without).not.toContain("internal appeal");
  expect(withPaper).toContain("internal appeal");
});

test("the surprise-bill step appears only for an out-of-network paper", () => {
  const steps = buildEscalationSteps(withEob, sampleAnalysis.findings).map((step) => step.text).join(" ");
  expect(steps).toContain("No Surprises Help Desk");
  expect(buildEscalationSteps(sampleAnalysis, sampleAnalysis.findings).map((step) => step.text).join(" ")).not.toContain("No Surprises");
});

test("the steps give options, not legal advice or promises", () => {
  const text = buildEscalationSteps(withEob, sampleAnalysis.findings).map((step) => step.text).join(" ");
  expect(text).not.toMatch(/you must|you should sue|lawsuit|guarantee|!/i);
});
