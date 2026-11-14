// The standard PDF font cannot draw every character, so unusual ones are swapped for plain ones.
const PLAIN: Record<string, string> = { "‘": "'", "’": "'", "“": '"', "”": '"', "–": "-", "—": "-", "…": "...", " ": " " };

export function toPdfSafe(text: string): string {
  return [...text].map((char) => PLAIN[char] ?? (char.charCodeAt(0) > 255 ? "?" : char)).join("");
}

// Breaks text into lines no wider than maxWidth. measure() tells how wide a piece of text is.
export function wrapText(text: string, maxWidth: number, measure: (piece: string) => number): string[] {
  const lines: string[] = [];
  let current = "";
  for (const word of text.split(/\s+/).filter(Boolean)) {
    const candidate = current ? `${current} ${word}` : word;
    if (current && measure(candidate) > maxWidth) {
      lines.push(current);
      current = word;
    } else {
      current = candidate;
    }
  }
  if (current) lines.push(current);
  return lines.length > 0 ? lines : [""];
}
