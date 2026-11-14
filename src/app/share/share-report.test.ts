import { describe, expect, it } from "vitest";
import { checkSample } from "../_pipeline/check-papers";
import { makeReport, readReport, reportPath } from "./share-report";

describe("a shared report", () => {
  it("carries numbers only: no provider, no line text, no ids", async () => {
    const analysis = await checkSample();
    const path = reportPath(makeReport(analysis));
    expect(path).toMatch(/^\/share\?things=\d+&cents=\d+&papers=\d+&health=\d+&sample=1$/);
    const personal = [analysis.documents[0].provider, analysis.documents[0].id, ...analysis.documents[0].lines.map((line) => line.description)];
    for (const piece of personal) expect(decodeURIComponent(path)).not.toContain(piece);
  });

  it("reads back exactly what was shared", async () => {
    const report = makeReport(await checkSample());
    const query = Object.fromEntries(new URLSearchParams(reportPath(report).split("?")[1]));
    expect(readReport(query)).toEqual(report);
  });

  it("refuses words, scripts and silly numbers in the address", () => {
    expect(readReport({ things: "Jane Sample", cents: "1", papers: "1", health: "90" })).toBeNull();
    expect(readReport({ things: "<b>3</b>", cents: "1", papers: "1", health: "90" })).toBeNull();
    expect(readReport({ things: "3", cents: "1", papers: "1", health: "900" })).toBeNull();
    expect(readReport({})).toBeNull();
  });
});
