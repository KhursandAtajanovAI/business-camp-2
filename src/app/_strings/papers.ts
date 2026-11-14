import type { Confidence, DocumentKind } from "@/contracts";

export const paperNames: Record<DocumentKind, string> = {
  hospital_bill_mother: "Hospital bill for the mother",
  hospital_bill_baby: "Hospital bill for the baby",
  anesthesia_bill: "Anesthesia bill",
  obstetrician_bill: "Obstetrician bill",
  lab_bill: "Lab bill",
  pediatrician_bill: "Pediatrician bill",
  insurance_eob: "Insurance EOB",
};

// How sure we are, in words. Color is never the only signal.
export const confidenceNames: Record<Confidence, string> = {
  sure: "We are quite sure",
  likely: "Looks likely",
  worth_asking: "Worth asking",
};
