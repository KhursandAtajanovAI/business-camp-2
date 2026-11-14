import { expect, test } from "vitest";
import { clearPayment, readPayment, writePayment } from "./payment-store";

function fakeStore() {
  const items = new Map<string, string>();
  return {
    getItem: (key: string) => items.get(key) ?? null,
    setItem: (key: string, value: string) => void items.set(key, value),
    removeItem: (key: string) => void items.delete(key),
  };
}

test("nobody has paid before a payment is remembered", () => {
  expect(readPayment(fakeStore())).toBeNull();
  expect(readPayment(null)).toBeNull();
});

test("a remembered payment is still there after a reload", () => {
  const store = fakeStore();
  writePayment({ plan: "one_time_29", sessionId: "cs_test_1", paidAt: "2026-04-01T10:00:00.000Z" }, store);
  expect(readPayment(store)?.plan).toBe("one_time_29");
  clearPayment(store);
  expect(readPayment(store)).toBeNull();
});

test("broken saved data counts as not paid", () => {
  const store = fakeStore();
  store.setItem("bc2.payment", "{not json");
  expect(readPayment(store)).toBeNull();
});
