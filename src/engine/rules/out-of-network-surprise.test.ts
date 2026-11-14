import { expect, test } from "vitest";
import type { ParsedDocument } from "@/contracts";
import { sampleDocument } from "@/contracts/stubs";
import { outOfNetworkSurprise } from "./out-of-network-surprise";

const line = (id: string, code: string, amountCents: number, quantity = 1) => ({ id, code, description: "Service", quantity, amountCents });
const doc = (extra: Partial<ParsedDocument>): ParsedDocument => ({ ...sampleDocument, ...extra });

const hospital = doc({ id: "hospital", network: "in_network" });
const anesthesia = doc({ id: "anesthesia", kind: "anesthesia_bill", provider: "Lakeshore Anesthesia", network: "out_of_network", lines: [line("a1", "01967", 240_000)], totalCents: 240_000, patientBalanceCents: 180_000 });
const anesthesiaEob = doc({ id: "eob", kind: "insurance_eob", provider: "Lakeshore Anesthesia", network: "out_of_network", patientBalanceCents: 22_000 });

test("finds an out-of-network anesthesia bill inside an in-network hospital", () => {
  expect(outOfNetworkSurprise.check([hospital, anesthesia, anesthesiaEob])).toEqual([
    { documentId: "anesthesia", lineIds: ["a1"], title: "Lakeshore Anesthesia is out of network, but the hospital is in network", atStakeCents: 158_000, confidence: "likely" },
  ]);
});

test("is careful when there is no EOB or the provider is not an always-protected kind", () => {
  expect(outOfNetworkSurprise.check([hospital, anesthesia])[0]).toMatchObject({ atStakeCents: 180_000, confidence: "worth_asking" });
  const obstetrician = { ...anesthesia, kind: "obstetrician_bill" as const };
  expect(outOfNetworkSurprise.check([hospital, obstetrician, anesthesiaEob])[0].confidence).toBe("worth_asking");
});

test("stays silent when the hospital is not in network or the provider is in network", () => {
  expect(outOfNetworkSurprise.check([doc({ id: "hospital" }), anesthesia])).toEqual([]);
  expect(outOfNetworkSurprise.check([hospital, { ...anesthesia, network: "in_network" }])).toEqual([]);
});
