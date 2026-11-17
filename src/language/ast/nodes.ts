import type { SourceSpan } from "../errors/diagnostic";

export type PrimitiveTypeName = "int" | "float" | "string" | "char" | "boolean" | "void";
export type ValueType = { kind: "int" } | { kind: "float" } | { kind: "string" } | { kind: "char" } | { kind: "boolean" };
export type NumericValueType = Extract<ValueType, { kind: "int" | "float" }>;
export type CorapriType = ValueType | { kind: "void" } | { kind: "fn" } | { kind: "class"; name: string } | { kind: "array"; element: ValueType } | { kind: "matrix"; element: ValueType } | { kind: "range"; element: NumericValueType };
export const UNKNOWN_TYPE: CorapriType = { kind: "void" };

export interface NodeBase extends SourceSpan { id: string; kind: string }
export interface ProgramNode extends NodeBase { kind: "Program"; name: string; body: BlockNode }
export interface BlockNode extends NodeBase { kind: "Block"; statements: Statement[] }
export interface TypeNode extends NodeBase { kind: "Type"; type: CorapriType }
export interface VariableDeclarationNode extends NodeBase { kind: "VariableDeclaration"; declaredType: TypeNode; name: string; initializer?: Expression }
export interface ConstantDeclarationNode extends NodeBase { kind: "ConstantDeclaration"; declaredType: TypeNode; name: string; initializer: Expression }
export interface FunctionDeclarationNode extends NodeBase { kind: "FunctionDeclaration"; name: string; parameters: ParameterNode[]; returnType: TypeNode; body: BlockNode }
export interface ClassDeclarationNode extends NodeBase { kind: "ClassDeclaration"; name: string; superclass?: string; fields: Array<VariableDeclarationNode | ConstantDeclarationNode>; methods: FunctionDeclarationNode[]; constructorMethod?: FunctionDeclarationNode }
export interface ParameterNode extends NodeBase { kind: "Parameter"; name: string; declaredType: TypeNode }
export interface AssignmentNode extends NodeBase { kind: "Assignment"; target: IdentifierNode | ArrayAccessNode | MemberExpressionNode; value: Expression }
export interface AssignmentGroupNode extends NodeBase { kind: "AssignmentGroup"; assignments: AssignmentNode[] }
export interface ParallelNode extends NodeBase { kind: "Parallel"; assignments: AssignmentNode[] }
export interface ParallelTasksNode extends NodeBase { kind: "ParallelTasks"; tasks: BlockNode[] }
export interface IfNode extends NodeBase { kind: "If"; condition: Expression; thenBranch: Statement; elseBranch?: Statement }
export interface WhileNode extends NodeBase { kind: "While"; condition: Expression; body: Statement }
export interface DoWhileNode extends NodeBase { kind: "DoWhile"; body: Statement; condition: Expression }
export interface ForNode extends NodeBase { kind: "For"; initializer?: VariableDeclarationNode | AssignmentNode; condition?: Expression; update?: AssignmentNode | Expression; body: Statement }
export interface ReturnNode extends NodeBase { kind: "Return"; value?: Expression }
export interface PrintNode extends NodeBase { kind: "Print"; value: Expression }
export interface ExpressionStatementNode extends NodeBase { kind: "ExpressionStatement"; expression: Expression }
export interface ErrorStatementNode extends NodeBase { kind: "ErrorStatement" }
export type Statement = BlockNode | VariableDeclarationNode | ConstantDeclarationNode | FunctionDeclarationNode | ClassDeclarationNode | AssignmentNode | AssignmentGroupNode | ParallelNode | ParallelTasksNode | IfNode | WhileNode | DoWhileNode | ForNode | ReturnNode | PrintNode | ExpressionStatementNode | ErrorStatementNode;

export interface BinaryExpressionNode extends NodeBase { kind: "BinaryExpression"; operator: string; left: Expression; right: Expression }
export interface UnaryExpressionNode extends NodeBase { kind: "UnaryExpression"; operator: string; operand: Expression }
/** A mutation expression keeps its position so postfix and prefix have distinct values. */
export interface UpdateExpressionNode extends NodeBase { kind: "UpdateExpression"; operator: "++" | "--"; argument: Expression; prefix: boolean }
export interface LiteralNode extends NodeBase { kind: "Literal"; value: number | string | boolean; literalType: PrimitiveTypeName }
export interface IdentifierNode extends NodeBase { kind: "Identifier"; name: string }
export interface CallExpressionNode extends NodeBase { kind: "CallExpression"; callee: Expression; arguments: Expression[] }
export interface MemberExpressionNode extends NodeBase { kind: "MemberExpression"; object: Expression; property: string }
export interface NewExpressionNode extends NodeBase { kind: "NewExpression"; className: string; arguments: Expression[] }
export interface LambdaExpressionNode extends NodeBase { kind: "LambdaExpression"; parameters: ParameterNode[]; body: Expression }
export interface ArrayLiteralNode extends NodeBase { kind: "ArrayLiteral"; elements: Expression[] }
export interface MatrixLiteralNode extends NodeBase { kind: "MatrixLiteral"; rows: ArrayLiteralNode[] }
export interface RangeExpressionNode extends NodeBase { kind: "RangeExpression"; startValue: Expression; endValue: Expression }
export interface ArrayAccessNode extends NodeBase { kind: "ArrayAccess"; array: Expression; index: Expression }
export interface ErrorExpressionNode extends NodeBase { kind: "ErrorExpression" }
export type Expression = BinaryExpressionNode | UnaryExpressionNode | UpdateExpressionNode | LiteralNode | IdentifierNode | CallExpressionNode | MemberExpressionNode | NewExpressionNode | LambdaExpressionNode | ArrayLiteralNode | MatrixLiteralNode | RangeExpressionNode | ArrayAccessNode | ErrorExpressionNode;

export type AstNode = ProgramNode | Statement | Expression | TypeNode | ParameterNode;
let nextId = 1;
export const node = <T>(value: T): T & { id: string } => ({ ...value, id: `n${nextId++}` });
export const typeToString = (type: CorapriType): string => type.kind === "array" || type.kind === "matrix" || type.kind === "range" ? `${type.kind}<${typeToString(type.element)}>` : type.kind === "class" ? type.name : type.kind;
