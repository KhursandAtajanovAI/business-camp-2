import type { ReactNode } from "react";
import { upload } from "../_strings/upload";

const tile = "tap flex min-h-12 w-full cursor-pointer flex-col rounded-soft border-2 border-lavender bg-surface px-5 py-4 text-left shadow-soft hover:bg-lavender-soft focus-within:outline-3 focus-within:outline-lavender-deep";

function Words({ title, note }: { title: string; note: string }): ReactNode {
  return (
    <>
      <span className="text-xl font-extrabold">{title}</span>
      <span className="text-ink-soft">{note}</span>
    </>
  );
}

function FileTile({ title, note, accept, onFile }: { title: string; note: string; accept: string; onFile: (file: File) => void }) {
  return (
    <label className={tile}>
      <Words title={title} note={note} />
      <input
        type="file"
        accept={accept}
        className="sr-only"
        onChange={(event) => {
          const file = event.target.files?.[0];
          event.target.value = ""; // so the same file can be chosen again
          if (file) onFile(file);
        }}
      />
    </label>
  );
}

// Step one: three equal, quiet ways to add a paper.
export function ChooseStep({ onFile, onPaste }: { onFile: (file: File) => void; onPaste: () => void }) {
  return (
    <div className="flex flex-col gap-4">
      <FileTile title={upload.photo} note={upload.photoNote} accept="image/jpeg,image/png,image/webp" onFile={onFile} />
      <FileTile title={upload.pdf} note={upload.pdfNote} accept="application/pdf,text/plain,.pdf,.txt" onFile={onFile} />
      <button type="button" className={tile} onClick={onPaste}>
        <Words title={upload.paste} note={upload.pasteNote} />
      </button>
    </div>
  );
}
