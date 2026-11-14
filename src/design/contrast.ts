// Contrast math from the WCAG 2 guidelines. AA for normal text is 4.5 to 1.

function channel(value: number): number {
  const share = value / 255;
  return share <= 0.03928 ? share / 12.92 : ((share + 0.055) / 1.055) ** 2.4;
}

function luminance(hex: string): number {
  const [red, green, blue] = [1, 3, 5].map((start) => parseInt(hex.slice(start, start + 2), 16));
  return 0.2126 * channel(red) + 0.7152 * channel(green) + 0.0722 * channel(blue);
}

export function contrastRatio(hexA: string, hexB: string): number {
  const [light, dark] = [luminance(hexA), luminance(hexB)].sort((a, b) => b - a);
  return (light + 0.05) / (dark + 0.05);
}

// Reads every "--color-name: #rrggbb" from the tokens file.
export function readColorTokens(css: string): Record<string, string> {
  const found: Record<string, string> = {};
  for (const match of css.matchAll(/--color-([\w-]+):\s*(#[0-9a-f]{6})/gi)) found[match[1]] = match[2];
  return found;
}
