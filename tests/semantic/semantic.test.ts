import { describe, expect, it } from "vitest";
import { runPipeline } from "../../src/language";

describe("análisis semántico", () => {
  it("admite funciones llamadas antes de su declaración", () => {
    const result = runPipeline("program P { int x = sumar(1, 2); function sumar(int a, int b) : int { return a + b; } }");
    expect(result.diagnostics.filter((item) => item.severity === "error")).toEqual([]);
  });
  it("rechaza reasignar constantes", () => expect(runPipeline("program P { const int A = 1; A = 2; }").diagnostics.some((item) => item.code === "SEM-008")).toBe(true));
});
