# src/intake/upload

Owner: Khursand. Takes what the person gives us and turns it into plain text.

- `check-file.ts` — is this a file we can read (type and size)?
- `read-pdf.ts`, `read-photo.ts` — text from a PDF, text from a photo.
- `read-upload.ts` — picks the right reader for a file.
- `read-pasted-text.ts` — checks text that the person pasted.
- `messages.ts` — kind messages shown when something goes wrong.
