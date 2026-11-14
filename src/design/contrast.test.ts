import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";
import { contrastRatio, readColorTokens } from "./contrast";

const colors = readColorTokens(readFileSync(new URL("./tokens.css", import.meta.url), "utf8"));

// Every pair of text color and background that the screens really use.
const pairs: [text: string, background: string][] = [
  ["ink", "cream"], ["ink", "surface"], ["ink-soft", "cream"], ["ink-soft", "surface"],
  ["surface", "coral-deep"], ["coral-deep", "cream"], ["coral-deep", "surface"],
  ["sage-deep", "surface"], ["sage-deep", "cream"], ["sage-deep", "sage-soft"], ["ink", "sage-soft"],
  ["lavender-deep", "surface"], ["lavender-deep", "lavender-soft"], ["ink", "lavender-soft"],
  ["amber-deep", "amber-soft"], ["ink", "amber-soft"], ["ink", "amber"], ["ink", "coral-soft"],
];

describe("design tokens", () => {
  it.each(pairs)("%s text on %s keeps AA contrast", (text, background) => {
    expect(colors[text], text).toBeDefined();
    expect(colors[background], background).toBeDefined();
    expect(contrastRatio(colors[text], colors[background])).toBeGreaterThanOrEqual(4.5);
  });

  it("has no red among the tokens", () => {
    for (const hex of Object.values(colors)) {
      const [red, green, blue] = [1, 3, 5].map((start) => parseInt(hex.slice(start, start + 2), 16));
      expect(red > 200 && green < 80 && blue < 80, hex).toBe(false);
    }
  });
});
