import { describe, expect, it } from "vitest";
import { execute, runPipeline } from "../../src/language";

const errors = (source: string) => runPipeline(source).diagnostics.filter((item) => item.severity === "error");

describe("semántica avanzada", () => {
  it("distingue incompatibilidad, no declarada, no inicializada, duplicada, retorno, argumentos y ámbitos", () => {
    expect(errors("program P { int x = 5 / \"hola\"; }")[0]?.code).toBe("SEM-016");
    expect(errors("program P { int x = y + 1; }")[0]?.code).toBe("SEM-001");
    expect(errors("program P { int y; int x = y + 1; }")[0]?.code).toBe("SEM-021");
    expect(errors("program P { int x = 1; int x = 2; }")[0]?.code).toBe("SEM-002");
    expect(errors("program P { function f() : int { return \"hola\"; } }")[0]?.code).toBe("SEM-013");
    expect(errors("program P { function f(int x, int y) : int { return x + y; } int z = f(1, \"2\"); }")[0]?.code).toBe("SEM-020");
    expect(errors("program P { function f(int x) : int { return x; } int z = f(1, 2); }")[0]?.code).toBe("SEM-019");
    expect(errors("program P { function a() : int { int local = 1; return local; } function b() : int { return local; } }")[0]?.code).toBe("SEM-001");
  });

  it("emite advertencias configurables sin impedir análisis ni ejecución", async () => {
    const source = "program P { int x = 5; int y = 10; print(x); }";
    const withWarnings = runPipeline(source);
    const withoutWarnings = runPipeline(source, { warnings: false });
    expect(withWarnings.diagnostics.some((item) => item.code === "SEM-W001" && item.severity === "warning")).toBe(true);
    expect(withoutWarnings.diagnostics.some((item) => item.severity === "warning")).toBe(false);
    expect((await execute(withWarnings.ast!)).output).toEqual(["5"]);
  });

  it("detecta overflow estático y dinámico", async () => {
    expect(errors("program P { int x = 2147483648; }")[0]?.code).toBe("SEM-023");
    const runtime = runPipeline("program P { int x = 2147483647; x = x + 1; print(x); }", { warnings: false });
    expect(runtime.diagnostics).toEqual([]);
    expect((await execute(runtime.ast!)).diagnostics[0]?.code).toBe("RUN-016");
  });

  it("evalúa rangos de manera compacta y transforma límites e incremento", async () => {
    const result = runPipeline("program P { range<int> x = [1,...,5]; x = x * 3 + 1; print(x); }", { warnings: false });
    expect(result.diagnostics).toEqual([]);
    expect((await execute(result.ast!)).output).toEqual(["[4, 7, 10, 13, 16]"]);
  });

  it("evalúa el bloque par a partir de los valores anteriores", async () => {
    const result = runPipeline("program P { int x = 2; int y = 100; par { x = y, y = x; } print(x); print(y); }", { warnings: false });
    expect(result.diagnostics).toEqual([]);
    expect((await execute(result.ast!)).output).toEqual(["100", "2"]);
  });
});
