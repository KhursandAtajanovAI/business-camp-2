// Places in double curly braces are filled by src/letters/letter.
export const claimLetter = {
  title: "Request for review of charges",
  greeting: "To the Billing Department of {{provider}}:",
  opening:
    "I am writing about my statement dated {{issuedOn}}. I went through it line by line and I have questions about the charges listed below. Please review each one and send me a written answer.",
  openingNoDate:
    "I am writing about my recent statement. I went through it line by line and I have questions about the charges listed below. Please review each one and send me a written answer.",
  findingHeading: "{{number}}. {{title}}",
  findingAmount: "Amount in question: {{amount}}",
  findingLines: "Lines on the statement: {{lines}}",
  findingReason: "Why I am asking: {{reason}}",
  total: "Total amount in question: {{total}}",
  requestsIntro: "I kindly ask that you:",
  requests: [
    "Review these charges and correct any that were billed in error.",
    "Send me a corrected itemized statement.",
    "Keep my account on hold, and out of collections, while this review is open.",
    "Reply in writing within 30 days.",
  ],
  closing: "Thank you for your time and your help.",
  signature: [
    "Sincerely,",
    "Name: ________________________________",
    "Account number: ________________________",
    "Phone or email: ________________________",
    "Date: {{today}}",
  ],
};
