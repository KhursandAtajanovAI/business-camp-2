// The list of rules the engine runs, in the order their findings are shown.
import { duplicateLine } from "../rules/duplicate-line";
import { birthPackage } from "../rules/birth-package";
import { balanceAboveEob } from "../matching/balance-above-eob";
import { insuranceNotApplied } from "../matching/insurance-not-applied";
import type { Rule } from "../rules/rule";

export const allRules: Rule[] = [
  duplicateLine,
  birthPackage,
  balanceAboveEob,
  insuranceNotApplied,
];

// When two rules explain the same gap on the same paper, the more specific one wins,
// so the same money is never counted twice.
export const moreSpecificRules: Record<string, string[]> = {
  "balance-above-eob": ["insurance-not-applied", "out-of-network-surprise"],
};
