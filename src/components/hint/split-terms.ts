import type { GlossaryTerm } from "@/app/_strings/glossary";

export type TextPiece = { text: string; term?: GlossaryTerm };

const escape = (word: string) => word.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

// Cuts a sentence into plain pieces and glossary words.
// Longer names win ("out-of-network" before "network"), and each term is highlighted once per text.
export function splitTerms(text: string, terms: GlossaryTerm[]): TextPiece[] {
  const spellings = terms
    .flatMap((term) => [term.word, ...(term.also ?? [])].map((spelling) => ({ spelling, term })))
    .sort((a, b) => b.spelling.length - a.spelling.length);
  if (spellings.length === 0) return [{ text }];
  const pattern = new RegExp(`(?<![\\w-])(${spellings.map((entry) => escape(entry.spelling)).join("|")})(?![\\w-])`, "gi");

  const pieces: TextPiece[] = [];
  const used = new Set<GlossaryTerm>();
  let cursor = 0;
  for (const match of text.matchAll(pattern)) {
    const term = spellings.find((entry) => entry.spelling.toLowerCase() === match[0].toLowerCase())?.term;
    if (!term || used.has(term)) continue;
    used.add(term);
    if (match.index > cursor) pieces.push({ text: text.slice(cursor, match.index) });
    pieces.push({ text: match[0], term });
    cursor = match.index + match[0].length;
  }
  if (cursor < text.length) pieces.push({ text: text.slice(cursor) });
  return pieces;
}
