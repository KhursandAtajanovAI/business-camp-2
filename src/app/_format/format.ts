import type { DocumentKind } from "@/contracts";
import { paperNames } from "../_strings/papers";

// Money is kept in cents everywhere. On screen it is US dollars: $1,245.00.
export function formatMoney(cents: number): string {
  return (cents / 100).toLocaleString("en-US", { style: "currency", currency: "USD" });
}

// Dates on screen are written the US way: March 20, 2026.
export function formatDate(isoDate: string): string {
  const date = new Date(`${isoDate}T12:00:00`);
  if (!isoDate || Number.isNaN(date.getTime())) return "";
  return date.toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" });
}

export function paperName(kind: DocumentKind): string {
  return paperNames[kind];
}

// "1 paper", "3 papers".
export function countOf(count: number, [one, many]: readonly string[]): string {
  return `${count} ${count === 1 ? one : many}`;
}
