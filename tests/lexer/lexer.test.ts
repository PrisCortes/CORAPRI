import { describe, expect, it } from "vitest";
import { lex } from "../../src/language";

describe("lexer CORAPRI", () => {
  it("ignora comentarios de línea y bloque estándar, y reporta bloque sin cerrar", () => {
    expect(lex("program P { // nota\n int x = 1; /* nota */ }").diagnostics).toEqual([]);
    expect(lex("program P { /* sin cerrar").diagnostics[0]?.code).toBe("LEX-004");
  });
  it("reconoce palabras clave, literales y comentarios", () => {
    const result = lex("program Demo { // nota\n int x = 12; string s = \"ok\"; }");
    expect(result.diagnostics).toEqual([]);
    expect(result.tokens.map((token) => token.kind)).toContain("PROGRAM");
    expect(result.tokens.map((token) => token.kind)).toContain("STRING_LITERAL");
  });
  it("reporta caracteres no reconocidos", () => expect(lex("@").diagnostics[0]?.code).toBe("LEX-001"));
  it("reconoce los operadores nuevos mediante AFN sin afectar los operadores existentes", () => {
    const result = lex("a+b a-b a*b a/b a^b A|B A&B root log");
    expect(result.diagnostics).toEqual([]);
    expect(result.tokens.map((token) => token.kind)).toEqual(["IDENTIFIER", "PLUS", "IDENTIFIER", "IDENTIFIER", "MINUS", "IDENTIFIER", "IDENTIFIER", "STAR", "IDENTIFIER", "IDENTIFIER", "SLASH", "IDENTIFIER", "IDENTIFIER", "POWER", "IDENTIFIER", "IDENTIFIER", "UNION", "IDENTIFIER", "IDENTIFIER", "INTERSECTION", "IDENTIFIER", "ROOT", "LOG", "EOF"]);
    expect(result.traces.find((trace) => trace.lexeme === "^")?.machine).toBe("PowerNFA");
  });
  it("conserva incremento y decremento como operadores distintos", () => {
    const valid = lex("++ a -- a a ++ a --");
    expect(valid.diagnostics).toEqual([]);
    expect(valid.tokens.map((token) => token.kind)).toEqual(["INCREMENT", "IDENTIFIER", "DECREMENT", "IDENTIFIER", "IDENTIFIER", "INCREMENT", "IDENTIFIER", "DECREMENT", "EOF"]);
    const compact = lex("++a --a a++ a--");
    expect(compact.diagnostics).toEqual([]);
    expect(compact.tokens.map((token) => token.kind)).toEqual(["INCREMENT", "IDENTIFIER", "DECREMENT", "IDENTIFIER", "IDENTIFIER", "INCREMENT", "IDENTIFIER", "DECREMENT", "EOF"]);
  });
  it("tokeniza las notaciones prefija y postfija sin atribuirles sintaxis", () => {
    const result = lex("+ a b - a b * a b / a b ^ a b | A B & A B root 2 9 log 2 8 a b + a b ^ A B |");
    expect(result.diagnostics).toEqual([]);
    expect(result.tokens.map((token) => token.kind)).toContain("POWER");
    expect(result.tokens.map((token) => token.kind)).toContain("UNION");
    expect(result.tokens.map((token) => token.kind)).toContain("INTERSECTION");
    expect(result.tokens.map((token) => token.kind)).toContain("ROOT");
    expect(result.tokens.map((token) => token.kind)).toContain("LOG");
  });
  it("normaliza ley de signos sin convertir ++ o --", () => {
    const signs = lex("a - - b + + 5");
    expect(signs.originalTokens.map((token) => token.kind)).toEqual(["IDENTIFIER", "MINUS", "MINUS", "IDENTIFIER", "PLUS", "PLUS", "INTEGER_LITERAL", "EOF"]);
    expect(signs.tokens.map((token) => token.kind)).toEqual(["IDENTIFIER", "PLUS", "IDENTIFIER", "PLUS", "INTEGER_LITERAL", "EOF"]);
    expect(signs.signNormalizations.map((change) => change.rule)).toEqual(["- - → +", "+ + → +"]);
    expect(lex("-- a").tokens[0]?.kind).toBe("DECREMENT");
  });
  it("rechaza números y literales inválidos sin expresiones regulares", () => {
    expect(lex("'a'").tokens[0]?.kind).toBe("CHAR_LITERAL");
    expect(lex("12.3.4").diagnostics[0]?.code).toBe("LEX-002");
    expect(lex("\"sin cerrar").diagnostics[0]?.code).toBe("LEX-003");
    expect(lex("'ab'").diagnostics[0]?.code).toBe("LEX-005");
  });
  it("distingue floats con punto inicial y fronteras entre floats", () => {
    expect(lex(".5").tokens[0]?.kind).toBe("FLOAT_LITERAL");
    expect(lex("5.").diagnostics[0]?.code).toBe("LEX-002");
    expect(lex("2.34 .81 .2").tokens.map((token) => token.kind)).toEqual(["FLOAT_LITERAL", "FLOAT_LITERAL", "FLOAT_LITERAL", "EOF"]);
  });
  it("se detiene después del primer error léxico", () => {
    const result = lex("int x = 1; int y = @; int z = 2;");
    expect(result.diagnostics).toHaveLength(1);
    expect(result.tokens.some((token) => token.lexeme === "z")).toBe(false);
  });
});
