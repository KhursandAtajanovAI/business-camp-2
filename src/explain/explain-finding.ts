import type { Finding } from "@/contracts";
import { ruleDescriptions } from "@content/rules";

const usd = (cents: number) => `$${Math.floor(cents / 100).toLocaleString("en-US")}.${String(cents % 100).padStart(2, "0")}`;

// Up to three short sentences in plain English. The wording belongs to the rule,
// the amount belongs to the finding, so the number is always the engine's number.
export function explainFinding(finding: Finding): string {
  const rule = ruleDescriptions[finding.ruleId];
  if (!rule) return `${finding.title}. The amount in question is ${usd(finding.atStakeCents)}.`;
  return rule.explanation.replace("{{amount}}", usd(finding.atStakeCents));
}
