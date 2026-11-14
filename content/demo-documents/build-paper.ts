import type { PaperSpec } from "./types";

const usd = (cents: number) => `$${Math.floor(cents / 100).toLocaleString("en-US")}.${String(cents % 100).padStart(2, "0")}`;
const sum = (values: number[]) => values.reduce((total, value) => total + value, 0);

function header(spec: PaperSpec, isEob: boolean): string[] {
  return [
    "SAMPLE - synthetic document, not a real patient",
    spec.sender,
    spec.heading,
    `${isEob ? "Member" : "Patient"}: ${spec.patient}`,
    `Member ID: SMP${spec.date.replace(/\D/g, "")}`,
    ...(isEob ? [`Provider: ${spec.provider ?? ""}`, `Date processed: ${spec.date}`] : [`Statement date: ${spec.date}`]),
    ...(spec.network ? [`Network status: ${spec.network}`] : []),
    "",
  ];
}

// Lays out one paper as plain text, the way a statement or an EOB looks when pasted.
export function buildPaper(spec: PaperSpec): string {
  const isEob = spec.heading.startsWith("EXPLANATION");
  const rows = spec.lines.map((line) => {
    const start = `${line.date}  ${line.code.padEnd(6)} ${line.description.padEnd(46)} ${String(line.quantity).padEnd(4)}`;
    const amounts = isEob
      ? [line.billedCents, line.allowedCents ?? 0, line.planPaidCents ?? 0, line.owesCents ?? 0]
      : [line.billedCents];
    return `${start} ${amounts.map((cents) => usd(cents).padEnd(11)).join(" ")}`.trimEnd();
  });
  const total = sum(spec.lines.map((line) => line.billedCents));

  if (isEob) {
    const totals = [total, sum(spec.lines.map((line) => line.allowedCents ?? 0)), sum(spec.lines.map((line) => line.planPaidCents ?? 0)), sum(spec.lines.map((line) => line.owesCents ?? 0))];
    return [
      ...header(spec, true),
      "Date        Code   Description                                    Qty  Billed      Allowed     Plan paid   You owe",
      ...rows,
      "",
      `Total       ${totals.map((cents) => usd(cents).padEnd(11)).join(" ")}`.trimEnd(),
      "",
    ].join("\n");
  }

  const paid = spec.paidAndAdjustedCents ?? 0;
  return [
    ...header(spec, false),
    "Date        Code   Description                                    Qty  Amount",
    ...rows,
    "",
    `Total charges: ${usd(total)}`,
    `Insurance payments and adjustments: ${paid === 0 ? usd(0) : `-${usd(paid)}`}`,
    `Amount due: ${usd(spec.amountDueCents ?? total - paid)}`,
    "",
  ].join("\n");
}
