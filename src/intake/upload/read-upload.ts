import { checkFile } from "./check-file";
import { readPdf } from "./read-pdf";
import { readPhoto } from "./read-photo";

// One uploaded file becomes plain text, whatever it was.
export async function readUpload(file: File): Promise<string> {
  const kind = checkFile(file);
  if (kind === "pdf") return readPdf(new Uint8Array(await file.arrayBuffer()));
  if (kind === "photo") return readPhoto(file);
  return file.text();
}
