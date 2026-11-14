// Words for the bill health score. {{places}} are filled by src/engine/money.
export const scoreText = {
  clean: "100 out of 100: we found nothing to ask about in these papers.",
  oneFinding: "{{score}} out of 100: one thing is worth asking about, and about {{percent}}% of what was billed is in question.",
  manyFindings: "{{score}} out of 100: {{count}} things are worth asking about, and about {{percent}}% of what was billed is in question.",
  howItWorks: "The score starts at 100. Each finding takes 5 points, and each percent of the billed money in question takes 3 points; findings we are less sure about weigh less.",
};
