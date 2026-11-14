// What the person did so far, kept in the browser. No account, nothing on a server.
export type StoreKey = "papers" | "analysis" | "chosen" | "resume" | "case" | "lessons";

const name = (key: StoreKey) => `bc2.${key}`;

// In a private window storage can be closed. Then we simply remember nothing.
export function readStored<T>(key: StoreKey): T | null {
  try {
    const raw = window.localStorage.getItem(name(key));
    return raw ? (JSON.parse(raw) as T) : null;
  } catch {
    return null;
  }
}

export function writeStored(key: StoreKey, value: unknown): void {
  try {
    if (value === null) window.localStorage.removeItem(name(key));
    else window.localStorage.setItem(name(key), JSON.stringify(value));
  } catch {
    // Nothing to do: the site still works for this visit.
  }
}
