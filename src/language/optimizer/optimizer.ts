import type { IrProgram, Operand, TacInstruction } from "../ir/instructions";

export interface OptimizationRecord { rule: "Constant Folding" | "Constant Propagation" | "Algebraic Simplification" | "Unreachable Code Elimination"; before: string; after: string; instructionId: string }
export interface OptimizationResult { ir: IrProgram; records: OptimizationRecord[] }
const literal = (value: string | number | boolean): Operand => ({ kind: "literal", value });
const text = (operand: Operand): string => operand.kind === "literal" ? String(operand.value) : operand.value;
const calculate = (operator: string, a: string | number | boolean, b: string | number | boolean): string | number | boolean | undefined => { try { switch (operator) { case "+": return typeof a === "string" || typeof b === "string" ? `${a}${b}` : Number(a) + Number(b); case "-": return Number(a) - Number(b); case "*": return Number(a) * Number(b); case "/": return Number(b) === 0 ? undefined : Number(a) / Number(b); case "%": return Number(b) === 0 ? undefined : Number(a) % Number(b); case "==": return a === b; case "!=": return a !== b; case "<": return Number(a) < Number(b); case "<=": return Number(a) <= Number(b); case ">": return Number(a) > Number(b); case ">=": return Number(a) >= Number(b); case "&&": return Boolean(a) && Boolean(b); case "||": return Boolean(a) || Boolean(b); default: return undefined; } } catch { return undefined; } };
const clone = (instruction: TacInstruction): TacInstruction => ({ ...instruction }) as TacInstruction;

export const optimize = (program: IrProgram): OptimizationResult => {
  const records: OptimizationRecord[] = [];
  const optimizeList = (original: TacInstruction[]): TacInstruction[] => {
    const constants = new Map<string, Operand>(); const result: TacInstruction[] = [];
    let afterReturn = false;
    for (const source of original) {
      let instruction = clone(source);
      if (afterReturn && instruction.kind !== "Label") { records.push({ rule: "Unreachable Code Elimination", before: instruction.kind, after: "eliminada", instructionId: instruction.id }); continue; }
      if (instruction.kind === "Label") afterReturn = false;
      const replace = (operand: Operand): Operand => operand.kind !== "literal" && constants.has(operand.value) ? constants.get(operand.value)! : operand;
      if (instruction.kind === "Binary") {
        const left = replace(instruction.left), right = replace(instruction.right); if (left !== instruction.left || right !== instruction.right) records.push({ rule: "Constant Propagation", before: `${text(instruction.left)} ${instruction.operator} ${text(instruction.right)}`, after: `${text(left)} ${instruction.operator} ${text(right)}`, instructionId: instruction.id }); instruction = { ...instruction, left, right };
        if (left.kind === "literal" && right.kind === "literal") { const value = calculate(instruction.operator, left.value, right.value); if (value !== undefined) { records.push({ rule: "Constant Folding", before: `${text(left)} ${instruction.operator} ${text(right)}`, after: String(value), instructionId: instruction.id }); instruction = { kind: "Assign", id: instruction.id, span: instruction.span, target: instruction.target, value: literal(value) }; } }
        if (instruction.kind === "Binary") { const zero = (operand: Operand) => operand.kind === "literal" && operand.value === 0; const one = (operand: Operand) => operand.kind === "literal" && operand.value === 1; let value: Operand | undefined; if (instruction.operator === "+" && zero(instruction.right)) value = instruction.left; if (instruction.operator === "*" && one(instruction.right)) value = instruction.left; if (instruction.operator === "*" && (zero(instruction.left) || zero(instruction.right))) value = literal(0); if (instruction.operator === "&&" && right.kind === "literal" && right.value === true) value = left; if (value) { records.push({ rule: "Algebraic Simplification", before: `${text(instruction.left)} ${instruction.operator} ${text(instruction.right)}`, after: text(value), instructionId: instruction.id }); instruction = { kind: "Assign", id: instruction.id, span: instruction.span, target: instruction.target, value }; } }
      }
      if (instruction.kind === "Assign") { const value = replace(instruction.value); instruction = { ...instruction, value }; if (value.kind === "literal") constants.set(instruction.target, value); else constants.delete(instruction.target); }
      else if (instruction.kind === "Declare") { if (instruction.value?.kind === "literal") constants.set(instruction.name, instruction.value); else constants.delete(instruction.name); }
      else if (instruction.kind === "Return") afterReturn = true;
      else if (instruction.kind === "Call" || instruction.kind === "ArrayStore") constants.clear();
      result.push(instruction);
    }
    return result;
  };
  return { ir: { main: optimizeList(program.main), functions: program.functions.map((fn) => ({ ...fn, instructions: optimizeList(fn.instructions) })) }, records };
};
