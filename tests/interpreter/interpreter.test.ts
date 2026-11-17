import { describe, expect, it } from "vitest";
import { execute, runPipeline } from "../../src/language";

describe("intérprete", () => {
  it("ejecuta funciones recursivas", async () => {
    const pipeline = runPipeline("program P { function f(int n) : int { if (n <= 1) { return 1; } return n * f(n - 1); } print(f(5)); }");
    expect(pipeline.diagnostics).toEqual([]);
    const execution = await execute(pipeline.ast!);
    expect(execution.output).toEqual(["120"]);
  });
  it("controla división por cero", async () => {
    const pipeline = runPipeline("program P { int x = 1 / 0; print(x); }");
    const execution = await execute(pipeline.ast!);
    expect(execution.diagnostics[0]?.code).toBe("RUN-005");
  });
  it("ejecuta operadores lógicos por palabra e incremento", async () => {
    const pipeline = runPipeline("program P { int x = 1; x++; boolean r = true xor false; print(x); print(r); }");
    expect(pipeline.diagnostics).toEqual([]);
    const execution = await execute(pipeline.ast!);
    expect(execution.output).toEqual(["2", "true"]);
  });
});
