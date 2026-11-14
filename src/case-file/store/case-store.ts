import type { CaseFile } from "@/contracts";
import { defaultStore, type KeyValueStore } from "./storage";

export const CASE_KEY = "bc2.case-file";

function looksLikeCase(value: unknown): value is CaseFile {
  const candidate = value as Partial<CaseFile> | null;
  return Boolean(
    candidate && typeof candidate.id === "string" && candidate.analysis && Array.isArray(candidate.analysis.documents) &&
      Array.isArray(candidate.claimedFindingIds) && Array.isArray(candidate.deadlines) && Array.isArray(candidate.outcomes),
  );
}

export function saveCase(caseFile: CaseFile, store: KeyValueStore = defaultStore()): CaseFile {
  store.setItem(CASE_KEY, JSON.stringify(caseFile));
  return caseFile;
}

// Returns null when there is no case yet or the saved data is damaged.
export function loadCase(store: KeyValueStore = defaultStore()): CaseFile | null {
  try {
    const raw = store.getItem(CASE_KEY);
    const parsed: unknown = raw ? JSON.parse(raw) : null;
    return looksLikeCase(parsed) ? parsed : null;
  } catch {
    return null;
  }
}

export function clearCase(store: KeyValueStore = defaultStore()): void {
  store.removeItem(CASE_KEY);
}
