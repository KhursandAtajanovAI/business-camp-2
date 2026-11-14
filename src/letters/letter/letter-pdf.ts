import { PDFDocument, StandardFonts, rgb, type PDFFont, type PDFPage } from "pdf-lib";
import type { LetterBlock } from "./letter-content";
import { toPdfSafe, wrapText } from "./wrap-text";

const PAGE = { width: 612, height: 792, margin: 64 }; // US Letter
const SIZES = { title: 17, heading: 12, text: 11, small: 9, gap: 11 };
const INK = rgb(0.23, 0.2, 0.25);

type Cursor = { page: PDFPage; y: number };

function drawBlock(pdf: PDFDocument, cursor: Cursor, block: LetterBlock, fonts: { regular: PDFFont; bold: PDFFont }): Cursor {
  const size = SIZES[block.style];
  const lineHeight = size * 1.45;
  if (block.style === "gap") return { ...cursor, y: cursor.y - lineHeight * 0.6 };

  const font = block.style === "title" || block.style === "heading" ? fonts.bold : fonts.regular;
  const width = PAGE.width - PAGE.margin * 2;
  let { page, y } = cursor;
  for (const line of wrapText(toPdfSafe(block.text), width, (piece) => font.widthOfTextAtSize(piece, size))) {
    if (y - lineHeight < PAGE.margin) {
      page = pdf.addPage([PAGE.width, PAGE.height]);
      y = PAGE.height - PAGE.margin;
    }
    y -= lineHeight;
    page.drawText(line, { x: PAGE.margin, y, size, font, color: INK });
  }
  return { page, y };
}

// Each letter starts on its own page, so every billing office gets its own sheet.
export async function renderLettersPdf(letters: LetterBlock[][]): Promise<Uint8Array> {
  const pdf = await PDFDocument.create();
  pdf.setTitle("Request for review of charges");
  const fonts = { regular: await pdf.embedFont(StandardFonts.Helvetica), bold: await pdf.embedFont(StandardFonts.HelveticaBold) };
  for (const blocks of letters) {
    let cursor: Cursor = { page: pdf.addPage([PAGE.width, PAGE.height]), y: PAGE.height - PAGE.margin };
    for (const block of blocks) cursor = drawBlock(pdf, cursor, block, fonts);
  }
  return pdf.save();
}
