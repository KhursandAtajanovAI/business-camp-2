// The list of rules the engine runs, in the order their findings are shown.
import { duplicateLine } from "../rules/duplicate-line";
import { birthPackage } from "../rules/birth-package";
import { balanceAboveEob } from "../matching/balance-above-eob";
import { insuranceNotApplied } from "../matching/insurance-not-applied";
import { motherBabyRepeat } from "../matching/mother-baby-repeat";
import { outOfNetworkSurprise } from "../rules/out-of-network-surprise";
import { priceAboveReference } from "../rules/price-above-reference";
import { oncePerBirth } from "../rules/once-per-birth";
import { totalMismatch } from "../rules/total-mismatch";
import { preventiveCareCharged } from "../matching/preventive-care-charged";
import { stayNotCovered } from "../matching/stay-not-covered";
import type { Rule } from "../rules/rule";

export const allRules: Rule[] = [
  duplicateLine,
  birthPackage,
  balanceAboveEob,
  insuranceNotApplied,
  motherBabyRepeat,
  outOfNetworkSurprise,
  priceAboveReference,
  oncePerBirth,
  totalMismatch,
  preventiveCareCharged,
  stayNotCovered,
];

// When two rules explain the same gap on the same paper, the more specific one wins,
// so the same money is never counted twice.
export const moreSpecificRules: Record<string, string[]> = {
  "balance-above-eob": ["insurance-not-applied", "out-of-network-surprise"],
  // A bill printed before the insurance payment is in question as a whole already,
  // and the plan's own price will replace the list price once the payment is applied.
  "price-above-reference": ["insurance-not-applied"],
};
