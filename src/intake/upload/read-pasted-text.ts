import { messages } from "./messages";

// Pasted text only needs to be long enough and to contain at least one dollar amount.
export function readPastedText(text: string): string {
  const cleaned = text.replace(/\r\n?/g, "\n").trim();
  if (cleaned.length < 20) throw messages.tooShort;
  if (!/\d\.\d{2}\b/.test(cleaned)) throw messages.noAmounts;
  return cleaned;
}
