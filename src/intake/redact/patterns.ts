// Each pattern keeps the label (group 1) and hides only the value after it.

const DATE = String.raw`(?:\d{1,2}\/\d{1,2}\/\d{2,4}|\d{4}-\d{2}-\d{2}|[A-Z][a-z]+\.? \d{1,2},? \d{4})`;
const STREET_WORD = "Street|St|Avenue|Ave|Road|Rd|Boulevard|Blvd|Lane|Ln|Drive|Dr|Court|Ct|Way|Place|Pl|Terrace|Circle";

export const labelledName =
  /^(\s*(?:patient name|patient|guarantor|subscriber|member name|member|insured|responsible party|mother|baby|newborn|name)\s*:\s*)([^\n]+?)(?=\s{2,}|$)/gim;

export const valuePatterns: { pattern: RegExp; marker: string }[] = [
  { pattern: new RegExp(String.raw`((?:dob|date of birth|birth ?date|born)\s*:?\s*)${DATE}`, "gi"), marker: "[hidden date]" },
  {
    pattern:
      /((?:policy|member id|subscriber id|group|account|acct|mrn|medical record|claim|patient id|insurance id|\bid)\s*(?:number|no\.?|num)?\s*(?:#\s*:?|:)\s*)[A-Z0-9][A-Z0-9-]{3,}/gi,
    marker: "[hidden number]",
  },
  { pattern: /()\b\d{3}-\d{2}-\d{4}\b/g, marker: "[hidden number]" },
  { pattern: /()[\w.+-]+@[\w-]+(?:\.[\w-]+)+/g, marker: "[hidden email]" },
  { pattern: /()\(?\b\d{3}\)?[-. ]?\d{3}[-.]\d{4}\b/g, marker: "[hidden phone]" },
  { pattern: /^(\s*(?:mailing |home |billing )?address\s*:\s*)[^\n]+$/gim, marker: "[hidden address]" },
  {
    pattern: new RegExp(
      String.raw`()\b\d{1,6}\s+(?:[A-Z][A-Za-z]*\.?\s+){1,4}(?:${STREET_WORD})\b\.?(?:,?\s*(?:Apt|Unit|Suite|Ste|#)\.?\s*[A-Za-z0-9-]+)?`,
      "g",
    ),
    marker: "[hidden address]",
  },
  { pattern: /()\b[A-Z][A-Za-z.]+(?:\s[A-Z][A-Za-z.]+)*,\s*[A-Z]{2}\s+\d{5}(?:-\d{4})?\b/g, marker: "[hidden address]" },
];
