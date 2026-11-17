import type { SourceSpan } from "../errors/diagnostic";

export type Operand = { kind: "literal"; value: string | number | boolean } | { kind: "name"; value: string } | { kind: "temp"; value: string };
export interface IrBase { id: string; span: SourceSpan; kind: string }
export interface TacBinary extends IrBase { kind: "Binary"; target: string; operator: string; left: Operand; right: Operand }
export interface TacUnary extends IrBase { kind: "Unary"; target: string; operator: string; operand: Operand }
export interface TacAssign extends IrBase { kind: "Assign"; target: string; value: Operand }
export interface TacDeclare extends IrBase { kind: "Declare"; name: string; constant: boolean; value?: Operand }
export interface TacLabel extends IrBase { kind: "Label"; name: string }
export interface TacJump extends IrBase { kind: "Jump"; label: string }
export interface TacConditionalJump extends IrBase { kind: "ConditionalJump"; condition: Operand; whenFalse: string }
export interface TacCall extends IrBase { kind: "Call"; target?: string; name: string; args: Operand[] }
export interface TacReturn extends IrBase { kind: "Return"; value?: Operand }
export interface TacPrint extends IrBase { kind: "Print"; value: Operand }
export interface TacArrayLoad extends IrBase { kind: "ArrayLoad"; target: string; array: Operand; index: Operand }
export interface TacArrayStore extends IrBase { kind: "ArrayStore"; array: Operand; index: Operand; value: Operand }
export type TacInstruction = TacBinary | TacUnary | TacAssign | TacDeclare | TacLabel | TacJump | TacConditionalJump | TacCall | TacReturn | TacPrint | TacArrayLoad | TacArrayStore;
export interface IrFunction { name: string; parameters: string[]; instructions: TacInstruction[] }
export interface IrProgram { main: TacInstruction[]; functions: IrFunction[] }
export const formatOperand = (operand: Operand): string => operand.kind === "literal" ? (typeof operand.value === "string" ? JSON.stringify(operand.value) : String(operand.value)) : operand.value;
export const formatInstruction = (instruction: TacInstruction): string => { switch (instruction.kind) { case "Binary": return `${instruction.target} = ${formatOperand(instruction.left)} ${instruction.operator} ${formatOperand(instruction.right)}`; case "Unary": return `${instruction.target} = ${instruction.operator}${formatOperand(instruction.operand)}`; case "Assign": return `${instruction.target} = ${formatOperand(instruction.value)}`; case "Declare": return `${instruction.constant ? "const " : "var "}${instruction.name}${instruction.value ? ` = ${formatOperand(instruction.value)}` : ""}`; case "Label": return `${instruction.name}:`; case "Jump": return `goto ${instruction.label}`; case "ConditionalJump": return `ifFalse ${formatOperand(instruction.condition)} goto ${instruction.whenFalse}`; case "Call": return `${instruction.target ? `${instruction.target} = ` : ""}call ${instruction.name}(${instruction.args.map(formatOperand).join(", ")})`; case "Return": return `return${instruction.value ? ` ${formatOperand(instruction.value)}` : ""}`; case "Print": return `print ${formatOperand(instruction.value)}`; case "ArrayLoad": return `${instruction.target} = ${formatOperand(instruction.array)}[${formatOperand(instruction.index)}]`; case "ArrayStore": return `${formatOperand(instruction.array)}[${formatOperand(instruction.index)}] = ${formatOperand(instruction.value)}`; } };
