import type { Analysis, Finding } from "@/contracts";
import { glossary, helperText } from "@content/rules/helper-text";
import { explainFinding } from "../explain-finding";
import { isHealthQuestion } from "./guard";

const usd = (cents: number) => `$${Math.floor(cents / 100).toLocaleString("en-US")}.${String(cents % 100).padStart(2, "0")}`;
const SMALL_WORDS = new Set(["the", "and", "for", "but", "with", "what", "why", "how", "this", "that", "bill", "bills", "from", "your", "about", "was", "are", "does", "did", "mean", "have"]);
const words = (text: string) => text.toLowerCase().match(/[a-z0-9]{3,}/g)?.filter((word) => !SMALL_WORDS.has(word)) ?? [];

function countText(count: number): string {
  return count === 1 ? helperText.oneFinding : helperText.manyFindings.replace("{{count}}", String(count));
}

// The finding whose title, rule or paper shares the most words with the question.
function closestFinding(question: string, analysis: Analysis): Finding | undefined {
  const asked = new Set(words(question));
  const score = (finding: Finding) => {
    const provider = analysis.documents.find((document) => document.id === finding.documentId)?.provider ?? "";
    return words(`${finding.title} ${finding.ruleId.replace(/-/g, " ")} ${provider}`).filter((word) => asked.has(word)).length;
  };
  const best = [...analysis.findings].sort((first, second) => score(second) - score(first))[0];
  return best && score(best) > 0 ? best : undefined;
}

// Answers from the case data with ordinary code. Every number comes from the analysis.
export function localAnswer(question: string, analysis: Analysis): string {
  if (isHealthQuestion(question)) return helperText.healthQuestion;
  const term = glossary.find((entry) => entry.words.test(question));
  if (term && !/my|our|why/i.test(question)) return term.answer;
  if (analysis.findings.length === 0) return term ? term.answer : helperText.noFindings;

  const total = helperText.total.replace("{{amount}}", usd(analysis.totalAtStakeCents)).replace("{{count}}", countText(analysis.findings.length));
  if (/how much|total|altogether|in question|at stake|save/i.test(question)) return total;
  if (/next|what (should|can|do) i do|now what|where do i start/i.test(question)) return helperText.nextStep;

  const finding = closestFinding(question, analysis);
  if (finding) return `${finding.title}. ${explainFinding(finding)}`;
  if (term) return term.answer;

  const list = analysis.findings.map((item) => `- ${item.title} (${usd(item.atStakeCents)} in question)`).join("\n");
  return `${helperText.listIntro}\n${list}\n${total}`;
}
