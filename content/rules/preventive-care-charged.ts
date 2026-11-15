import type { RuleDescription } from "./types";

export const preventiveCareCharged: RuleDescription = {
  id: "preventive-care-charged",
  name: "Preventive care that left a charge for the family",
  summary:
    "A well-baby visit or breastfeeding support from an in-network provider still left money for the family to pay.",
  explanation:
    "This looks like preventive care, such as a well-baby visit or breastfeeding support. Most health plans must cover such care at no cost to you when the provider is in network, but some older plans are exempt. It is worth asking your plan why you were charged; the amount in question is {{amount}}.",
  sourceName: "HealthCare.gov, Preventive care benefits for children, and HealthCare.gov, Breastfeeding benefits",
  sourceUrl: "https://www.healthcare.gov/preventive-care-children/",
  sourceSays:
    "\"Most health plans must cover a set of preventive health services for children at no cost\", including \"well-baby and well-child visits\", when the provider is in network; \"$0 cost isn't guaranteed in all cases\". The breastfeeding page (healthcare.gov/coverage/breast-feeding-benefits) says plans must provide breastfeeding support, counseling and equipment, \"except for grandfathered plans\".",
  sourceCheck: "confirmed",
  checkedOn: "2026-11-15",
  confidenceNote:
    "Worth asking. The source itself says a zero cost is not guaranteed in every case, older (grandfathered) plans are exempt, and we recognise the care by the words on the paper, not by a verified code list.",
};
