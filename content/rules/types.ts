// One description per rule. The engine takes the source from here, so the product
// and the documentation can never disagree about where a rule comes from.
export type RuleDescription = {
  id: string;
  name: string;
  summary: string; // what the rule looks for, in plain English
  explanation: string; // up to three short sentences shown for a finding; {{amount}} is filled by code
  sourceName: string;
  sourceUrl: string;
  confidenceNote: string; // why findings of this rule get the confidence they get
};
