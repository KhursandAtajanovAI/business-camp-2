import { expect, test } from "vitest";
import type { Analysis } from "@/contracts";
import { sampleAnalysis } from "@/contracts/stubs";
import { askHelper } from "../index";
import { answerQuestion } from "./answer";
import { askModel, buildCaseFacts } from "./ask-model";
import { isHealthQuestion } from "./guard";
import { localAnswer } from "./local-answer";

const empty: Analysis = { ...sampleAnalysis, findings: [], totalAtStakeCents: 0 };

test("the helper answers how much is in question from the case data", () => {
  expect(localAnswer("How much is in question in total?", sampleAnalysis)).toBe(
    "Across your papers, $725.00 is in question in 1 finding. That is money worth asking about, not a promise of a refund.",
  );
});

test("the helper explains the finding the question is about", () => {
  const answer = localAnswer("Why is the blood test there twice?", sampleAnalysis);
  expect(answer).toContain("The same blood test appears twice on the same day.");
  expect(answer).toContain("$725.00");
});

test("the helper explains a word from a bill in one sentence", () => {
  expect(localAnswer("What is an EOB?", sampleAnalysis)).toContain("It is not a bill.");
  expect(localAnswer("what does deductible mean", empty)).toContain("before your insurance plan starts to pay");
});

test("the helper says so when there is nothing to ask about, and suggests a next step when asked", () => {
  expect(localAnswer("Anything wrong?", empty)).toContain("did not find anything to ask about");
  expect(localAnswer("What should I do next?", sampleAnalysis)).toContain("build the letter");
});

test("a health question is never answered, by code or by the model", async () => {
  expect(isHealthQuestion("Is it safe to take this medicine while breastfeeding?")).toBe(true);
  expect(isHealthQuestion("Why is the anesthesia bill so high?")).toBe(false);
  let modelWasAsked = false;
  const result = await answerQuestion("Should I take pain pills?", sampleAnalysis, "key", async () => ((modelWasAsked = true), "x"));
  expect(result).toEqual({ answer: expect.stringContaining("please ask your doctor"), answeredBy: "rules" });
  expect(modelWasAsked).toBe(false);
});

test("personal data in a question is hidden before the model sees it", async () => {
  let seen = "";
  const result = await answerQuestion("Patient: Jane Sample asks about the blood test, member ID: XKT445821907", sampleAnalysis, "key", async (question) => ((seen = question), "The blood test is listed twice."));
  expect(seen).not.toContain("Jane Sample");
  expect(seen).not.toContain("XKT445821907");
  expect(result).toEqual({ answer: "The blood test is listed twice.\n\nThis is not medical or legal advice.", answeredBy: "model" });
});

test("the facts sent to the model carry findings and amounts, and no personal data", () => {
  const facts = buildCaseFacts(sampleAnalysis);
  expect(facts).toContain('"inQuestionCents":72500');
  expect(facts).not.toMatch(/patient|member|address/i);
});

test("without a key, or when the model fails, ordinary code answers", async () => {
  expect((await answerQuestion("How much in total?", sampleAnalysis, undefined)).answeredBy).toBe("rules");
  const failing = async () => new Response("{}", { status: 500 });
  expect(await askModel("hi", sampleAnalysis, "key", failing)).toBeNull();
  expect((await answerQuestion("How much in total?", sampleAnalysis, "key", async () => null)).answeredBy).toBe("rules");
});

test("the model's answer is read from the reply", async () => {
  const ok = async () => new Response(JSON.stringify({ content: [{ type: "text", text: " One blood test is listed twice. " }] }), { status: 200 });
  expect(await askModel("hi", sampleAnalysis, "key", ok)).toBe("One blood test is listed twice.");
});

test("askHelper still answers when the server cannot be reached", async () => {
  expect(await askHelper("How much is in question?", sampleAnalysis)).toContain("$725.00");
});
