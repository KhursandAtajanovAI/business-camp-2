import { byRule, totals, type SetResult, type Totals } from "./measure";

const usd = (cents: number) => `$${Math.floor(cents / 100).toLocaleString("en-US")}.${String(cents % 100).padStart(2, "0")}`;
const share = (value: number | null) => (value === null ? "n/a" : `${value}%`);

const row = (label: string, t: Totals) =>
  `| ${label} | ${t.sets} | ${t.planted} | ${t.hits} | ${t.missed} | ${t.falseAlarms} | ${share(t.foundPercent)} | ${share(t.rightPercent)} |`;

// The measured part of docs/economics/accuracy.md. A test keeps the file equal to this
// text, so the numbers in the document are always the numbers the engine really gets.
export function accuracyReport(results: SetResult[], ruleCount: number): string {
  const groups = [...new Set(results.map((result) => result.group))];
  const all = totals(results);
  const noMistakes = results.filter((result) => result.planted.length === 0);
  const problems = results.filter((result) => result.missed.length > 0 || result.falseAlarms.length > 0);

  return [
    `Rules in the engine: ${ruleCount}. Labelled sets: ${all.sets}. Planted mistakes: ${all.planted}.`,
    "",
    `**Headline: the engine found ${all.hits} of ${all.planted} planted mistakes (${share(all.foundPercent)}). It raised ${all.findings} findings, and ${all.hits} of them were planted (${share(all.rightPercent)}); ${all.falseAlarms} were false alarms.**`,
    "",
    `On the ${noMistakes.length} sets with no mistake in them, the engine stayed silent on ${totals(noMistakes).quietSets}.`,
    "",
    "| Group | Sets | Planted | Found | Missed | False alarms | Found, % | Findings that were right, % |",
    "|---|---|---|---|---|---|---|---|",
    ...groups.map((group) => row(group, totals(results.filter((result) => result.group === group)))),
    row("**all**", all),
    "",
    "### By rule",
    "",
    "| Rule | Planted | Found | Missed | False alarms |",
    "|---|---|---|---|---|",
    ...byRule(results).map((rule) => `| \`${rule.ruleId}\` | ${rule.planted} | ${rule.hits} | ${rule.missed} | ${rule.falseAlarms} |`),
    "",
    "### Every miss and every false alarm",
    "",
    ...(problems.length === 0 ? ["None."] : problems.flatMap((result) => [
      ...result.missed.map((mistake) => `- \`${result.id}\`: **missed** \`${mistake.ruleId}\`, ${usd(mistake.atStakeCents)}. ${mistake.note ?? ""}`.trimEnd()),
      ...result.falseAlarms.map((finding) => `- \`${result.id}\`: **false alarm** from \`${finding.ruleId}\`, ${usd(finding.atStakeCents)}.`),
    ])),
  ].join("\n");
}
