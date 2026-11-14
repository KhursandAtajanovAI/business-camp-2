// Ready-made examples of every shared type. Use them while another stream is not ready.
import type { Analysis, CaseFile, LetterPackage, ParsedDocument } from "./index";

export const sampleDocument: ParsedDocument = {
  id: "doc-sample-1",
  kind: "hospital_bill_mother",
  provider: "Riverside Women's Hospital (Sample)",
  patientRole: "mother",
  issuedOn: "2026-03-20",
  totalCents: 1_245_000,
  isDemo: true,
  lines: [
    { id: "doc-sample-1-line-1", code: "0120", description: "Room and board, semi-private, 2 days", quantity: 2, amountCents: 480_000 },
    { id: "doc-sample-1-line-2", code: "59400", description: "Routine obstetric care with vaginal delivery", quantity: 1, amountCents: 620_000 },
    { id: "doc-sample-1-line-3", code: "85025", description: "Complete blood count", quantity: 1, amountCents: 72_500 },
    { id: "doc-sample-1-line-4", code: "85025", description: "Complete blood count", quantity: 1, amountCents: 72_500 },
  ],
};

export const sampleAnalysis: Analysis = {
  documents: [sampleDocument],
  findings: [
    {
      id: "finding-sample-1",
      ruleId: "duplicate-line",
      documentId: "doc-sample-1",
      lineIds: ["doc-sample-1-line-3", "doc-sample-1-line-4"],
      title: "The same blood test appears twice on the same day",
      atStakeCents: 72_500,
      confidence: "likely",
      sourceNote: "A service is normally billed once per date unless it was really done twice.",
    },
  ],
  totalAtStakeCents: 72_500,
  healthScore: 82,
};

export const sampleLetterPackage: LetterPackage = {
  letterPdfUrl: "data:application/pdf;base64,",
  callScript: "Hello, I am calling about my bill. I have a few questions about some of the charges.",
  escalationSteps: [
    { step: 1, text: "Call the billing office and ask for an itemized bill review." },
    { step: 2, text: "Send the letter and keep a copy." },
  ],
};

export const sampleCaseFile: CaseFile = {
  id: "case-sample-1",
  analysis: sampleAnalysis,
  claimedFindingIds: ["finding-sample-1"],
  deadlines: [{ label: "Check for a reply from the billing office", dueOn: "2026-04-20", done: false }],
  outcomes: [{ findingId: "finding-sample-1", status: "open" }],
};
