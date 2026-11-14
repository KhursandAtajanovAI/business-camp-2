// Fixed phrases of the helper chat and a few one-sentence definitions.
export const helperText = {
  healthQuestion:
    "I can only help with the bills and insurance papers. For anything about your health or your baby's health, please ask your doctor or nurse.",
  noFindings: "I looked at your papers and did not find anything to ask about. If a new paper arrives, add it and I will check again.",
  total: "Across your papers, {{amount}} is in question in {{count}}. That is money worth asking about, not a promise of a refund.",
  oneFinding: "1 finding",
  manyFindings: "{{count}} findings",
  nextStep: "A good next step is to choose the findings you want to ask about and build the letter. The call script tells you what to say if you would rather phone the billing office.",
  listIntro: "Here is what I found in your papers:",
  fallback: "I can answer questions about your own papers: what was found, how much is in question, and what the words on a bill mean.",
  disclaimer: "This is not medical or legal advice.",
};

export const glossary: { words: RegExp; answer: string }[] = [
  { words: /\beob\b|explanation of benefits/i, answer: "An EOB (Explanation of Benefits) is a paper from your insurance plan. It shows what the provider billed, what the plan paid and what you owe. It is not a bill." },
  { words: /deductible/i, answer: "A deductible is the amount you pay for care each year before your insurance plan starts to pay." },
  { words: /co-?insurance/i, answer: "Coinsurance is your share of a covered service after the deductible, shown as a percent, for example 20%." },
  { words: /co-?pay/i, answer: "A copay is a fixed amount you pay for a covered service, for example $30 for a visit." },
  { words: /out[- ]of[- ]network/i, answer: "Out of network means the provider has no contract with your insurance plan, so the plan may pay less and the provider may bill you more." },
  { words: /in[- ]network/i, answer: "In network means the provider has a contract with your insurance plan and has agreed to its prices." },
  { words: /itemized/i, answer: "An itemized bill lists every service and its price on its own line. You can ask the billing office for one at any time." },
  { words: /allowed amount/i, answer: "The allowed amount is the most your insurance plan agrees to pay for a service. An in-network provider accepts it as the full price." },
];
