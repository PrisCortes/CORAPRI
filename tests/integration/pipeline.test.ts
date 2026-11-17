import { describe, expect, it } from "vitest";
import { runPipeline } from "../../src/language";

describe("pipeline", () => {
  it("genera IR y optimización reales", () => {
    const result = runPipeline("program P { int x = (10 + 20) * 2; print(x); }");
    expect(result.ir?.main.length).toBeGreaterThan(0);
    expect(result.optimizedIr?.main.length).toBeGreaterThan(0);
    expect(result.optimizations.some((item) => item.rule === "Constant Folding")).toBe(true);
  });
  it("analiza el programa inicial de la interfaz", () => {
    const result = runPipeline(`program Calculadora {
      function factorial(int n) : int {
        if (n <= 1) { return 1; }
        return n * factorial(n - 1);
      }
      int numero = inputInt("Introduce un número: ");
      print("Resultado: " + factorial(numero));
    }`);
    expect(result.diagnostics).toEqual([]);
    expect(result.ast).toBeDefined();
  });
});
