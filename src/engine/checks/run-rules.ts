import type { Finding, ParsedDocument } from "@/contracts";
import { ruleDescriptions } from "@content/rules";
import type { Rule } from "../rules/rule";
import { allRules, moreSpecificRules } from "./all-rules";

// Runs every rule on the family's papers and returns the findings, each with a
// stable id and the source of its rule. The same papers always give the same findings.
export function runRules(documents: ParsedDocument[], rules: Rule[] = allRules): Finding[] {
  const raw = rules.flatMap((rule) => rule.check(documents).map((finding) => ({ ...finding, ruleId: rule.id })));

  const kept = raw.filter((finding) => {
    const stronger = moreSpecificRules[finding.ruleId] ?? [];
    return !raw.some((other) => other.documentId === finding.documentId && stronger.includes(other.ruleId));
  });

  const counters = new Map<string, number>();
  return kept.map((finding) => {
    const key = `${finding.ruleId}-${finding.documentId}`;
    const number = (counters.get(key) ?? 0) + 1;
    counters.set(key, number);
    const description = ruleDescriptions[finding.ruleId];
    return {
      ...finding,
      // A rule whose official source does not confirm it may only ask, never assert.
      confidence: description?.sourceCheck === "confirmed" ? finding.confidence : "worth_asking",
      id: `finding-${key}-${number}`,
      sourceNote: description ? `${description.sourceName} (${description.sourceUrl})` : "",
    };
  });
}
