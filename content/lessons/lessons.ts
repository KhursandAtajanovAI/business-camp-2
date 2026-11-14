// Micro-lessons: about one minute of reading each. Places in double curly braces are filled
// from the person's own papers by src/app/lessons, so every lesson uses their own example.
// Plain facts about how bills are built only. No medical or legal advice.
export type Lesson = { id: string; title: string; body: string[]; takeaway: string };

export const lessons: Lesson[] = [
  {
    id: "read-a-line",
    title: "How to read an itemized bill",
    body: [
      "An itemized bill lists every service on its own line. Each line usually has four parts: a date, a billing code, a short description and an amount.",
      "Here is a line from {{whose}} paper from {{provider}}: \"{{lineDescription}}\", quantity {{lineQuantity}}, {{lineAmount}}. {{lineCodeNote}}",
      "You do not need to understand every code. It is enough to read down the descriptions and notice anything you do not recognize, or anything that appears more than once. This paper has {{lineCount}}, so that takes about a minute.",
    ],
    takeaway: "If a bill shows only one total, you can ask the billing office for an itemized bill.",
  },
  {
    id: "check-the-total",
    title: "Why the total matters",
    body: [
      "A bill ends with a total. It should be exactly the sum of the lines above it. That sounds obvious, yet the lines and the total are often prepared at different moments, and they can drift apart.",
      "On {{whose}} paper the lines add up to {{lineSum}}, and the total printed on the paper is {{total}}. {{totalVerdict}}",
      "The amount you are asked to pay is usually smaller than the total, because insurance payments and adjustments come off first. So there are two numbers worth finding on any bill: the total of all charges, and the amount due from you.",
    ],
    takeaway: "Adding up the lines is the simplest check there is, and we do it for every paper.",
  },
  {
    id: "bill-and-eob",
    title: "A bill and an EOB are two different papers",
    body: [
      "After a birth, papers come from two places. The hospital or the doctor sends a bill. Your insurance sends an EOB. The EOB shows what was billed, the allowed amount, what the plan paid and what you may owe.",
      "{{eobVerdict}}",
      "The two papers should tell the same story: the amount the bill asks from you should match what the EOB says you owe. When they disagree, that is worth a calm question to the billing office.",
    ],
    takeaway: "Keep each EOB next to the bill it belongs to. Your case file does this for you.",
  },
  {
    id: "money-in-question",
    title: "What \"money in question\" means",
    body: [
      "When we notice something on a paper, we show an amount next to it and call it money in question. It is the size of the charge that is worth asking about. It is not a promise that the bill will go down.",
      "{{findingVerdict}}",
      "Each finding also says how sure we are. \"We are quite sure\" means numbers on the paper disagree with each other. \"Looks likely\" means the pattern is usually a mistake. \"Worth asking\" means there may be a good reason, and only the billing office can tell you.",
    ],
    takeaway: "Asking a question about your own bill is always okay.",
  },
  {
    id: "mother-and-baby",
    title: "Mother and baby get separate bills",
    body: [
      "One birth, at least two patients. A hospital usually keeps one account for the mother and another for the baby, and each account gets its own bill. Doctors who worked that day, such as the anesthesiologist or the pediatrician, may send their own bills too.",
      "So far {{whose}} case holds {{paperCount}}: {{paperList}}.",
      "Because these papers arrive weeks apart, the same service can show up on two of them. That is why it helps to keep all the papers of one birth together and look at them side by side.",
    ],
    takeaway: "Add each new paper to the same case, even months later.",
  },
];
