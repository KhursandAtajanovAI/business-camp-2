import type { RuleDescription } from "./types";

export const stayNotCovered: RuleDescription = {
  id: "stay-not-covered",
  name: "Hospital day after the birth that the plan did not cover",
  summary:
    "The insurance explanation shows a hospital day in the first two days after a vaginal birth, or the first four after a cesarean birth, for which the plan allowed and paid nothing.",
  explanation:
    "Your insurance explanation shows a hospital day right after the birth that the plan did not cover at all. A federal law says most plans may not limit a hospital stay for childbirth to less than 48 hours, or 96 hours after a cesarean birth. It is worth asking your plan why this day was not covered; the amount in question is {{amount}}.",
  sourceName: "CMS, Newborns' and Mothers' Health Protection Act (NMHPA)",
  sourceUrl: "https://www.cms.gov/cciio/programs-and-initiatives/other-insurance-protections/nmhpa_factsheet",
  sourceSays:
    "Plans subject to the law \"may NOT restrict benefits for a hospital stay in connection with childbirth to less than 48 hours following a vaginal delivery or 96 hours following a delivery by cesarean section\". The attending provider may still discharge earlier, and in some states a similar state law applies instead.",
  sourceCheck: "confirmed",
  checkedOn: "2026-11-15",
  confidenceNote:
    "Worth asking. A paper shows days, not hours, so two and four days are our approximation; the day may also be refused for a reason the law allows, and some plans follow a state law instead.",
};
