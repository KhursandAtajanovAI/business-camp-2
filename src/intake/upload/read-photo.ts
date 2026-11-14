import { messages } from "./messages";

// Reads the words on a photo in the browser itself, so the picture never leaves the device.
// The reader is loaded only when someone really uploads a photo, because it is heavy.
export async function readPhoto(file: Blob): Promise<string> {
  try {
    const { recognize } = await import("tesseract.js");
    const result = await recognize(file, "eng");
    const text = result.data.text;
    if (text.replace(/\s/g, "").length < 20) throw messages.unreadablePhoto;
    return text;
  } catch {
    throw messages.unreadablePhoto;
  }
}
