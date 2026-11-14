export type KeyValueStore = Pick<Storage, "getItem" | "setItem" | "removeItem">;

export function memoryStore(): KeyValueStore {
  const items = new Map<string, string>();
  return {
    getItem: (key) => items.get(key) ?? null,
    setItem: (key, value) => void items.set(key, value),
    removeItem: (key) => void items.delete(key),
  };
}

const fallback = memoryStore();

// In the browser the case lives in local storage. On the server, in tests and in
// private windows without storage it lives in memory, so nothing ever crashes.
export function defaultStore(): KeyValueStore {
  try {
    if (typeof localStorage !== "undefined" && localStorage !== null && typeof localStorage.getItem === "function") return localStorage;
  } catch {
    // Storage is blocked; fall through to memory.
  }
  return fallback;
}
