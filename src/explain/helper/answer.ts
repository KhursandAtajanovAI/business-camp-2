// Server side of the helper: picks the model when a key is set, the local answer otherwise.
import type { Analysis } from "@/contracts";
import { redactPersonalData } from "@/intake";
import { helperText } from "@content/rules/helper-text";
import { askModel } from "./ask-model";
import { isHealthQuestion } from "./guard";
import { localAnswer } from "./local-answer";

export type HelperAnswer = { answer: string; answeredBy: "model" | "rules" };

export async function answerQuestion(question: string, analysis: Analysis, apiKey = process.env.ANTHROPIC_API_KEY, ask = askModel): Promise<HelperAnswer> {
  // Health questions never reach the model, and neither does personal data.
  if (isHealthQuestion(question)) return { answer: helperText.healthQuestion, answeredBy: "rules" };
  const safeQuestion = redactPersonalData(question);
  const fromModel = apiKey ? await ask(safeQuestion, analysis, apiKey) : null;
  if (fromModel) return { answer: `${fromModel}\n\n${helperText.disclaimer}`, answeredBy: "model" };
  return { answer: localAnswer(safeQuestion, analysis), answeredBy: "rules" };
}
