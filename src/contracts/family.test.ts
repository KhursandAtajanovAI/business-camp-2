import { expect, test } from "vitest";
import { sampleFamilyEvents, sampleFamilyPlans, sampleReferralCode } from "./family";

test("family events carry an ISO date and are careful until a source is checked", () => {
  for (const event of sampleFamilyEvents) expect(event.dueDate).toMatch(/^\d{4}-\d{2}-\d{2}$/);
  expect(sampleFamilyEvents.filter((event) => event.kind !== "birth_bill").every((event) => event.confidence === "worth_asking")).toBe(true);
});

test("plan prices are whole cents and a pause is free for at most six months", () => {
  for (const plan of sampleFamilyPlans) expect(Number.isInteger(plan.priceCents)).toBe(true);
  expect(sampleFamilyPlans.find((plan) => plan.id === "pause")).toMatchObject({ priceCents: 0, interval: "free", pauseMonthsMax: 6 });
});

test("a referral gives one month, up to twelve, after the friend's first payment", () => {
  expect(sampleReferralCode).toMatchObject({ rewardMonths: 1, maxRewardMonths: 12, creditedAfterFirstPayment: true });
});
