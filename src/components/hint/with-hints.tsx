import { glossary } from "@/app/_strings/glossary";
import { Hint } from "./hint";
import { splitTerms } from "./split-terms";

// Put any text through this and every glossary word in it becomes a tappable hint.
export function WithHints({ text }: { text: string }) {
  return (
    <>
      {splitTerms(text, glossary).map((piece, index) =>
        piece.term ? <Hint key={index} term={piece.term}>{piece.text}</Hint> : piece.text,
      )}
    </>
  );
}
