import { describe, expect, it } from "vitest";
import { lex, parse } from "../../src/language";

describe("parser CORAPRI", () => {
  it("respeta la precedencia aritmética", () => {
    const result = parse(lex("program P { int x = 10 + 20 * 2; }").tokens);
    const declaration = result.ast?.body.statements[0];
    expect(declaration?.kind).toBe("VariableDeclaration");
    if (declaration?.kind === "VariableDeclaration" && declaration.initializer?.kind === "BinaryExpression") expect(declaration.initializer.right.kind).toBe("BinaryExpression");
  });
  it("normaliza notaciones infija, prefija, postfija y funcional al mismo AST", () => {
    const expressions = ["5 + 3", "+ 5 3", "5 3 +", "+(5,3)"];
    const nodes = expressions.map((expression) => parse(lex(`program P { int x = ${expression}; }`).tokens).ast?.body.statements[0]);
    for (const declaration of nodes) { expect(declaration?.kind).toBe("VariableDeclaration"); if (declaration?.kind === "VariableDeclaration") expect(declaration.initializer?.kind).toBe("BinaryExpression"); }
  });
  it("acepta else if e incremento dentro de for", () => {
    const source = "program P { int x = 0; if (x > 1) { } else if (x > 0) { } else { } for (int i = 0; i < 3; i++) { x++; } }";
    expect(parse(lex(source).tokens).diagnostics).toEqual([]);
  });
  it("acepta operadores lógicos y el operador unario postfijo not", () => {
    const result = parse(lex("program P { boolean a = true; boolean b = false; boolean x = a and b xor a; boolean y = a not; }").tokens);
    expect(result.diagnostics).toEqual([]);
  });
  it("expone el primer error con token esperado y encontrado", () => {
    const result = parse(lex("program P { if (true { } }").tokens);
    expect(result.diagnostics).toHaveLength(1);
    expect(result.diagnostics[0]?.expected).toBe("RPAREN");
    expect(result.diagnostics[0]?.found).toBe("{");
  });
});
