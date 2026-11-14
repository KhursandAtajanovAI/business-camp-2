// Every message says what happened and what the person can do next. No scary words.

export class IntakeError extends Error {
  readonly nextStep: string;

  constructor(message: string, nextStep: string) {
    super(message);
    this.name = "IntakeError";
    this.nextStep = nextStep;
  }
}

export const messages = {
  wrongType: new IntakeError(
    "We can read PDFs, photos (JPG or PNG) and plain text files.",
    "Please choose one of those, or paste the text of the bill instead.",
  ),
  tooBig: new IntakeError(
    "This file is a little too big for us (the limit is 10 MB).",
    "Try a smaller photo, or paste the text of the bill instead.",
  ),
  emptyFile: new IntakeError(
    "This file looks empty.",
    "Please check it opens on your device, then try again.",
  ),
  scannedPdf: new IntakeError(
    "This PDF is a picture of a page, so we could not find any text in it.",
    "Take a clear photo of the page and upload it, or paste the text instead.",
  ),
  unreadablePhoto: new IntakeError(
    "We could not read this photo clearly.",
    "Try again in good light with the whole page in view, or paste the text instead.",
  ),
  tooShort: new IntakeError(
    "That is not quite enough text for us to check.",
    "Paste the whole bill, including the lines with amounts.",
  ),
  noAmounts: new IntakeError(
    "We could not find any dollar amounts in this text.",
    "Make sure the lines with charges are included, for example: Room and board $2,400.00.",
  ),
} as const;
