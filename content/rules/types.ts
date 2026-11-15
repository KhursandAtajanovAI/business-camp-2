// One description per rule. The engine takes the source from here, so the product
// and the documentation can never disagree about where a rule comes from.

// confirmed: the official source states what the rule checks.
// data_only: the source gives official numbers, but the threshold is our own.
// not_confirmed: no official source states it. The engine then never says more than "worth asking".
export type SourceCheck = "confirmed" | "data_only" | "not_confirmed";

export type RuleDescription = {
  id: string;
  name: string;
  summary: string; // what the rule looks for, in plain English
  explanation: string; // up to three short sentences shown for a finding; {{amount}} is filled by code
  sourceName: string;
  sourceUrl: string;
  sourceSays: string; // what we read in the source, with short quotes
  sourceCheck: SourceCheck;
  checkedOn: string; // ISO date when a person last opened the source and compared it with the rule
  confidenceNote: string; // why findings of this rule get the confidence they get
};
