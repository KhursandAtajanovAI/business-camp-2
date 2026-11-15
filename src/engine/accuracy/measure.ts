import type { Finding } from "@/contracts";

export type Planted = { ruleId: string; atStakeCents: number; note?: string };
export type Found = Pick<Finding, "ruleId" | "atStakeCents">;

// One labelled set after the engine has looked at it.
export type SetResult = { id: string; group: string; planted: Planted[]; hits: Planted[]; missed: Planted[]; falseAlarms: Found[] };

export type Totals = {
  sets: number;
  planted: number;
  hits: number;
  missed: number;
  falseAlarms: number;
  findings: number; // everything the engine said: hits + false alarms
  foundPercent: number | null; // of the planted mistakes, how many the engine found (recall)
  rightPercent: number | null; // of the engine's findings, how many were planted (precision)
  quietSets: number; // sets where the engine raised no false alarm
};

// A planted mistake counts as found only when the expected rule speaks up with exactly
// the expected amount. Each finding can match one planted mistake; the rest are false alarms.
export function compare(id: string, group: string, planted: Planted[], findings: Found[]): SetResult {
  const left = [...findings];
  const hits: Planted[] = [];
  const missed: Planted[] = [];
  for (const mistake of planted) {
    const index = left.findIndex((finding) => finding.ruleId === mistake.ruleId && finding.atStakeCents === mistake.atStakeCents);
    if (index === -1) missed.push(mistake);
    else {
      hits.push(mistake);
      left.splice(index, 1);
    }
  }
  return { id, group, planted, hits, missed, falseAlarms: left.map(({ ruleId, atStakeCents }) => ({ ruleId, atStakeCents })) };
}

const percent = (part: number, whole: number): number | null => (whole === 0 ? null : Math.round((part / whole) * 100));

export function totals(results: SetResult[]): Totals {
  const count = (pick: (result: SetResult) => unknown[]) => results.reduce((sum, result) => sum + pick(result).length, 0);
  const planted = count((result) => result.planted);
  const hits = count((result) => result.hits);
  const falseAlarms = count((result) => result.falseAlarms);
  return {
    sets: results.length,
    planted,
    hits,
    missed: planted - hits,
    falseAlarms,
    findings: hits + falseAlarms,
    foundPercent: percent(hits, planted),
    rightPercent: percent(hits, hits + falseAlarms),
    quietSets: results.filter((result) => result.falseAlarms.length === 0).length,
  };
}

export type RuleRow = { ruleId: string; planted: number; hits: number; missed: number; falseAlarms: number };

// The same counts, one row per rule, so a weak rule cannot hide behind a strong one.
export function byRule(results: SetResult[]): RuleRow[] {
  const rows = new Map<string, RuleRow>();
  const row = (ruleId: string) => {
    if (!rows.has(ruleId)) rows.set(ruleId, { ruleId, planted: 0, hits: 0, missed: 0, falseAlarms: 0 });
    return rows.get(ruleId) as RuleRow;
  };
  for (const result of results) {
    for (const mistake of result.planted) row(mistake.ruleId).planted += 1;
    for (const mistake of result.hits) row(mistake.ruleId).hits += 1;
    for (const mistake of result.missed) row(mistake.ruleId).missed += 1;
    for (const finding of result.falseAlarms) row(finding.ruleId).falseAlarms += 1;
  }
  return [...rows.values()].sort((first, second) => first.ruleId.localeCompare(second.ruleId));
}
