// Shared data types for all three work streams (spec section "Contracts").
// Owner: Khursand. Change only when all three agree. Money is always in cents.

export type DocumentKind =
  | "hospital_bill_mother" | "hospital_bill_baby" | "anesthesia_bill"
  | "obstetrician_bill" | "lab_bill" | "pediatrician_bill" | "insurance_eob";

export type LineItem = {
  id: string;
  code?: string; // billing code, e.g. "59400"
  description: string;
  quantity: number;
  amountCents: number; // what the document charges for this line
  // Optional extras, filled only when the paper shows them (mostly on an EOB).
  serviceDate?: string; // ISO date
  allowedCents?: number; // amount the insurance plan allows
  planPaidCents?: number; // amount the insurance plan paid
  patientOwesCents?: number; // amount the paper says the family owes for this line
};

// Output of src/intake. One uploaded paper becomes one of these.
export type ParsedDocument = {
  id: string;
  kind: DocumentKind;
  provider: string; // hospital / clinic name
  patientRole: "mother" | "baby";
  issuedOn: string; // ISO date
  totalCents: number;
  lines: LineItem[];
  isDemo: boolean; // true for sample documents
  // Optional extras.
  network?: "in_network" | "out_of_network"; // only when the paper says so
  patientBalanceCents?: number; // "amount you owe" printed on the paper
  needsReview?: string[]; // things a person should double-check, in plain English
};

export type Confidence = "sure" | "likely" | "worth_asking";

// Output of src/engine. One problem found on one or more lines.
export type Finding = {
  id: string;
  ruleId: string; // which rule found it, see content/rules
  documentId: string;
  lineIds: string[];
  title: string; // short, plain English
  atStakeCents: number; // money in question, not a promise of refund
  confidence: Confidence;
  sourceNote: string; // where the rule comes from
};

export type Analysis = {
  documents: ParsedDocument[];
  findings: Finding[];
  totalAtStakeCents: number;
  healthScore: number; // 0..100
};

// Output of src/letters.
export type LetterPackage = {
  letterPdfUrl: string;
  callScript: string;
  escalationSteps: { step: number; text: string }[];
};

// Kept by src/case-file.
export type CaseFile = {
  id: string;
  analysis: Analysis;
  claimedFindingIds: string[];
  deadlines: { label: string; dueOn: string; done: boolean }[];
  outcomes: { findingId: string; status: "open" | "won" | "lost"; savedCents?: number }[];
};

export type Plan = "one_time_29" | "monthly_14_99";
