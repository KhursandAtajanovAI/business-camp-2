const MONTHS = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

export function formatMoney(cents: number): string {
  const dollars = Math.floor(Math.abs(cents) / 100).toLocaleString("en-US");
  const rest = String(Math.abs(cents) % 100).padStart(2, "0");
  return `${cents < 0 ? "-" : ""}$${dollars}.${rest}`;
}

// "2026-03-20" becomes "March 20, 2026". An empty or odd date gives an empty string.
export function formatDate(isoDate: string): string {
  const match = isoDate.match(/^(\d{4})-(\d{2})-(\d{2})/);
  if (!match) return "";
  return `${MONTHS[Number(match[2]) - 1]} ${Number(match[3])}, ${match[1]}`;
}

export function todayIso(now: Date = new Date()): string {
  return now.toISOString().slice(0, 10);
}
