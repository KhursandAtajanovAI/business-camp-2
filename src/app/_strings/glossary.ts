// Hard words, each explained in one plain sentence. Any of these words is highlighted
// wherever it appears on the site, and a tap shows the sentence without leaving the page.
// "also" lists other ways the same word is written.
export type GlossaryTerm = { word: string; also?: string[]; meaning: string };

export const glossary: GlossaryTerm[] = [
  { word: "EOB", also: ["Explanation of Benefits"], meaning: "An Explanation of Benefits is a paper from your insurance that shows what was billed, what the plan paid and what you may owe, and it is not a bill." },
  { word: "deductible", meaning: "The amount you pay for care each year before your insurance starts to pay." },
  { word: "out-of-network", also: ["out of network"], meaning: "A doctor or hospital that has no contract with your insurance plan, so the plan usually pays less for them." },
  { word: "in-network", also: ["in network"], meaning: "A doctor or hospital that has a contract with your insurance plan and has agreed to its prices." },
  { word: "itemized bill", also: ["itemized statement"], meaning: "A bill that lists every single service and its price, line by line, instead of one total." },
  { word: "billing office", meaning: "The department of a hospital or clinic that prepares bills and answers questions about them." },
  { word: "billing code", also: ["billing codes"], meaning: "A short number or letter code that tells the insurance which service was provided." },
  { word: "copay", meaning: "A fixed amount you pay for a visit or a service, for example $30." },
  { word: "coinsurance", meaning: "Your share of a cost as a percent, for example 20% of the allowed amount." },
  { word: "allowed amount", meaning: "The most your insurance plan agrees a service should cost." },
  { word: "claim", meaning: "The request a hospital or doctor sends to your insurance asking it to pay for your care." },
  { word: "collections", meaning: "When an unpaid bill is handed to a company whose job is to collect the money." },
  { word: "appeal", meaning: "A written request asking your insurance to look again at a decision not to pay." },
  { word: "call script", meaning: "Ready words for a phone call: what to say, what to write down and what to ask." },
];

export const hintWords = { open: "What does this mean", close: "Got it" };
