import { describe, expect, it } from "vitest";
import { execute, runPipeline } from "../../src/language";

describe("correcciones puntuales de CoRaPri", () => {
  it("no informa SEM-021 al inicializar mediante asignación y sí al leer antes", () => {
    const initialized = runPipeline("program P { int x; x = 25; print(x); }");
    const uninitialized = runPipeline("program P { int x; print(x); }");
    expect(initialized.diagnostics).toEqual([]);
    expect(uninitialized.diagnostics[0]?.code).toBe("SEM-021");
  });

  it("conserva el valor de postfijo y devuelve el actualizado en prefijo", async () => {
    const pipeline = runPipeline("program Correcciones { int x = 10; int y = 5; int X = - --x + y++; print(X); print(x); print(y); }");
    expect(pipeline.diagnostics).toEqual([]);
    expect((pipeline.ast?.body.statements[2] as { initializer?: { kind: string } }).initializer?.kind).toBe("BinaryExpression");
    expect((await execute(pipeline.ast!)).output).toEqual(["-4", "9", "6"]);
  });

  it("normaliza secuencias de signo sin confundir --x con decremento", async () => {
    const pipeline = runPipeline("program P { int a = + + 5; int b = + - 5; int c = - + 5; int d = - - 5; int x = 2; print(a); print(b); print(c); print(d); print(--x); }");
    expect(pipeline.diagnostics).toEqual([]);
    expect((await execute(pipeline.ast!)).output).toEqual(["5", "-5", "-5", "5", "1"]);
  });

  it("mantiene int ^ int como int y calcula exponentes negativos como float", async () => {
    const pipeline = runPipeline("program P { int exacta = 2 ^ 3; float fraccion = 2 ^ -1; print(exacta); print(fraccion); }");
    expect(pipeline.diagnostics).toEqual([]);
    expect((await execute(pipeline.ast!)).output).toEqual(["8", "0.5"]);
  });

  it("ejecuta unión e intersección de arrays sin duplicados", async () => {
    const pipeline = runPipeline("program P { array<int> a = [1, 2, 2]; array<int> b = [2, 3, 1]; array<int> u = a | b; array<int> i = a & b; print(u); print(i); }");
    expect(pipeline.diagnostics).toEqual([]);
    expect((await execute(pipeline.ast!)).output).toEqual(["[1, 2, 3]", "[1, 2]"]);
  });

  it("rechaza operaciones de conjuntos entre arrays de distinto elemento", () => {
    const pipeline = runPipeline("program P { array<int> a = [1]; array<string> b = [\"x\"]; print(a | b); }");
    expect(pipeline.diagnostics.some((item) => item.code === "SEM-016")).toBe(true);
  });

  it("representa matrices como nodo propio y valida sus dimensiones", async () => {
    const valid = runPipeline("program P { matrix<int> m = [[1, 2], [3, 4]]; print(m); }");
    const declaration = valid.ast?.body.statements[0];
    expect(valid.diagnostics).toEqual([]);
    expect(declaration?.kind).toBe("VariableDeclaration");
    if (declaration?.kind === "VariableDeclaration") expect(declaration.initializer?.kind).toBe("MatrixLiteral");
    expect((await execute(valid.ast!)).output).toEqual(["[[1, 2], [3, 4]]"]);

    const ragged = runPipeline("program P { matrix<int> m = [[1, 2], [3, 4, 5]]; }");
    expect(ragged.diagnostics.some((item) => item.code === "SEM-022")).toBe(true);
  });
});
