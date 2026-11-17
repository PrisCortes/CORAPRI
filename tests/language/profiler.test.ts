import { describe, expect, it } from "vitest";
import { profileExecution, runPipeline } from "../../src/language";

describe("perfilador del intérprete", () => {
  it("acumula visitas por línea sin alterar la ejecución", async () => {
    const pipeline = runPipeline("program P { int x = 1; while (x < 4) { x++; } print(x); }", { warnings: false });
    const report = await profileExecution(pipeline.ast!);
    expect(report.execution.output).toEqual(["4"]);
    expect(report.steps).toBeGreaterThan(4);
    expect(report.entries.some((entry) => entry.hits > 1)).toBe(true);
  });
});
