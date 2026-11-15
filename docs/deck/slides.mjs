// The words of the deck. One message per slide. A source under every number.
const REPO = "github.com/KhursandAtajanovAI/business-cup-2";
const KFF = "Peterson-KFF Health System Tracker, 2025 (kff.org)";
const CWF = "Commonwealth Fund, Unforeseen Health Care Bills and Coverage Denials, 2024";

export const slides = [
  {
    title: "Birth Bill Check",
    lead: "Your birth bills, checked. We find billing mistakes and write the letter for you.",
    bullets: ["For new parents in the US, in the first six months after the birth.", "Working name. Team: Khursand, Adilet, Dias.", `Repository: ${REPO}`, "Live: business-cup-2-tau.vercel.app. No sign-up needed."],
  },
  {
    title: "Maya had a baby in March. By May she has nine papers.",
    lead: "She is tired, the papers use codes, and nobody tells her which ones are right.",
    bullets: [
      "One birth, many papers: hospital for the mother, hospital for the baby, anesthesiologist, obstetrician, lab, pediatrician, plus an insurance explanation for each.",
      "$2,743: average out-of-pocket cost of pregnancy, birth and care after it with an employer plan. The newborn adds $475.",
      "45% of insured working-age adults got a bill they thought insurance should have paid. Fewer than half of people who see an error challenge it.",
      "3.63 million births in the US in 2024.",
    ],
    sources: `Sources: ${KFF}; ${CWF}; CDC NCHS Data Brief 535 (2025).`,
  },
  {
    title: "Upload a bill, see what is worth asking, send a ready letter",
    bullets: ["1. Upload a photo or PDF, paste the text, or try a sample.", "2. Rules check every line and compare the bill with the insurance explanation.", "3. See the money in question and a plain-English reason for each finding.", "4. Get a claim letter as a PDF and a call script."],
    screenshots: ["Upload", "Results", "Letter"],
  },
  {
    title: "Code does the math. The model only explains.",
    lead: "A real product, not a chat wrapper.",
    bullets: [
      "11 rules written in code, each with a public source and a confidence level: sure, likely, worth asking.",
      "360 automated tests. On five sample sets the engine finds exactly the planted mistakes.",
      "Sample bills run through the same pipeline as real uploads.",
      "A live model explains the findings on the person's own bill; code checks every amount it writes.",
      "Names, addresses and policy numbers are hidden before any text reaches a model.",
      "We say \"money in question\", never \"we will get your money back\". No medical or legal advice.",
    ],
    sources: "Sources: rule sources in content/rules (CMS NCCI Policy Manual 2026, Ch. VII; No Surprises Act, cms.gov); test count from the repository.",
  },
  {
    title: "A birth is not one bill. It is half a year of papers.",
    lead: "That is why parents come back.",
    bullets: ["Case file: every paper of one family in one place, kept after a reload.", "Gentle reminders on the site and as a calendar file. No countdowns.", "Outcome loop: mark a claim as won or lost and see what the family saved.", "Next steps after a refusal, and an appeal letter after an insurance denial."],
    screenshots: ["Case file"],
  },
  {
    title: "The check is free. People pay for the action.",
    bullets: ["$29 once, or $14.99 a month while the case is open. Cancel in one click.", "The paywall sits in front of the letter and the call script.", "Checkout runs on Stripe in test mode in the demo.", "Competitors take a share of the savings: Goodbill 20%, others 10% to 40%.", "On a $500 correction a 20% fee is $100. Our one-time plan is $29."],
    screenshots: ["Pricing"],
    sources: "Sources: goodbill.com/faq; careroute.ai/bill-defense/medical-bill-negotiation-cost.",
  },
  {
    title: "One paying family is worth about $32",
    table: [
      ["Number", "Value", "Source"],
      ["Free to paid, freemium apps (median)", "2.1%", "RevenueCat 2026"],
      ["Free to paid, hard paywall (median)", "10.7%", "RevenueCat 2026"],
      ["Our base case, free check to paid", "3%", "estimate"],
      ["Revenue per paying family (70% once, 30% monthly x 3)", "$33.79", "estimate"],
      ["After card fee and hosting", "about $32", "Stripe pricing; estimate"],
      ["Affordable CAC per paying family at 3 to 1", "$10.70", "estimate"],
    ],
    bullets: ["At about $0.32 per visitor paid ads do not work: we grow through parent referrals, doulas, birth classes and search."],
    sources: "Sources: RevenueCat State of Subscription Apps 2026; stripe.com/pricing; details in docs/economics/unit-economics.md.",
  },
  {
    title: "Narrow on purpose: one life event, done properly",
    table: [["", "General bill tools", "Human advocates", "Birth Bill Check"], ["Focus", "any bill", "any bill", "birth: mother and baby together"], ["How", "a chat answer", "a person, weeks", "rules with sources, minutes"], ["Price", "varies", "share of savings", "$29 flat"]],
    bullets: ["Not a copy of Finelo, Coursiv or Subpilot: no courses, no subscription tracker.", "Micro-lessons and a detective game live inside the product, on the family's own case.", "A connector lets ChatGPT and Claude read a bill review."],
  },
  {
    title: "After the birth: the first year, then the next child",
    lead: "A plan, not a product yet. Prices are our assumptions.",
    bullets: ["First year: insurance follow-ups, adding the baby to the plan, well-baby visit bills.", "Family plan: $6.99 a month or $59 a year after the case closes; a free pause instead of cancelling.", "Give a month, get a month: referrals between parents.", "Data: licensed code tables to add more rules (see docs/economics/data-license.md).", "B2B, such as employers and doulas, only as a later channel. The payer stays the parent."],
  },
  {
    title: "Try it now, no sign-up",
    lead: "38% of people who challenged a medical bill had it reduced or removed.",
    bullets: ["Live: business-cup-2-tau.vercel.app", `Repository with stage-by-stage history: ${REPO}`, "Open it, press \"try a sample\", get the review, the letter and a test payment in three minutes.", "Not medical or legal advice."],
    sources: `Source: ${CWF}.`,
  },
];
