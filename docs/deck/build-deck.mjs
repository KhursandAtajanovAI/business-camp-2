// Draws docs/deck/deck.pdf from slides.mjs. Run: node docs/deck/build-deck.mjs
import { writeFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { PDFDocument, StandardFonts, rgb } from "pdf-lib";
import { slides } from "./slides.mjs";

const W = 960, H = 540, M = 56;
const hex = (value) => rgb(parseInt(value.slice(1, 3), 16) / 255, parseInt(value.slice(3, 5), 16) / 255, parseInt(value.slice(5, 7), 16) / 255);
const C = { bg: hex("#FFF8F2"), text: hex("#3B3340"), accent: hex("#D9715F"), calm: hex("#7FA58E"), soft: hex("#EFE7F6"), muted: hex("#7A7280"), white: hex("#FFFFFF") };

function wrap(text, font, size, width) {
  const lines = [];
  let line = "";
  for (const word of text.split(" ")) {
    const next = line ? `${line} ${word}` : word;
    if (line && font.widthOfTextAtSize(next, size) > width) { lines.push(line); line = word; } else line = next;
  }
  return [...lines, line];
}

function drawText(page, text, { x, y, font, size, color = C.text, width }) {
  for (const line of wrap(text, font, size, width)) { y -= size * 1.35; page.drawText(line, { x, y, font, size, color }); }
  return y;
}

function drawTable(page, rows, y, fonts, width) {
  const first = width * (rows[0].length > 3 ? 0.16 : 0.5), other = (width - first) / (rows[0].length - 1);
  for (const [index, row] of rows.entries()) {
    y -= 26;
    if (index === 0) page.drawRectangle({ x: M, y: y - 7, width, height: 26, color: C.soft });
    row.forEach((cell, column) => {
      const x = M + 8 + (column === 0 ? 0 : first + other * (column - 1));
      page.drawText(cell, { x, y, size: 13, font: index === 0 || column === 0 ? fonts.bold : fonts.regular, color: C.text });
    });
  }
  return y - 10;
}

function drawSlide(pdf, slide, number, fonts) {
  const page = pdf.addPage([W, H]);
  page.drawRectangle({ x: 0, y: 0, width: W, height: H, color: C.bg });
  page.drawRectangle({ x: 0, y: H - 10, width: W, height: 10, color: C.accent });
  const textWidth = slide.screenshots ? W * 0.56 - M : W - M * 2;
  let y = drawText(page, slide.title, { x: M, y: H - 44, font: fonts.bold, size: number === 1 ? 44 : 28, width: W - M * 2 });
  if (slide.lead) y = drawText(page, slide.lead, { x: M, y: y - 8, font: fonts.regular, size: 18, color: C.accent, width: textWidth });
  if (slide.table) y = drawTable(page, slide.table, y - 10, fonts, W - M * 2);
  y -= 12;
  for (const bullet of slide.bullets ?? []) {
    page.drawCircle({ x: M + 5, y: y - 15, size: 3.5, color: C.calm });
    y = drawText(page, bullet, { x: M + 20, y, font: fonts.regular, size: 16, width: textWidth - 20 }) - 9;
  }
  if (y < 66) console.warn(`Slide ${number} has too much text: shorten it.`);
  (slide.screenshots ?? []).forEach((name, index, all) => {
    const boxHeight = Math.min(150, (H - 170) / all.length - 12), x = W * 0.6, top = H - 120 - index * (boxHeight + 12);
    page.drawRectangle({ x, y: top - boxHeight, width: W * 0.4 - M, height: boxHeight, color: C.white, borderColor: C.soft, borderWidth: 2 });
    page.drawText(`Screenshot: ${name}`, { x: x + 16, y: top - 28, size: 13, font: fonts.bold, color: C.muted });
    page.drawText("added from the live site", { x: x + 16, y: top - 46, size: 11, font: fonts.regular, color: C.muted });
  });
  if (slide.sources) drawText(page, slide.sources, { x: M, y: 50, font: fonts.regular, size: 9, color: C.muted, width: W - M * 2 - 40 });
  page.drawText(String(number), { x: W - M, y: 22, size: 10, font: fonts.regular, color: C.muted });
}

const pdf = await PDFDocument.create();
pdf.setTitle("Birth Bill Check: pitch deck");
const fonts = { regular: await pdf.embedFont(StandardFonts.Helvetica), bold: await pdf.embedFont(StandardFonts.HelveticaBold) };
if (slides.length > 10) throw new Error("The deck may have at most 10 slides.");
slides.forEach((slide, index) => drawSlide(pdf, slide, index + 1, fonts));
const target = fileURLToPath(new URL("./deck.pdf", import.meta.url));
writeFileSync(target, await pdf.save());
console.log(`Wrote ${slides.length} slides to ${target}`);
