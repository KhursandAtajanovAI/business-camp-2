import type { ParsedDocument } from "@/contracts";
import { findIssuedOn, findKind, findNetwork, findPatientBalance, findPatientRole, findProvider, findTotal, isEob } from "./read-header";
import { readLines } from "./read-lines";
import { formatCents } from "./read-money";
import { IntakeError } from "../upload/messages";

export type ParseOptions = { isDemo?: boolean };

const noCharges = new IntakeError(
  "We could not find any charge lines in this paper.",
  "Check that the lines with amounts are included, for example: Room and board $2,400.00.",
);

// The same text always gets the same id, so uploading a paper twice does not create two.
function stableId(text: string): string {
  let hash = 5381;
  for (let index = 0; index < text.length; index += 1) hash = (hash * 33 + text.charCodeAt(index)) >>> 0;
  return `doc-${hash.toString(36)}`;
}

export function parseText(text: string, options: ParseOptions = {}): ParsedDocument {
  const rows = text.split("\n").map((row) => row.trim());
  const id = stableId(text);
  const eob = isEob(text);
  const { lines, unclear } = readLines(text, { documentId: id, isEob: eob });
  if (lines.length === 0) throw noCharges;

  // The header is everything above the first charge, where the paper introduces itself.
  const firstCharge = rows.findIndex((row) => row.includes(lines[0].description));
  const header = rows.slice(0, firstCharge === -1 ? 12 : firstCharge).join("\n");
  const kind = findKind(text, header);
  const lineSum = lines.reduce((sum, line) => sum + line.amountCents, 0);
  const statedTotal = findTotal(rows);
  const issuedOn = findIssuedOn(rows);

  const needsReview: string[] = unclear.map((row) => `We could not read this line, please check it: "${row}"`);
  if (statedTotal === null) needsReview.push("We did not find a total on the paper, so we added up the lines ourselves.");
  else if (statedTotal !== lineSum) {
    needsReview.push(`The lines add up to ${formatCents(lineSum)}, but the paper says the total is ${formatCents(statedTotal)}.`);
  }
  if (issuedOn === null) needsReview.push("We did not find a date on the paper.");

  return {
    id,
    kind,
    provider: findProvider(rows),
    patientRole: findPatientRole(kind, header),
    issuedOn: issuedOn ?? "",
    totalCents: statedTotal ?? lineSum,
    lines,
    isDemo: options.isDemo ?? /\bSAMPLE\b/.test(text),
    network: findNetwork(text),
    patientBalanceCents: findPatientBalance(rows, eob),
    ...(needsReview.length > 0 ? { needsReview } : {}),
  };
}
