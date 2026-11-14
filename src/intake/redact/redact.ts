import { labelledName, valuePatterns } from "./patterns";

function escapeForPattern(text: string): string {
  return text.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

// Hides names, addresses, dates of birth and identifying numbers.
// The result is still a readable bill, so the check and the model can work with it.
export function redactPersonalData(text: string): string {
  let result = text;
  for (const { pattern, marker } of valuePatterns) {
    result = result.replace(pattern, (_match, label: string) => `${label}${marker}`);
  }

  // A name written after a label ("Patient: ...") is hidden there and everywhere else it appears.
  const names = new Set<string>();
  result = result.replace(labelledName, (_match, label: string, name: string) => {
    if (name.trim().length > 1 && !name.includes("[hidden")) names.add(name.trim());
    return `${label}[hidden name]`;
  });
  for (const name of names) {
    result = result.replace(new RegExp(escapeForPattern(name), "gi"), "[hidden name]");
  }
  return result;
}
