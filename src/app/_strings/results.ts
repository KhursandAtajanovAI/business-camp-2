export const results = {
  emptyTitle: "Nothing to show yet",
  emptyText: "Add a bill, or open the example, and your results will wait for you here.",
  emptyAction: "Add a paper",
  loading: "One moment, we are opening your results",
  foundTitle: (count: number) =>
    count === 1 ? "We found one thing worth asking about" : `We found ${count} things worth asking about`,
  calmTitle: "Everything we checked adds up",
  calmText: "We did not find anything to ask about in these papers. If a new paper arrives, add it and we will look again.",
  moneyLabel: "Money in question",
  moneyNote: "This is the amount worth asking about. It is not a promise of a refund.",
  papersRead: (papers: string) => `We read ${papers}.`,
};
