// The one road every paper takes, a sample and a real upload alike:
// read it (src/intake) -> look for things worth asking about (src/engine).
import type { Analysis, ParsedDocument } from "@/contracts";
import { analyze } from "@/engine";
import { parseDocument } from "@/intake";
import { demoSets } from "@content/demo-documents";

export async function readPaper(input: File | string, isDemo = false): Promise<ParsedDocument> {
  return parseDocument(input, { isDemo });
}

export function checkPapers(documents: ParsedDocument[]): Analysis {
  return analyze(documents);
}

// Adding a paper again replaces the old copy instead of doubling it.
export function addPaper(documents: ParsedDocument[], paper: ParsedDocument): ParsedDocument[] {
  return [...documents.filter((document) => document.id !== paper.id), paper];
}

// The "try it on an example" button: the first synthetic set (a hospital bill and its
// insurance explanation) goes through exactly the same steps as a real upload.
export async function checkSample(): Promise<Analysis> {
  const papers = await Promise.all(demoSets[0].papers.map((paper) => readPaper(paper.text, true)));
  return checkPapers(papers);
}
