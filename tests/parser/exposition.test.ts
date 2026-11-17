import { describe, expect, it } from "vitest";
import { lex, parse } from "../../src/language";

const syntax = (source: string) => parse(lex(source).tokens);

describe("muestras de exposición sintáctica", () => {
  const valid = [
    "program P { print(\"Hola\"); }",
    "program P { int x = inputInt(\"Número: \" ); }",
    "program P { int x = 5 + 3; }",
    "program P { boolean a = true; boolean b = false; boolean r = a and not b; }",
    "program P { int x = 1; if (x < 5) { } else { } }",
    "program P { int x = 0; while (x < 5) { x++; } }",
    "program P { for (int i = 0; i < 5; i++) { } }",
    "program P { int x = 1; boolean r = x <= 10; }",
    "program P { int x; x = 10; }",
    "program P { const int MAX = 100; }",
    "program P { function suma(int a, int b) : int { return a + b; } }",
    "program P { float r = root(2, 9); }",
    "program P { function f(int a, int b, int c) : int { return a + b + c; } int x = f(1)(2)(3); }",
  ];
  const invalid = [
    "program P { print(; }",
    "program P { int x = inputInt(\"Número: \"; }",
    "program P { int x = 5 + ; }",
    "program P { boolean a = true; boolean r = a and ; }",
    "program P { int x = 1; if (x < 5 { } }",
    "program P { int x = 0; while (x < 5 { x++; } }",
    "program P { for (int i = 0 i < 5; i++) { } }",
    "program P { int x = 1; boolean r = x <= ; }",
    "program P { int x; x = ; }",
    "program P { const int MAX = ; }",
    "program P { function suma(int a, int b : int { return a + b; } }",
    "program P { float r = root(2, ); }",
    "program P { function f(int a, int b, int c) : int { return a + b + c; } int x = f(1)(2)(; }",
  ];

  it.each(valid)("acepta %s", (source) => expect(syntax(source).diagnostics).toEqual([]));
  it.each(invalid)("rechaza %s con un único diagnóstico contextual", (source) => {
    const result = syntax(source);
    expect(result.diagnostics).toHaveLength(1);
    expect(result.diagnostics[0]?.phase).toBe("SYNTAX");
    expect(result.diagnostics[0]?.line).toBeGreaterThan(0);
    expect(result.diagnostics[0]?.found).toBeTruthy();
  });
});
