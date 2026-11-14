// The only file other modules import from intake.
import type { ParsedDocument } from "@/contracts";
import { parseText, type ParseOptions } from "./parse/parse-text";
import { readPastedText } from "./upload/read-pasted-text";
import { readUpload } from "./upload/read-upload";

export { redactPersonalData } from "./redact/redact";
export { ACCEPTED_FILE_TYPES, MAX_FILE_BYTES } from "./upload/check-file";
export { IntakeError } from "./upload/messages";

// A file (photo, PDF, text file) or pasted text becomes one ParsedDocument.
// Problems come back as an IntakeError with a kind message and a next step.
//
// Privacy: reading and parsing run as ordinary code and never call a language model.
// A ParsedDocument has no name, address or policy number in it. Any free text that
// is sent to a model must go through redactPersonalData first.
export async function parseDocument(input: File | string, options: ParseOptions = {}): Promise<ParsedDocument> {
  const text = typeof input === "string" ? readPastedText(input) : readPastedText(await readUpload(input));
  return parseText(text, options);
}
