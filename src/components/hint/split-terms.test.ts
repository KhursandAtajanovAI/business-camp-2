import { describe, expect, it } from "vitest";
import { glossary } from "@/app/_strings/glossary";
import { splitTerms } from "./split-terms";

const marked = (text: string) => splitTerms(text, glossary).filter((piece) => piece.term).map((piece) => piece.text);

describe("glossary words in a text", () => {
  it("finds a hard word and keeps the rest of the sentence whole", () => {
    const pieces = splitTerms("Your EOB is not a bill.", glossary);
    expect(pieces.map((piece) => piece.text).join("")).toBe("Your EOB is not a bill.");
    expect(marked("Your EOB is not a bill.")).toEqual(["EOB"]);
  });
  it("finds words whatever the capital letters and other spellings", () => {
    expect(marked("Deductible first, then an Explanation of Benefits.")).toEqual(["Deductible", "Explanation of Benefits"]);
    expect(marked("An out of network doctor")).toEqual(["out of network"]);
  });
  it("highlights a term once per text and never inside another word", () => {
    expect(marked("The claim and the claim again")).toEqual(["claim"]);
    expect(marked("She reclaimed it")).toEqual([]);
  });
  it("explains every word in one sentence", () => {
    for (const term of glossary) expect(term.meaning.split(/(?<=[.?])\s+(?=[A-Z])/).length, term.word).toBe(1);
  });
});
