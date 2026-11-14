import { readdirSync, readFileSync, statSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";

// Reads every file in Dias's folders and checks the promises the screens make to a tired parent.
const root = join(import.meta.dirname, "..", "..", "..");
const folders = ["src/app", "src/components", "src/design", "content/lessons"];
const skip = (path: string) => path.includes(`${join("src", "app", "api")}`) || /\.(woff2|txt|png)$/.test(path) || path.endsWith(".test.ts");

function filesIn(folder: string): string[] {
  return readdirSync(folder).flatMap((name) => {
    const path = join(folder, name);
    return statSync(path).isDirectory() ? filesIn(path) : [path];
  });
}

const files = folders.flatMap((folder) => filesIn(join(root, folder))).filter((path) => !skip(path));
const code = files.filter((path) => /\.tsx?$/.test(path));
const read = (path: string) => readFileSync(path, "utf8");
// Only the words a person can read: text inside quotes and between tags.
const visible = (source: string) => [...source.matchAll(/"([^"\n]*)"|`([^`]*)`|>([^<>{}\n]+)</g)].map((match) => match[1] ?? match[2] ?? match[3]).join("\n");

describe("every screen keeps its promises", () => {
  it("has English only, with no Cyrillic anywhere", () => {
    for (const path of files) expect(read(path), path).not.toMatch(/[Ѐ-ӿ]/);
  });

  it("never shows alarming words, urgency or exclamation marks", () => {
    for (const path of code) {
      const words = visible(read(path));
      expect(words, path).not.toMatch(/\b(error|danger|overdue|urgent|hurry|last chance|only \d+ left|act now)\b/i);
      expect(words, path).not.toMatch(/\w!(\s|$)/);
    }
  });

  it("never promises money back and never gives medical or legal advice", () => {
    for (const path of code) {
      const words = visible(read(path));
      expect(words, path).not.toMatch(/we('ll| will) (get|win|recover)|get your money back|guaranteed|you are owed|overcharged you/i);
      expect(words, path).not.toMatch(/\b(you should (sue|stop taking|refuse treatment)|legal advice:|diagnos)/i);
    }
  });

  it("takes every color from the design tokens: no hand-written colors and no red", () => {
    for (const path of code) {
      const source = read(path);
      expect(source, path).not.toMatch(/#[0-9a-fA-F]{3,8}\b(?![\w-])|rgba?\(|hsla?\(/);
      expect(source, path).not.toMatch(/\b(text|bg|border|fill|stroke)-(red|rose|pink|orange)-\d/);
    }
  });

  it("keeps words out of the screens: screens hold no long sentences of their own", () => {
    const screens = code.filter((path) => /src[\\/](app|components)[\\/]/.test(path) && path.endsWith(".tsx"));
    for (const path of screens) {
      const inline = [...read(path).matchAll(/>\s*([A-Z][a-z]+(?: [a-z']+){3,}[^<>{}]*)</g)].map((match) => match[1]);
      expect(inline, path).toEqual([]);
    }
  });

  it("has a short README in every folder and no file longer than about 150 lines", () => {
    const dirs = new Set(files.map((path) => path.slice(0, path.lastIndexOf("/"))));
    for (const dir of dirs) if (!dir.endsWith("fonts")) expect(files, dir).toContain(join(dir, "README.md"));
    for (const path of code) expect(read(path).split("\n").length, path).toBeLessThanOrEqual(155);
  });
});
