import { describe, expect, it } from "vitest";
import { runPipeline } from "../../src/language/pipeline/pipeline";
import { execute } from "../../src/language/interpreter/interpreter";

describe("POO y funciones de orden superior", () => {
  it("crea instancias, ejecuta constructor y despacha métodos heredados", async () => {
    const source = `program Demo {
      class Base { int value; constructor(int initial) { this.value = initial; } function get() : int { return this.value; } }
      class Child extends Base { function twice() : int { return this.value * 2; } }
      Child item = new Child(7);
      print(item.get());
      print(item.twice());
    }`;
    const pipeline = runPipeline(source, { warnings: false });
    expect(pipeline.diagnostics.filter((item) => item.severity === "error")).toEqual([]);
    const result = await execute(pipeline.ast!);
    expect(result.diagnostics).toEqual([]);
    expect(result.output).toEqual(["7", "14"]);
  });

  it("ejecuta lambdas con map, filter, reduce y listas funcionales", async () => {
    const source = `program Funciones {
      array<int> values = [1, 2, 3, 4];
      array<int> doubled = map(values, lambda(x) => x * 2);
      array<int> even = filter(doubled, lambda(x) => x % 4 == 0);
      print(head(even));
      print(reduce(even, lambda(a, b) => a + b, 0));
      print(tail(even));
    }`;
    const pipeline = runPipeline(source, { warnings: false });
    expect(pipeline.diagnostics.filter((item) => item.severity === "error")).toEqual([]);
    const result = await execute(pipeline.ast!);
    expect(result.diagnostics).toEqual([]);
    expect(result.output).toEqual(["4", "12", "[8]"]);
  });
});
