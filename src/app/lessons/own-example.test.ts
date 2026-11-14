import { describe, expect, it } from "vitest";
import { sampleAnalysis } from "@/contracts/stubs";
import { lessons } from "@content/lessons/lessons";
import { fillLesson, ownExample } from "./own-example";

describe("lessons on the person's own example", () => {
  const facts = ownExample(sampleAnalysis, false);

  it("fills every place in every lesson", () => {
    for (const lesson of lessons) {
      const filled = fillLesson(lesson, facts);
      expect(filled.body.join(" ")).not.toMatch(/\{\{|\}\}/);
    }
  });

  it("quotes the person's own line and numbers", () => {
    const first = fillLesson(lessons[0], facts).body.join(" ");
    expect(first).toContain("Room and board, semi-private, 2 days");
    expect(first).toContain("$4,800.00");
    expect(first).toContain("your paper");
  });

  it("says so when the example is our made-up one", () => {
    expect(fillLesson(lessons[0], ownExample(sampleAnalysis, true)).body.join(" ")).toContain("the sample paper");
  });
});
