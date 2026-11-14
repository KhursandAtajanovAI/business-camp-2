import type { DocumentKind } from "@/contracts";
import { findEobFor } from "../matching/find-eob";
import { isBill, type Rule, type RuleFinding } from "./rule";

const HOSPITAL_KINDS: DocumentKind[] = ["hospital_bill_mother", "hospital_bill_baby"];
// For these services the No Surprises Act does not let an out-of-network provider
// at an in-network hospital ask the patient to give up the protection.
const ALWAYS_PROTECTED: DocumentKind[] = ["anesthesia_bill", "lab_bill"];

// Finds a bill from an out-of-network provider for care inside an in-network hospital.
// The money in question is what the bill asks above the in-network share shown on the EOB.
export const outOfNetworkSurprise: Rule = {
  id: "out-of-network-surprise",
  check(documents) {
    const bills = documents.filter(isBill);
    const hospitalIsInNetwork = bills.some((document) => HOSPITAL_KINDS.includes(document.kind) && document.network === "in_network");
    if (!hospitalIsInNetwork) return [];

    const findings: RuleFinding[] = [];
    for (const bill of bills) {
      if (bill.network !== "out_of_network" || HOSPITAL_KINDS.includes(bill.kind)) continue;
      const asked = bill.patientBalanceCents ?? bill.totalCents;
      const inNetworkShare = findEobFor(bill, documents)?.patientBalanceCents;
      const atStakeCents = inNetworkShare === undefined ? asked : asked - inNetworkShare;
      if (atStakeCents <= 0) continue;
      findings.push({
        documentId: bill.id,
        lineIds: bill.lines.map((line) => line.id),
        title: `${bill.provider} is out of network, but the hospital is in network`,
        atStakeCents,
        // Careful on purpose: sure only of the question, not of the answer.
        confidence: ALWAYS_PROTECTED.includes(bill.kind) && inNetworkShare !== undefined ? "likely" : "worth_asking",
      });
    }
    return findings;
  },
};
