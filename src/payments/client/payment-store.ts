import type { Plan } from "@/contracts";

export type StoredPayment = { plan: Plan; sessionId: string; paidAt: string };
type KeyValueStore = Pick<Storage, "getItem" | "setItem" | "removeItem">;

export const PAYMENT_KEY = "bc2.payment";

// On the server and in private windows there may be no storage; then nobody has paid.
function browserStore(): KeyValueStore | null {
  try {
    return typeof localStorage === "undefined" ? null : localStorage;
  } catch {
    return null;
  }
}

export function readPayment(store: KeyValueStore | null = browserStore()): StoredPayment | null {
  try {
    const raw = store?.getItem(PAYMENT_KEY);
    const parsed = raw ? (JSON.parse(raw) as Partial<StoredPayment>) : null;
    return parsed?.plan && parsed.sessionId && parsed.paidAt ? (parsed as StoredPayment) : null;
  } catch {
    return null;
  }
}

export function writePayment(payment: StoredPayment, store: KeyValueStore | null = browserStore()): void {
  store?.setItem(PAYMENT_KEY, JSON.stringify(payment));
}

export function clearPayment(store: KeyValueStore | null = browserStore()): void {
  store?.removeItem(PAYMENT_KEY);
}
