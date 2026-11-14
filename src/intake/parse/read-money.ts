// Money is kept in whole cents so sums never drift by a rounding error.

const MONEY = /-?\(?\$?\s?(?:\d{1,3}(?:,\d{3})+|\d+)\.\d{2}\)?/g;

export type MoneyMatch = { cents: number; index: number };

export function toCents(raw: string): number {
  const negative = raw.includes("-") || (raw.includes("(") && raw.includes(")"));
  const digits = raw.replace(/[^\d.]/g, "");
  const [dollars, cents = "0"] = digits.split(".");
  const value = Number(dollars) * 100 + Number(cents.padEnd(2, "0").slice(0, 2));
  return negative ? -value : value;
}

export function findMoney(line: string): MoneyMatch[] {
  return [...line.matchAll(MONEY)].map((match) => ({ cents: toCents(match[0]), index: match.index ?? 0 }));
}

export function formatCents(cents: number): string {
  const sign = cents < 0 ? "-" : "";
  const dollars = Math.floor(Math.abs(cents) / 100).toLocaleString("en-US");
  const rest = String(Math.abs(cents) % 100).padStart(2, "0");
  return `${sign}$${dollars}.${rest}`;
}
