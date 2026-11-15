import { afterEach, describe, expect, it, vi } from "vitest";
import { sampleAnalysis } from "@/contracts/stubs";
import { askAboutCase } from "./ask-helper";

const reply = (body: unknown, ok = true) => vi.fn(async () => ({ ok, json: async () => body }) as Response);

describe("the helper says who answered", () => {
  afterEach(() => vi.unstubAllGlobals());

  it("says 'model' only when the server says a model wrote the answer", async () => {
    vi.stubGlobal("fetch", reply({ answer: "From the model.", answeredBy: "model" }));
    expect(await askAboutCase("What is in question?", sampleAnalysis)).toEqual({ answer: "From the model.", answeredBy: "model" });
  });

  it("says 'local' when the server answered with ordinary code", async () => {
    vi.stubGlobal("fetch", reply({ answer: "From the rules.", answeredBy: "rules" }));
    expect((await askAboutCase("What is in question?", sampleAnalysis)).answeredBy).toBe("local");
  });

  it("still answers, locally, when the server cannot be reached", async () => {
    vi.stubGlobal("fetch", vi.fn(async () => { throw new Error("offline"); }));
    const result = await askAboutCase("How much is in question?", sampleAnalysis);
    expect(result.answeredBy).toBe("local");
    expect(result.answer.length).toBeGreaterThan(10);
  });
});
