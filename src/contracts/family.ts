// Types for the family path after the birth: later events, plans and referrals.
// Owner: Khursand. Types and examples only, no behaviour yet. Money is in cents.
// Prices and dates here are our assumptions, not data.

export type FamilyEventKind =
  | "birth_bill"
  | "eob_followup"
  | "baby_enrollment_window"
  | "well_baby_visit"
  | "open_enrollment"
  | "fsa_hsa_deadline"
  | "next_child_check";

export interface FamilyEvent {
  id: string;
  kind: FamilyEventKind;
  dueDate: string; // ISO date
  title: string;
  confidence: "verified" | "worth_asking"; // worth_asking until the source is checked
  sourceUrl?: string;
}

export type FamilyPlanId = "start" | "family" | "pause";

export interface FamilyPlan {
  id: FamilyPlanId;
  priceCents: number;
  interval: "once" | "month" | "year" | "free";
  pauseMonthsMax?: number; // for pause: 6
}

export interface ReferralCode {
  code: string;
  ownerCaseId: string;
  rewardMonths: number; // 1 by default
  maxRewardMonths: number; // cap of 12
  creditedAfterFirstPayment: boolean;
}

// STUB examples of the same shape, for screens and tests until the real modules exist.
export const sampleFamilyEvents: FamilyEvent[] = [
  { id: "event-sample-1", kind: "birth_bill", dueDate: "2026-03-20", title: "Hospital bill for the birth", confidence: "verified" },
  { id: "event-sample-2", kind: "eob_followup", dueDate: "2026-04-20", title: "Look for the insurance explanation for the hospital bill", confidence: "worth_asking" },
  { id: "event-sample-3", kind: "baby_enrollment_window", dueDate: "2026-04-13", title: "Ask your plan how long you have to add the baby", confidence: "worth_asking" },
];

export const sampleFamilyPlans: FamilyPlan[] = [
  { id: "start", priceCents: 2900, interval: "once" },
  { id: "family", priceCents: 699, interval: "month" },
  { id: "pause", priceCents: 0, interval: "free", pauseMonthsMax: 6 },
];

export const sampleReferralCode: ReferralCode = {
  code: "SAMPLE-GIFT",
  ownerCaseId: "case-sample-1",
  rewardMonths: 1,
  maxRewardMonths: 12,
  creditedAfterFirstPayment: true,
};
