import { messages } from "./messages";

export const MAX_FILE_BYTES = 10 * 1024 * 1024;
export const ACCEPTED_FILE_TYPES = ["application/pdf", "image/jpeg", "image/png", "image/webp", "text/plain"];

export type UploadKind = "pdf" | "photo" | "text";

// Some phones send an empty type, so the file name is the fallback.
function kindFromName(name: string): UploadKind | null {
  const lower = name.toLowerCase();
  if (lower.endsWith(".pdf")) return "pdf";
  if (/\.(jpe?g|png|webp)$/.test(lower)) return "photo";
  if (lower.endsWith(".txt")) return "text";
  return null;
}

export function checkFile(file: { name: string; type: string; size: number }): UploadKind {
  if (file.size === 0) throw messages.emptyFile;
  if (file.size > MAX_FILE_BYTES) throw messages.tooBig;
  if (file.type === "application/pdf") return "pdf";
  if (file.type.startsWith("image/") && ACCEPTED_FILE_TYPES.includes(file.type)) return "photo";
  if (file.type === "text/plain") return "text";
  const fromName = file.type === "" ? kindFromName(file.name) : null;
  if (fromName) return fromName;
  throw messages.wrongType;
}
