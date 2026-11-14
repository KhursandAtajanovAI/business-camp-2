// The helper talks about papers and money only. A question about health gets a kind redirect.
const HEALTH_WORDS =
  /\b(symptoms?|pain|bleeding|fever|infection|medicine|medication|dose|dosage|pills?|diagnos\w*|treatment|breastfeed\w*|is it safe|should i take|should i stop taking|rash|vaccine safe|heal(ing)?|depress\w*)\b/i;

export function isHealthQuestion(question: string): boolean {
  return HEALTH_WORDS.test(question);
}
