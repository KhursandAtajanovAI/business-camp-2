// Reads the date formats that US bills use and returns an ISO date (YYYY-MM-DD).

const MONTHS = ["january", "february", "march", "april", "may", "june", "july", "august", "september", "october", "november", "december"];

export const DATE_PATTERN =
  /\b(?:\d{1,2}\/\d{1,2}\/\d{2,4}|\d{4}-\d{2}-\d{2}|(?:Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)[a-z]*\.? \d{1,2},? \d{4})\b/i;

function iso(year: number, month: number, day: number): string | null {
  if (month < 1 || month > 12 || day < 1 || day > 31) return null;
  return `${year}-${String(month).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
}

export function parseUsDate(raw: string): string | null {
  const text = raw.trim();
  const slash = text.match(/^(\d{1,2})\/(\d{1,2})\/(\d{2,4})$/);
  if (slash) {
    const year = slash[3].length === 2 ? 2000 + Number(slash[3]) : Number(slash[3]);
    return iso(year, Number(slash[1]), Number(slash[2]));
  }
  const dashed = text.match(/^(\d{4})-(\d{2})-(\d{2})$/);
  if (dashed) return iso(Number(dashed[1]), Number(dashed[2]), Number(dashed[3]));
  const words = text.match(/^([A-Za-z]+)\.? (\d{1,2}),? (\d{4})$/);
  if (words) {
    const month = MONTHS.findIndex((name) => name.startsWith(words[1].toLowerCase().slice(0, 3))) + 1;
    return iso(Number(words[3]), month, Number(words[2]));
  }
  return null;
}

export function findFirstDate(text: string): string | null {
  const match = text.match(DATE_PATTERN);
  return match ? parseUsDate(match[0]) : null;
}
