// Every rule the engine runs has one description here, with its source.
import { duplicateLine } from "./duplicate-line";
import { birthPackage } from "./birth-package";
import type { RuleDescription } from "./types";

export type { RuleDescription } from "./types";

const all: RuleDescription[] = [
  duplicateLine,
  birthPackage,
];

export const ruleDescriptions: Record<string, RuleDescription> = Object.fromEntries(all.map((rule) => [rule.id, rule]));
