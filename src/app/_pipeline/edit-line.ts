import type { LineItem, ParsedDocument } from "@/contracts";

// What a person may correct on a line we read from their paper.
export type LineEdit = Partial<Pick<LineItem, "description" | "quantity" | "amountCents">>;

// "$1,234.50", "1234.5" or "1 234" become cents. Anything that is not an amount gives null.
export function readDollars(text: string): number | null {
  const clean = text.replace(/[$,\s]/g, "");
  if (!/^\d{1,7}(\.\d{1,2})?$/.test(clean)) return null;
  return Math.round(Number(clean) * 100);
}

// Returns the papers with one line corrected. The paper's printed total is left as it is:
// if the lines no longer add up to it, that is exactly what the check should notice.
export function editLine(documents: ParsedDocument[], documentId: string, lineId: string, edit: LineEdit): ParsedDocument[] {
  return documents.map((document) =>
    document.id !== documentId
      ? document
      : { ...document, lines: document.lines.map((line) => (line.id === lineId ? { ...line, ...edit } : line)) },
  );
}
