import { describe, expect, it } from "vitest";
import { sampleAnalysis } from "@/contracts/stubs";
import { caseProgress, refreshCase, startCase } from "./case-source";

describe("the case behind the case-file screen", () => {
  it("starts with every chosen finding open", () => {
    const started = startCase(sampleAnalysis, null);
    expect(started.claimedFindingIds).toEqual(["finding-sample-1"]);
    expect(caseProgress(started)).toEqual({ total: 1, closed: 0, savedCents: 0 });
  });

  it("keeps reminders and recorded answers when the papers are checked again", () => {
    const started = startCase(sampleAnalysis, null);
    const answered = {
      ...started,
      deadlines: [{ label: "Call", dueOn: "2026-04-20", done: false }],
      outcomes: [{ findingId: "finding-sample-1", status: "won" as const, savedCents: 7_250 }],
    };
    const refreshed = refreshCase(answered, sampleAnalysis, null);
    expect(refreshed.deadlines).toHaveLength(1);
    expect(caseProgress(refreshed)).toEqual({ total: 1, closed: 1, savedCents: 7_250 });
  });

  it("counts only money the family confirmed as taken off", () => {
    const started = startCase(sampleAnalysis, null);
    const lost = { ...started, outcomes: [{ findingId: "finding-sample-1", status: "lost" as const }] };
    expect(caseProgress(lost).savedCents).toBe(0);
  });
});
