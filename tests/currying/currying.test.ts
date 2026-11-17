import { describe, expect, it } from "vitest";
import { execute, runLexicalAnalysis, runSyntaxAnalysis, runPipeline } from "../../src/language";

describe("currificación y frontera léxico-sintáctica", () => {
  const program = `program Currificacion {
    function sumar3(int a, int b, int c) : int { return a + b + c; }
    int normal = sumar3(6, 4, 2);
    int currificada = sumar3(6)(4)(2);
    print(normal);
    print(currificada);
  }`;

  it("conserva llamadas convencionales y ejecuta llamadas currificadas", async () => {
    const result = runPipeline(program);
    expect(result.diagnostics).toEqual([]);
    expect((await execute(result.ast!)).output).toEqual(["12", "12"]);
  });

  it("construye CallExpression anidados usando exactamente los tokens del lexer", () => {
    const lexical = runLexicalAnalysis(program);
    const syntax = runSyntaxAnalysis(program, lexical);
    expect(syntax.tokens).toBe(lexical.tokens);
    const declaration = syntax.ast?.body.statements[2];
    expect(declaration?.kind).toBe("VariableDeclaration");
    if (declaration?.kind === "VariableDeclaration") {
      expect(declaration.initializer?.kind).toBe("CallExpression");
      if (declaration.initializer?.kind === "CallExpression") expect(declaration.initializer.callee.kind).toBe("CallExpression");
    }
  });

  it("bloquea parser cuando el lexer falla y conserva el primer error sintáctico", () => {
    const lexicalError = runSyntaxAnalysis("program P { int x = @; }");
    expect(lexicalError.completed).toEqual(["lexer"]);
    expect(lexicalError.ast).toBeUndefined();
    const syntaxError = runSyntaxAnalysis("program P { int x = sumar3(6)(4)(; }");
    expect(syntaxError.diagnostics).toHaveLength(1);
    expect(syntaxError.diagnostics[0]?.phase).toBe("SYNTAX");
    expect(syntaxError.diagnostics[0]?.expected).toBe("expresión");
  });
});
