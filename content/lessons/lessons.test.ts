import { describe, expect, it } from "vitest";
import { lessons } from "./lessons";

const words = (text: string) => text.split(/\s+/).filter(Boolean).length;

describe("micro-lessons", () => {
  it.each(lessons)("$id takes about one minute to read", (lesson) => {
    const count = words([lesson.title, ...lesson.body, lesson.takeaway].join(" "));
    expect(count).toBeGreaterThanOrEqual(80);
    expect(count).toBeLessThanOrEqual(190);
  });

  it.each(lessons)("$id uses the person's own example", (lesson) => {
    expect(lesson.body.some((paragraph) => /\{\{\w+\}\}/.test(paragraph))).toBe(true);
  });

  it("stays in calm English: no exclamation marks, no promises, no advice words", () => {
    const all = JSON.stringify(lessons);
    expect(all).not.toMatch(/!|[Ѐ-ӿ]/);
    expect(all).not.toMatch(/\b(guarantee|refund|you should sue|diagnos|treatment)\b/i);
  });

  it("has unique ids", () => {
    expect(new Set(lessons.map((lesson) => lesson.id)).size).toBe(lessons.length);
  });
});
