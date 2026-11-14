// Dates are plain ISO days (YYYY-MM-DD) so time zones cannot move a deadline.

export function todayIso(now: Date = new Date()): string {
  return now.toISOString().slice(0, 10);
}

export function addDays(isoDay: string, days: number): string {
  const date = new Date(`${isoDay}T00:00:00Z`);
  date.setUTCDate(date.getUTCDate() + days);
  return date.toISOString().slice(0, 10);
}

export function daysBetween(fromIsoDay: string, toIsoDay: string): number {
  const from = Date.parse(`${fromIsoDay}T00:00:00Z`);
  const to = Date.parse(`${toIsoDay}T00:00:00Z`);
  return Math.round((to - from) / 86_400_000);
}

export function isIsoDay(value: string): boolean {
  return /^\d{4}-\d{2}-\d{2}$/.test(value) && !Number.isNaN(Date.parse(`${value}T00:00:00Z`));
}
