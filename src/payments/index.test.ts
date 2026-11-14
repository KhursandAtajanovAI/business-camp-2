import { afterEach, expect, test, vi } from "vitest";
import { hasPaid, PaymentError, plans, startCheckout } from "./index";

afterEach(() => vi.unstubAllGlobals());

test("the two plans cost $29 once and $14.99 a month", () => {
  expect(plans.one_time_29).toMatchObject({ priceCents: 2900, billing: "once" });
  expect(plans.monthly_14_99).toMatchObject({ priceCents: 1499, billing: "monthly" });
});

test("before any payment the person has not paid", () => {
  expect(hasPaid()).toBe(false);
});

test("after a confirmed payment is remembered the person has paid", () => {
  const saved = JSON.stringify({ plan: "one_time_29", sessionId: "cs_test_1", paidAt: "2026-04-01T10:00:00.000Z" });
  vi.stubGlobal("localStorage", { getItem: () => saved, setItem: () => undefined, removeItem: () => undefined });
  expect(hasPaid()).toBe(true);
});

test("starting checkout returns the payment link from the server", async () => {
  vi.stubGlobal("fetch", async () => new Response(JSON.stringify({ url: "https://pay.test/abc" }), { status: 200 }));
  expect(await startCheckout("one_time_29", "/letter")).toBe("https://pay.test/abc");
});

test("a server problem becomes a kind message", async () => {
  vi.stubGlobal("fetch", async () => new Response("{}", { status: 500 }));
  await expect(startCheckout("one_time_29")).rejects.toBeInstanceOf(PaymentError);
});
