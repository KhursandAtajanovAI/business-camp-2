// The only file screens import from model-review. Safe for the browser.
import type { Analysis } from "@/contracts";
import { localReview } from "./review";
import type { Review } from "./types";

export type { LocalReason, Review, ReviewMode } from "./types";

// Asks the server to explain the findings on the person's own bill.
// `mode` in the answer tells the truth about who wrote the words: "model" or "local".
// If the server cannot be reached at all, the answer is local too.
export async function reviewAnalysis(analysis: Analysis): Promise<Review> {
  try {
    const response = await fetch("/api/review", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ analysis }),
    });
    const review = (await response.json()) as Review;
    if (response.ok && (review.mode === "model" || review.mode === "local") && Array.isArray(review.explanations)) return review;
  } catch {
    // fall through
  }
  return localReview(analysis, "model_unreachable");
}
