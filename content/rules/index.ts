// Every rule the engine runs has one description here, with its source.
import { duplicateLine } from "./duplicate-line";
import { birthPackage } from "./birth-package";
import { balanceAboveEob } from "./balance-above-eob";
import { insuranceNotApplied } from "./insurance-not-applied";
import { motherBabyRepeat } from "./mother-baby-repeat";
import { outOfNetworkSurprise } from "./out-of-network-surprise";
import { priceAboveReference } from "./price-above-reference";
import { oncePerBirth } from "./once-per-birth";
import { totalMismatch } from "./total-mismatch";
import type { RuleDescription } from "./types";

export type { RuleDescription } from "./types";

const all: RuleDescription[] = [
  duplicateLine,
  birthPackage,
  balanceAboveEob,
  insuranceNotApplied,
  motherBabyRepeat,
  outOfNetworkSurprise,
  priceAboveReference,
  oncePerBirth,
  totalMismatch,
];

export const ruleDescriptions: Record<string, RuleDescription> = Object.fromEntries(all.map((rule) => [rule.id, rule]));
