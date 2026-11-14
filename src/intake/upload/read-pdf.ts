import { extractText, getDocumentProxy } from "unpdf";
import { messages } from "./messages";

// Reads the text layer of a PDF. A scanned page has no text layer, so we say so kindly.
export async function readPdf(bytes: Uint8Array): Promise<string> {
  let text = "";
  try {
    const pdf = await getDocumentProxy(bytes);
    const result = await extractText(pdf, { mergePages: true });
    text = result.text;
  } catch {
    throw messages.scannedPdf;
  }
  if (text.replace(/\s/g, "").length < 20) throw messages.scannedPdf;
  return text;
}
