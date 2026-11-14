import { expect, test } from "vitest";
import { confirmSession, newTestSessionId } from "./confirm-session";
import { createCheckoutUrl } from "./create-session";
import { stripeGateway, type CheckoutGateway } from "./gateway";
import { returnPage, testCheckoutPage } from "./pages";

type CreateParams = Parameters<CheckoutGateway["create"]>[0];

function fakeGateway(status = "paid") {
  const calls: CreateParams[] = [];
  const gateway: CheckoutGateway = {
    create: async (params) => (calls.push(params), { url: "https://checkout.stripe.com/c/pay/cs_test_abc" }),
    retrieve: async () => ({ payment_status: status, metadata: { plan: "one_time_29" } }),
  };
  return { gateway, calls };
}

const request = { plan: "one_time_29" as const, origin: "https://example.test", returnTo: "/letter" };

test("the $29 plan becomes a one-time Stripe payment of 2900 cents", async () => {
  const { gateway, calls } = fakeGateway();
  expect(await createCheckoutUrl(request, gateway)).toContain("checkout.stripe.com");
  expect(calls[0].mode).toBe("payment");
  expect(calls[0].line_items?.[0].price_data?.unit_amount).toBe(2900);
  expect(calls[0].success_url).toContain("/api/payments/return?return_to=%2Fletter&session_id={CHECKOUT_SESSION_ID}");
});

test("the $14.99 plan becomes a monthly subscription of 1499 cents", async () => {
  const { gateway, calls } = fakeGateway();
  await createCheckoutUrl({ ...request, plan: "monthly_14_99" }, gateway);
  expect(calls[0].mode).toBe("subscription");
  expect(calls[0].line_items?.[0].price_data).toMatchObject({ unit_amount: 1499, recurring: { interval: "month" } });
});

test("without Stripe the person goes to the built-in test checkout", async () => {
  expect(await createCheckoutUrl(request, null)).toBe("https://example.test/api/payments/test-checkout?plan=one_time_29&return_to=%2Fletter");
});

test("a return link can never leave our site", async () => {
  expect(await createCheckoutUrl({ ...request, returnTo: "https://evil.test" }, null)).toContain("return_to=%2F");
});

test("a paid Stripe session opens access and an unpaid one does not", async () => {
  expect(await confirmSession("cs_test_abc", fakeGateway("paid").gateway)).toEqual({ paid: true, plan: "one_time_29" });
  expect(await confirmSession("cs_test_abc", fakeGateway("unpaid").gateway)).toEqual({ paid: false, plan: null });
});

test("built-in test sessions work only when Stripe is not set up", async () => {
  const id = newTestSessionId("monthly_14_99");
  expect(await confirmSession(id, null)).toEqual({ paid: true, plan: "monthly_14_99" });
  expect(await confirmSession("made-up", null)).toEqual({ paid: false, plan: null });
  expect((await confirmSession(id, fakeGateway("unpaid").gateway)).paid).toBe(false);
});

test("live Stripe keys are refused and a missing key means test checkout", () => {
  expect(() => stripeGateway("sk_live_not_a_real_key")).toThrow(/test keys/);
  expect(stripeGateway("")).toBeNull();
});

test("the built-in pages say clearly what is happening", () => {
  const page = testCheckoutPage("one_time_29", "/pay", "/letter");
  expect(page).toContain("Test mode");
  expect(page).toContain("$29");
  expect(page).toContain("no real money moves");
  expect(returnPage("cs_test_abc", "/letter")).toContain("We are checking your payment.");
});
