import { execute } from "../language/interpreter/interpreter";
import { runPipeline } from "../language/pipeline/pipeline";

export interface BrowserTestResult { name: string; passed: boolean; detail: string }
const cases: readonly { name: string; run: () => Promise<void> }[] = [
  { name: "Lexer: tokens válidos", run: async () => { if (runPipeline("program P { int x = 1; }").diagnostics.length) throw new Error("El programa válido produjo errores."); } },
  { name: "Parser: precedencia", run: async () => { const result = runPipeline("program P { int x = 2 + 3 * 4; }"); if (!result.ast || result.diagnostics.length) throw new Error("No se generó AST válido."); } },
  { name: "Semantic: constante", run: async () => { if (!runPipeline("program P { const int X = 1; X = 2; }").diagnostics.some((item) => item.code === "SEM-008")) throw new Error("No se detectó reasignación."); } },
  { name: "Interpreter: funciones", run: async () => { const result = runPipeline("program P { function f(int n) : int { return n + 1; } print(f(4)); }"); const run = await execute(result.ast!); if (run.output[0] !== "5") throw new Error("Salida esperada: 5."); } },
  { name: "Runtime: división por cero", run: async () => { const result = runPipeline("program P { print(1 / 0); }"); const run = await execute(result.ast!); if (run.diagnostics[0]?.code !== "RUN-005") throw new Error("No se detectó división por cero."); } },
];
export const runBrowserSuite = async (): Promise<BrowserTestResult[]> => Promise.all(cases.map(async (test) => { try { await test.run(); return { name: test.name, passed: true, detail: "OK" }; } catch (error) { return { name: test.name, passed: false, detail: error instanceof Error ? error.message : "Error desconocido" }; } }));
