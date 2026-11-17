import { describe, expect, it } from "vitest";
import { runPipeline } from "../../src/language";

describe("matrices", () => {
  it("deja que el análisis semántico detecte filas incompatibles", () => {
    const result = runPipeline("program P { matrix<int> matriz = [[1,2],[3,4,5]]; }");
    expect(result.diagnostics.some((item) => item.code === "SEM-022")).toBe(true);
  });
});
