// The script of the detective game: one made-up bill with four things hidden in it.
// Everything here is invented. Each clue is plain arithmetic or a plain date check,
// so the game teaches how to read a bill without giving medical or legal advice.
export type GameRow = {
  id: string;
  date: string; // as printed on the bill
  description: string;
  quantity: number;
  unitCents: number;
  amountCents: number;
  clue?: { found: string; hint: string }; // present only on rows that hide something
};

export const gameBill = {
  provider: "Maple Grove Birth Center",
  stay: "Stay: March 14 to March 16, 2026",
  rows: [
    { id: "room", date: "03/14", description: "Room and board, semi-private", quantity: 2, unitCents: 240_000, amountCents: 480_000 },
    { id: "delivery", date: "03/14", description: "Labor and delivery room", quantity: 1, unitCents: 610_000, amountCents: 610_000 },
    { id: "hearing-1", date: "03/15", description: "Newborn hearing screening", quantity: 1, unitCents: 18_500, amountCents: 18_500 },
    {
      id: "hearing-2", date: "03/15", description: "Newborn hearing screening", quantity: 1, unitCents: 18_500, amountCents: 18_500,
      clue: { found: "The same screening is listed twice on the same day. It is fair to ask whether it was really done twice.", hint: "Two lines on this bill look exactly alike." },
    },
    {
      id: "lactation", date: "03/15", description: "Lactation consultation", quantity: 1, unitCents: 12_000, amountCents: 24_000,
      clue: { found: "One consultation at $120.00 should come to $120.00, but the line charges $240.00.", hint: "Multiply the quantity by the price of one. Does every line agree?" },
    },
    { id: "blood", date: "03/15", description: "Complete blood count", quantity: 1, unitCents: 7_250, amountCents: 7_250 },
    {
      id: "supplies", date: "03/19", description: "Pharmacy supplies", quantity: 1, unitCents: 14_800, amountCents: 14_800,
      clue: { found: "This charge is dated March 19, three days after the stay ended on March 16.", hint: "Compare the dates on the lines with the dates of the stay." },
    },
  ] satisfies GameRow[] as GameRow[],
  statedTotalCents: 1_198_050,
  totalClue: {
    found: "The lines add up to $11,730.50, but the total says $11,980.50. The extra $250.00 belongs to no line.",
    hint: "Add up the lines and compare with the total at the bottom.",
  },
};

export const gameWords = {
  title: "Bill detective",
  intro: "Here is a made-up bill with four things hidden in it. Tap any line that looks odd to you. There is no clock and no score to lose.",
  start: "Start when you are ready",
  found: (count: number, total: number) => `Found ${count} of ${total}`,
  sproutLabel: (count: number, total: number) => `A sprout that grows with each find: ${count} of ${total}`,
  fine: "This line looks fine. Nothing odd here.",
  hint: "Give me a hint",
  hintTitle: "A small hint",
  total: "Total charges",
  each: "each",
  endTitle: "You found all four",
  endText: "You just read a bill more carefully than most people ever do. The same four checks work on a real one.",
  ownBill: "Check my own bill",
  again: "Play again",
  showAll: "Show me the answers",
};
