// STUB words for the temporary checks in src/app/_pipeline/stub-findings.ts.
// The real titles and explanations come from Adilet (content/rules, src/explain).
export const stubText = {
  repeatTitle: (description: string) => `"${description}" appears twice on the same day`,
  repeatSource: "A service is normally billed once per date unless it was really done twice.",
  totalTitle: "The total is higher than the lines add up to",
  totalSource: "The total of an itemized bill should equal the sum of its lines.",
};
