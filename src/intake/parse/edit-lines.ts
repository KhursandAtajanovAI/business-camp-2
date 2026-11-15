import type { LineItem, ParsedDocument } from "@/contracts";
import { formatCents } from "./read-money";

export type LineChange = Partial<Pick<LineItem, "code" | "description" | "quantity" | "amountCents">>;

const MISMATCH = /^The lines add up to /;

// After any edit the "please double-check" notes are brought up to date:
// the note about the total stays only while the lines still do not add up.
function withFreshNotes(document: ParsedDocument, lines: LineItem[]): ParsedDocument {
  const lineSum = lines.reduce((sum, line) => sum + line.amountCents, 0);
  const notes = (document.needsReview ?? []).filter((note) => !MISMATCH.test(note));
  if (lineSum !== document.totalCents) {
    notes.push(`The lines add up to ${formatCents(lineSum)}, but the paper says the total is ${formatCents(document.totalCents)}.`);
  }
  const { needsReview: _old, ...rest } = document;
  return { ...rest, lines, ...(notes.length > 0 ? { needsReview: notes } : {}) };
}

function clean(change: LineChange): LineChange {
  const result: LineChange = {};
  if (change.description !== undefined && change.description.trim() !== "") result.description = change.description.trim();
  if (change.code !== undefined) result.code = change.code.trim() || undefined;
  if (change.quantity !== undefined && Number.isInteger(change.quantity) && change.quantity >= 1) result.quantity = change.quantity;
  if (change.amountCents !== undefined && Number.isInteger(change.amountCents) && change.amountCents >= 0) result.amountCents = change.amountCents;
  return result;
}

// The person corrects what we read from a photo. Values that make no sense are ignored.
// The paper's printed total is left alone: it is what the paper says.
export function editLine(document: ParsedDocument, lineId: string, change: LineChange): ParsedDocument {
  const fixed = clean(change);
  return withFreshNotes(document, document.lines.map((line) => (line.id === lineId ? { ...line, ...fixed } : line)));
}

export function removeLine(document: ParsedDocument, lineId: string): ParsedDocument {
  return withFreshNotes(document, document.lines.filter((line) => line.id !== lineId));
}

// "72.50", "$1,200" or "1200.5" typed by a person becomes whole cents; nonsense gives null.
export function centsFromInput(text: string): number | null {
  const cleaned = text.replace(/[$,\s]/g, "");
  if (!/^\d+(\.\d{1,2})?$/.test(cleaned)) return null;
  const [dollars, cents = ""] = cleaned.split(".");
  return Number(dollars) * 100 + Number(cents.padEnd(2, "0"));
}
