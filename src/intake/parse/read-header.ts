import type { DocumentKind, ParsedDocument } from "@/contracts";
import { DATE_PATTERN, findFirstDate } from "./read-date";
import { findMoney } from "./read-money";

const NOT_A_PROVIDER = /sample|statement|explanation of benefits|itemized|invoice|^page\b/i;

export function findProvider(lines: string[]): string {
  const labelled = lines.map((line) => line.match(/^(?:provider|facility|hospital|billing provider)\s*:\s*(.+)$/i)).find(Boolean);
  if (labelled) return labelled[1].trim();
  return lines.find((line) => line !== "" && !NOT_A_PROVIDER.test(line) && !line.includes(":")) ?? "Unknown provider";
}

export function findIssuedOn(lines: string[]): string | null {
  const labelled = lines.find((line) => /^(statement date|date of statement|date issued|issue date|bill date|date processed|processed on|date)\s*:/i.test(line));
  if (labelled) return findFirstDate(labelled.slice(labelled.indexOf(":")));
  const anyDate = lines.find((line) => DATE_PATTERN.test(line) && !/birth|dob/i.test(line));
  return anyDate ? findFirstDate(anyDate) : null;
}

export function isEob(text: string): boolean {
  return /explanation of benefits|this is not a bill|\beob\b/i.test(text);
}

// The kind is decided from the top of the paper, so a "laboratory" charge line
// on a hospital bill does not turn the whole bill into a lab bill.
export function findKind(text: string, header: string): DocumentKind {
  if (isEob(text)) return "insurance_eob";
  if (/anesthesi/i.test(header)) return "anesthesia_bill";
  if (/pediatric/i.test(header)) return "pediatrician_bill";
  if (/laborator|pathology|diagnostics/i.test(header)) return "lab_bill";
  if (/newborn|nursery|\bbaby\b|infant/i.test(header)) return "hospital_bill_baby";
  if (/obstetric|ob-?gyn|midwi|physician/i.test(header)) return "obstetrician_bill";
  return "hospital_bill_mother";
}

export function findPatientRole(kind: DocumentKind, header: string): ParsedDocument["patientRole"] {
  if (kind === "hospital_bill_baby" || kind === "pediatrician_bill") return "baby";
  return /^(patient|member)\s*:.*\b(baby|newborn|infant)\b/im.test(header) ? "baby" : "mother";
}

export function findNetwork(text: string): ParsedDocument["network"] {
  if (/out[- ]of[- ]network/i.test(text)) return "out_of_network";
  if (/in[- ]network/i.test(text)) return "in_network";
  return undefined;
}

export function findTotal(lines: string[]): number | null {
  const row = lines.find((line) => /^(grand )?total\b/i.test(line) && findMoney(line).length > 0);
  return row ? findMoney(row)[0].cents : null;
}

export function findPatientBalance(lines: string[], eob: boolean): number | undefined {
  const row = lines.find((line) => /amount due|balance due|amount you owe|you owe|patient responsibility|your responsibility|pay this amount/i.test(line) && findMoney(line).length > 0);
  if (row) return findMoney(row).at(-1)?.cents;
  // An EOB total row ends with the "you owe" column.
  const total = eob ? lines.find((line) => /^total\b/i.test(line) && findMoney(line).length > 1) : undefined;
  return total ? findMoney(total).at(-1)?.cents : undefined;
}
