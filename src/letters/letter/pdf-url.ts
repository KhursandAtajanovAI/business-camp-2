// A data link works in every browser without a server and without storing the letter anywhere.
export function pdfToDataUrl(bytes: Uint8Array): string {
  let binary = "";
  const chunk = 0x8000; // small pieces keep String.fromCharCode within its limits
  for (let index = 0; index < bytes.length; index += chunk) {
    binary += String.fromCharCode(...bytes.subarray(index, index + chunk));
  }
  return `data:application/pdf;base64,${btoa(binary)}`;
}

export function dataUrlToBytes(url: string): Uint8Array {
  const binary = atob(url.slice(url.indexOf(",") + 1));
  return Uint8Array.from(binary, (char) => char.charCodeAt(0));
}
