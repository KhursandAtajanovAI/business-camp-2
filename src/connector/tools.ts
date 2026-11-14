import { analyze } from "@/engine";
import { explainFinding } from "@/explain";
import { IntakeError, parseDocument } from "@/intake";

export const NOTE =
  "Amounts are money in question, not a promise of a refund. This is not medical or legal advice.";

export const tools = [
  {
    name: "check_birth_bill",
    title: "Check birth bills",
    description:
      "Checks US birth-related medical bills and insurance explanations (EOBs) for billing mistakes. " +
      "Give the plain text of each paper. Returns findings with the money in question and a confidence level. " +
      "Read-only. Rules written in code do the checking; do not add findings of your own.",
    inputSchema: {
      type: "object",
      properties: {
        papers: { type: "array", minItems: 1, maxItems: 12, items: { type: "string" }, description: "The text of each bill or EOB, one item per paper." },
      },
      required: ["papers"],
    },
    annotations: { readOnlyHint: true, openWorldHint: false },
  },
] as const;

export type ToolResult = { content: { type: "text"; text: string }[]; isError?: boolean };

const problem = (text: string): ToolResult => ({ content: [{ type: "text", text }], isError: true });

export async function callTool(name: string, args: unknown): Promise<ToolResult> {
  if (name !== "check_birth_bill") return problem(`Unknown tool: ${name}`);
  const papers = (args as { papers?: unknown } | null)?.papers;
  if (!Array.isArray(papers) || papers.length === 0 || papers.length > 12 || !papers.every((paper) => typeof paper === "string")) {
    return problem("Please pass 'papers': a list of 1 to 12 texts, one per bill or EOB.");
  }
  try {
    const documents = await Promise.all(papers.map((paper) => parseDocument(paper as string)));
    const analysis = analyze(documents);
    const review = {
      note: NOTE,
      totalInQuestionCents: analysis.totalAtStakeCents,
      healthScore: analysis.healthScore,
      papers: analysis.documents.map((document) => ({
        id: document.id, kind: document.kind, provider: document.provider, issuedOn: document.issuedOn,
        totalCents: document.totalCents, lineCount: document.lines.length, needsReview: document.needsReview ?? [],
      })),
      findings: analysis.findings.map((finding) => ({
        title: finding.title, paperId: finding.documentId, inQuestionCents: finding.atStakeCents,
        confidence: finding.confidence, explanation: explainFinding(finding), source: finding.sourceNote,
      })),
    };
    return { content: [{ type: "text", text: JSON.stringify(review, null, 2) }] };
  } catch (error) {
    if (error instanceof IntakeError) return problem(`${error.message} ${error.nextStep}`);
    return problem("The check could not be completed. Please try again with the full text of the paper.");
  }
}
