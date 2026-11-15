import type { ParsedDocument } from "@/contracts";
import { editLine, type LineChange } from "@/intake";

export { centsFromInput as readDollars, type LineChange as LineEdit } from "@/intake";

// Returns the papers with one line corrected. The correction itself is done by src/intake
// (it also refreshes the "please double-check" notes); the paper's printed total is left as
// it is, so if the lines no longer add up to it, the check will notice.
export function correctLine(documents: ParsedDocument[], documentId: string, lineId: string, change: LineChange): ParsedDocument[] {
  return documents.map((document) => (document.id === documentId ? editLine(document, lineId, change) : document));
}
