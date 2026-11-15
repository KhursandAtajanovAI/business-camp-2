import { readFileSync, writeFileSync } from "node:fs";
import { expect, test } from "vitest";
import { demoSets } from "@content/demo-documents";
import { checkSets } from "@content/demo-documents/accuracy";
import { parseDocument, redactPersonalData } from "@/intake";
import { allRules } from "../checks/all-rules";
import { analyze } from "../index";
import { byRule, compare, totals, type SetResult } from "./measure";
import { accuracyReport } from "./report";

const DOCUMENT = "docs/economics/accuracy.md";
const START = "<!-- measured:start -->";
const END = "<!-- measured:end -->";

const labelled = [...demoSets.map((set) => ({ ...set, group: "sample" })), ...checkSets];

// Every paper goes the same way a real upload goes: text, then parseDocument, then analyze.
async function measureAll(): Promise<SetResult[]> {
  return Promise.all(
    labelled.map(async (set) => {
      const documents = await Promise.all(set.papers.map((paper) => parseDocument(paper.text)));
      return compare(set.id, set.group, set.planted, analyze(documents).findings);
    }),
  );
}

test("a planted mistake is found only by the expected rule with the expected amount", () => {
  const result = compare("s", "g", [{ ruleId: "a", atStakeCents: 100 }, { ruleId: "b", atStakeCents: 50 }], [{ ruleId: "a", atStakeCents: 100 }, { ruleId: "b", atStakeCents: 70 }]);
  expect(result.hits).toEqual([{ ruleId: "a", atStakeCents: 100 }]);
  expect(result.missed).toEqual([{ ruleId: "b", atStakeCents: 50 }]);
  expect(result.falseAlarms).toEqual([{ ruleId: "b", atStakeCents: 70 }]);
});

test("one finding cannot be counted for two planted mistakes", () => {
  const twice = [{ ruleId: "a", atStakeCents: 100 }, { ruleId: "a", atStakeCents: 100 }];
  expect(compare("s", "g", twice, [twice[0]]).missed).toHaveLength(1);
});

test("the totals count misses and false alarms and never divide by zero", () => {
  const results = [
    compare("one", "g", [{ ruleId: "a", atStakeCents: 100 }, { ruleId: "b", atStakeCents: 5 }], [{ ruleId: "a", atStakeCents: 100 }]),
    compare("two", "g", [], [{ ruleId: "a", atStakeCents: 7 }]),
  ];
  expect(totals(results)).toEqual({ sets: 2, planted: 2, hits: 1, missed: 1, falseAlarms: 1, findings: 2, foundPercent: 50, rightPercent: 50, quietSets: 1 });
  expect(totals([compare("empty", "g", [], [])])).toMatchObject({ foundPercent: null, rightPercent: null, quietSets: 1 });
  expect(byRule(results)).toEqual([
    { ruleId: "a", planted: 1, hits: 1, missed: 0, falseAlarms: 1 },
    { ruleId: "b", planted: 1, hits: 0, missed: 1, falseAlarms: 0 },
  ]);
});

test("the check sets are synthetic, in English and have no personal data left after hiding it", () => {
  expect(new Set(labelled.map((set) => set.id)).size).toBe(labelled.length);
  for (const set of checkSets) {
    for (const paper of set.papers) {
      expect(paper.text).toContain("SAMPLE");
      expect(redactPersonalData(paper.text)).not.toMatch(/Jane Sample|Baby (Girl|Boy) Sample|SMP\d{6}/);
    }
  }
  expect(JSON.stringify(checkSets)).not.toMatch(/[Ѐ-ӿ]/);
});

// The document must show what the engine really gets today. To refresh it after a rule
// changes, run: UPDATE_ACCURACY=1 npm test
test("docs/economics/accuracy.md shows the numbers measured right now", async () => {
  const measured = accuracyReport(await measureAll(), allRules.length);
  const text = readFileSync(DOCUMENT, "utf8");
  const [before, rest] = text.split(START);
  const after = rest?.split(END)[1];
  expect(after, `${DOCUMENT} must keep the ${START} and ${END} markers`).toBeDefined();
  if (process.env.UPDATE_ACCURACY) writeFileSync(DOCUMENT, `${before}${START}\n${measured}\n${END}${after}`);
  else expect(text.slice(before.length + START.length, text.length - (after ?? "").length - END.length).trim()).toBe(measured);
});
