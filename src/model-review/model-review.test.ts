import { expect, test } from "vitest";
import { sampleAnalysis } from "@/contracts/stubs";
import { callModel } from "./call-model";
import { amountsAreKnown, checkAnswer } from "./check-answer";
import { buildFacts, knownAmounts } from "./facts";
import { reviewAnalysis } from "./index";
import { localReview, reviewOnServer } from "./review";

const id = sampleAnalysis.findings[0].id;
const good = JSON.stringify({ summary: "One blood test is listed twice, with $725.00 in question.", explanations: [{ findingId: id, text: "The complete blood count appears on two lines for $725.00 each." }] });
const reply = (text: string) => async () => ({ ok: true as const, text });

test("the model gets the person's own bill lines and the findings, and no personal data", () => {
  const facts = JSON.stringify(buildFacts(sampleAnalysis));
  expect(facts).toContain("Complete blood count");
  expect(facts).toContain('"inQuestionCents":72500');
  expect(facts).not.toMatch(/patient|member|address|policy/i);
});

test("with a key the model explains the findings and the answer says so", async () => {
  const review = await reviewOnServer(sampleAnalysis, "key", reply(good));
  expect(review.mode).toBe("model");
  expect(review.explanations).toEqual([{ findingId: id, text: "The complete blood count appears on two lines for $725.00 each." }]);
});

test("without a key the answer is local and says why", async () => {
  const review = await reviewOnServer(sampleAnalysis, "");
  expect(review).toMatchObject({ mode: "local", reason: "no_key" });
  expect(review.explanations[0].text).toContain("$725.00");
  expect(review.summary).toBe("We found one thing worth asking about, with $725.00 in question.");
});

test("code checks the model: an amount that is not on the papers is not accepted", async () => {
  expect(amountsAreKnown("billed $725.00 of $12,450.00", knownAmounts(sampleAnalysis))).toBe(true);
  expect(amountsAreKnown("you could save $900", knownAmounts(sampleAnalysis))).toBe(false);
  const invented = JSON.stringify({ summary: "ok", explanations: [{ findingId: id, text: "You will save $900.00 here." }] });
  expect(await reviewOnServer(sampleAnalysis, "key", reply(invented))).toMatchObject({ mode: "local", reason: "answer_rejected" });
});

test("the model cannot add findings, promise money or give advice", () => {
  const extra = JSON.stringify({ summary: "", explanations: [{ findingId: id, text: "This line is listed twice." }, { findingId: "made-up", text: "Another problem." }] });
  expect(checkAnswer(extra, sampleAnalysis)?.explanations.map((item) => item.findingId)).toEqual([id]);
  const promise = JSON.stringify({ summary: "", explanations: [{ findingId: id, text: "We guarantee this will be removed." }] });
  expect(checkAnswer(promise, sampleAnalysis)).toBeNull();
  expect(checkAnswer("not json at all", sampleAnalysis)).toBeNull();
});

test("a busy, silent or unreachable model falls back to local with the reason", async () => {
  const status = (code: number, body = "{}") => async () => new Response(body, { status: code });
  expect(await callModel(sampleAnalysis, "key", status(429))).toEqual({ ok: false, reason: "model_busy" });
  expect(await callModel(sampleAnalysis, "key", status(500))).toEqual({ ok: false, reason: "model_unreachable" });
  expect(await callModel(sampleAnalysis, "key", status(200, JSON.stringify({ content: [] })))).toEqual({ ok: false, reason: "empty_answer" });
  expect(await callModel(sampleAnalysis, "key", async () => { throw new Error("offline"); })).toEqual({ ok: false, reason: "model_unreachable" });
  expect(await reviewOnServer(sampleAnalysis, "key", async () => ({ ok: false, reason: "model_busy" }))).toMatchObject({ mode: "local", reason: "model_busy" });
});

test("the model's text is read from the reply", async () => {
  const ok = async () => new Response(JSON.stringify({ content: [{ type: "text", text: good }] }), { status: 200 });
  expect(await callModel(sampleAnalysis, "key", ok)).toEqual({ ok: true, text: good });
});

test("a screen always gets an answer, even with no server", async () => {
  expect(await reviewAnalysis(sampleAnalysis)).toMatchObject({ mode: "local", reason: "model_unreachable" });
  expect(localReview({ ...sampleAnalysis, findings: [], totalAtStakeCents: 0 }, "no_key").summary).toContain("nothing to ask about");
});
