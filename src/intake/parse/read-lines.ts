import type { LineItem } from "@/contracts";
import { DATE_PATTERN, parseUsDate } from "./read-date";
import { findMoney } from "./read-money";

// Rows that sum things up are not charges, so they must not become line items.
const SUMMARY_ROW =
  /^(sub)?total|^grand total|^balance|^amount|^payments?|^adjustments?|^insurance|^you (owe|may owe)|^patient (responsibility|balance)|^plan paid|^previous|^please pay|^deductible|^co-?pay|^coinsurance|^your (responsibility|share|plan)/i;
const BILLING_CODE = /^(?:\d{5}|[A-Z]\d{4}|\d{4})$/;

export type ReadLinesResult = { lines: LineItem[]; unclear: string[] };

type Options = { documentId: string; isEob: boolean; hasQuantityColumn: boolean };

function eobColumns(amounts: number[]): Partial<LineItem> {
  if (amounts.length >= 4) return { allowedCents: amounts[1], planPaidCents: amounts[2], patientOwesCents: amounts[amounts.length - 1] };
  if (amounts.length === 3) return { planPaidCents: amounts[1], patientOwesCents: amounts[2] };
  if (amounts.length === 2) return { patientOwesCents: amounts[1] };
  return {};
}

function readOneLine(raw: string, options: Options, number: number): LineItem | "skip" | "unclear" {
  const amounts = findMoney(raw);
  if (amounts.length === 0) return /\$\s?\d/.test(raw) ? "unclear" : "skip";
  const words = raw.slice(0, amounts[0].index).trim().split(/\s+/).filter(Boolean);
  if (words.length === 0 || SUMMARY_ROW.test(words.join(" "))) return "skip";

  const item: LineItem = { id: `${options.documentId}-line-${number}`, description: "", quantity: 1, amountCents: 0 };
  if (DATE_PATTERN.test(words[0])) item.serviceDate = parseUsDate(words.shift() as string) ?? undefined;
  if (words[0] && BILLING_CODE.test(words[0])) item.code = words.shift();
  const last = words[words.length - 1];
  if (options.hasQuantityColumn && last && /^\d{1,3}$/.test(last)) item.quantity = Number(words.pop());
  item.description = words.join(" ");
  if (item.description === "") return "unclear";

  const cents = amounts.map((amount) => amount.cents);
  // On a bill the last amount is the line total; on an EOB the first is what was billed.
  item.amountCents = options.isEob ? cents[0] : cents[cents.length - 1];
  return options.isEob ? { ...item, ...eobColumns(cents) } : item;
}

export function readLines(text: string, options: Omit<Options, "hasQuantityColumn">): ReadLinesResult {
  const hasQuantityColumn = /\b(qty|quantity|units)\b/i.test(text);
  const lines: LineItem[] = [];
  const unclear: string[] = [];
  for (const raw of text.split("\n")) {
    const result = readOneLine(raw.trim(), { ...options, hasQuantityColumn }, lines.length + 1);
    if (result === "unclear") unclear.push(raw.trim());
    else if (result !== "skip") lines.push(result);
  }
  return { lines, unclear };
}
