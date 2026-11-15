export type ReviewMode = "model" | "local";
export type LocalReason = "no_key" | "model_busy" | "model_unreachable" | "empty_answer" | "answer_rejected";

export type Review = {
  mode: ReviewMode; // who wrote the words: the language model, or code on its own
  reason?: LocalReason; // why the local mode was used
  modelStatus?: number; // HTTP status the model service answered with, when it refused the call
  summary: string;
  explanations: { findingId: string; text: string }[];
};
