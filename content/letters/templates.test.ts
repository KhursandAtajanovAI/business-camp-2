import { expect, test } from "vitest";
import { callScript } from "./call-script";
import { claimLetter } from "./claim-letter";
import { disclaimer } from "./disclaimer";

const allText = JSON.stringify([claimLetter, callScript, disclaimer]);

test("the templates never promise money back", () => {
  expect(allText).not.toMatch(/guarantee|we will get|you will get|money back|will be refunded|owed to you/i);
});

test("the templates use calm words only", () => {
  expect(allText).not.toMatch(/urgent|immediately|demand|lawsuit|sue\b|fraud|!/i);
});

test("the templates are in English only", () => {
  expect(allText).not.toMatch(/[Ѐ-ӿ]/);
});

test("the disclaimer says this is not medical or legal advice", () => {
  expect(disclaimer).toContain("not medical or legal advice");
});
