import type { Analysis } from "@/contracts";

// The whole shared report: four numbers and a sample mark. Nothing else ever leaves the device,
// so a shared link cannot carry a name, an address, a provider or a number from a paper.
export type SharedReport = { things: number; cents: number; papers: number; health: number; sample: boolean };

export function makeReport(analysis: Analysis): SharedReport {
  return {
    things: analysis.findings.length,
    cents: analysis.totalAtStakeCents,
    papers: analysis.documents.length,
    health: analysis.healthScore,
    sample: analysis.documents.some((document) => document.isDemo),
  };
}

export function reportPath(report: SharedReport): string {
  const query = new URLSearchParams({
    things: String(report.things),
    cents: String(report.cents),
    papers: String(report.papers),
    health: String(report.health),
    ...(report.sample ? { sample: "1" } : {}),
  });
  return `/share?${query}`;
}

type Query = Record<string, string | string[] | undefined>;

// Reads a report back from a link. Anything that is not a sensible whole number is refused,
// so nobody can put their own words on our page through the address.
export function readReport(query: Query): SharedReport | null {
  const whole = (name: string, max: number): number | null => {
    const value = query[name];
    if (typeof value !== "string" || !/^\d{1,9}$/.test(value)) return null;
    const number = Number(value);
    return number <= max ? number : null;
  };
  const things = whole("things", 500);
  const cents = whole("cents", 999_999_999);
  const papers = whole("papers", 200);
  const health = whole("health", 100);
  if (things === null || cents === null || papers === null || health === null) return null;
  return { things, cents, papers, health, sample: query.sample === "1" };
}
