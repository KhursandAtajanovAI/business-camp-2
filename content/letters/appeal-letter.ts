// An appeal asks the insurance plan to look again at a claim it did not pay.
// Places in double curly braces are filled by src/letters/appeal.
export const appealLetter = {
  title: "Request for reconsideration of a claim (appeal)",
  greeting: "To the Appeals Department of my health plan:",
  planBlanks: ["Health plan name: ________________________", "Member ID: ________________________", "Claim number: ________________________"],
  opening:
    "I am writing to ask you to look again at the claim for services from {{provider}}. Your explanation of benefits dated {{issuedOn}} shows that the plan did not pay for the services listed below.",
  openingNoDate:
    "I am writing to ask you to look again at the claim for services from {{provider}}. Your explanation of benefits shows that the plan did not pay for the services listed below.",
  linesHeading: "Services the plan did not pay for",
  line: "{{description}}: billed {{billed}}, plan paid {{paid}}",
  total: "Total billed for these services: {{total}}",
  findingsHeading: "Questions I have already raised with the provider",
  requestsIntro: "I kindly ask that you:",
  requests: [
    "Review this claim again and tell me the decision in writing.",
    "Tell me the specific reason for the decision and the part of my plan it is based on.",
    "Send me a copy of the documents used to make the decision.",
    "Tell me what my next options are if the decision stays the same.",
  ],
  closing: "Thank you for your time and your help.",
  signature: ["Sincerely,", "Name: ________________________________", "Phone or email: ________________________", "Date: {{today}}"],
  noEob: "There is no insurance explanation (EOB) in your case file yet.",
  noEobNextStep: "Add the EOB that shows what the plan did not pay, then build the appeal again.",
  nothingDenied: "The insurance explanation in your case file does not show an unpaid service.",
  nothingDeniedNextStep: "An appeal fits when the plan paid nothing for a service. Check the EOB that came with the denial and add it.",
};
