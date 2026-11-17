import type { AstNode, ClassDeclarationNode, CorapriType, Expression, FunctionDeclarationNode, NumericValueType, ProgramNode, Statement, ValueType } from "../ast/nodes";
import { typeToString } from "../ast/nodes";
import { diagnostic, type CompilerDiagnostic } from "../errors/diagnostic";
import { SymbolTable, type ScopeSnapshot, type SymbolEntry } from "../symbols/symbol-table";

export interface SemanticResult { diagnostics: CompilerDiagnostic[]; symbols: ScopeSnapshot[]; bindings: ReadonlyMap<string, SymbolEntry>; expressionTypes: ReadonlyMap<string, CorapriType> }
export interface SemanticOptions { warnings?: boolean }
/** CoRaPri int values use the signed 32-bit range; float values must be finite. */
export const INTEGER_MIN = -2_147_483_648; export const INTEGER_MAX = 2_147_483_647;
const bool: ValueType = { kind: "boolean" }; const int: NumericValueType = { kind: "int" }; const voidType: CorapriType = { kind: "void" };
const same = (a: CorapriType, b: CorapriType): boolean => (a.kind === "array" && b.kind === "array") || (a.kind === "matrix" && b.kind === "matrix") || (a.kind === "range" && b.kind === "range") ? same(a.element, b.element) : a.kind === b.kind;
const assignable = (target: CorapriType, value: CorapriType): boolean => same(target, value) || (target.kind === "float" && value.kind === "int");
const isNumeric = (type: CorapriType): type is NumericValueType => type.kind === "int" || type.kind === "float";
const asValueType = (type: CorapriType): ValueType => type.kind === "int" || type.kind === "float" || type.kind === "string" || type.kind === "char" || type.kind === "boolean" ? type : int;

export class SemanticAnalyzer {
  private readonly diagnostics: CompilerDiagnostic[] = []; private readonly table = new SymbolTable();
  private readonly bindings = new Map<string, SymbolEntry>(); private readonly expressionTypes = new Map<string, CorapriType>(); private readonly classes = new Map<string, ClassDeclarationNode>();
  private currentScope = this.table.global; private currentReturn: CorapriType | undefined; private functionDepth = 0;
  constructor(private readonly options: SemanticOptions = {}) {}
  analyze(program: ProgramNode): SemanticResult {
    for (const statement of program.body.statements) { if (statement.kind === "FunctionDeclaration") this.defineFunction(statement); if (statement.kind === "ClassDeclaration") this.classes.set(statement.name, statement); }
    for (const statement of program.body.statements) this.statement(statement);
    if (this.options.warnings !== false) for (const scope of this.table.allScopes) for (const symbol of scope.symbols.values()) if ((symbol.kind === "variable" || symbol.kind === "constant") && symbol.reads === 0) this.warning(symbol.declaredAt, "SEM-W001", `La variable '${symbol.name}' fue declarada pero nunca se utilizó.`);
    return { diagnostics: this.diagnostics, symbols: this.table.snapshot(), bindings: this.bindings, expressionTypes: this.expressionTypes };
  }
  private defineFunction(declaration: FunctionDeclarationNode): void { const parameters = declaration.parameters.map((parameter) => parameter.declaredType.type); const entry = this.table.symbol(declaration.name, "function", declaration.returnType.type, this.currentScope, declaration, false, true, parameters, declaration.returnType.type); if (!this.currentScope.define(entry)) this.error(declaration, "SEM-002", `La función '${declaration.name}' ya fue declarada en este ámbito.`); else this.bindings.set(declaration.id, entry); }
  private statement(statement: Statement): void {
    switch (statement.kind) {
      case "Block": this.withScope("block", "block", () => statement.statements.forEach((item) => this.statement(item))); break;
      case "VariableDeclaration": this.declareVariable(statement, false); break;
      case "ConstantDeclaration": this.declareVariable(statement, true); break;
      case "FunctionDeclaration": if (this.functionDepth === 0) this.function(statement); else this.error(statement, "SEM-017", "Las funciones solo pueden declararse en el nivel del programa."); break;
      case "ClassDeclaration": break;
      case "Assignment": this.assignment(statement); break;
      case "AssignmentGroup": statement.assignments.forEach((item) => this.assignment(item)); break;
      case "Parallel": statement.assignments.forEach((item) => this.assignment(item)); break;
      case "If": this.condition(statement.condition); this.statement(statement.thenBranch); if (statement.elseBranch) this.statement(statement.elseBranch); break;
      case "While": this.condition(statement.condition); this.withScope("loop", "while", () => this.statement(statement.body)); break;
      case "DoWhile": this.withScope("loop", "do-while", () => this.statement(statement.body)); this.condition(statement.condition); break;
      case "For": this.withScope("loop", "for", () => { if (statement.initializer) this.statement(statement.initializer); if (statement.condition) this.condition(statement.condition); if (statement.update) statement.update.kind === "Assignment" ? this.assignment(statement.update) : this.expression(statement.update); this.statement(statement.body); }); break;
      case "Return": this.returnStatement(statement); break;
      case "Print": this.expression(statement.value); break;
      case "ExpressionStatement": this.expression(statement.expression); break;
      case "ErrorStatement": break;
    }
  }
  private declareVariable(statement: Extract<Statement, { kind: "VariableDeclaration" | "ConstantDeclaration" }>, isConst: boolean): void {
    const declared = statement.declaredType.type; if (declared.kind === "void") { this.error(statement, "SEM-003", "No se pueden declarar variables de tipo void."); return; }
    const entry = this.table.symbol(statement.name, isConst ? "constant" : "variable", declared, this.currentScope, statement, isConst, Boolean(statement.initializer));
    if (!this.currentScope.define(entry)) { this.error(statement, "SEM-002", `El identificador '${statement.name}' ya existe en este ámbito.`); return; }
    this.bindings.set(statement.id, entry);
    if (statement.initializer) { const actual = this.expression(statement.initializer, declared); if (!assignable(declared, actual)) this.error(statement.initializer, "SEM-004", `No se puede asignar ${typeToString(actual)} a ${typeToString(declared)}.`); }
  }
  private function(declaration: FunctionDeclarationNode): void {
    const entry = this.currentScope.symbols.get(declaration.name); if (!entry) return;
    this.withScope("function", declaration.name, () => { const previousReturn = this.currentReturn; this.currentReturn = declaration.returnType.type; this.functionDepth++; for (const parameter of declaration.parameters) { if (parameter.declaredType.type.kind === "void") this.error(parameter, "SEM-005", "Un parámetro no puede ser void."); const item = this.table.symbol(parameter.name, "parameter", parameter.declaredType.type, this.currentScope, parameter, false, true); if (!this.currentScope.define(item)) this.error(parameter, "SEM-002", `El parámetro '${parameter.name}' está duplicado.`); else this.bindings.set(parameter.id, item); } for (const bodyStatement of declaration.body.statements) this.statement(bodyStatement); if (declaration.returnType.type.kind !== "void" && !this.guaranteedReturn(declaration.body)) this.error(declaration, "SEM-006", `La función '${declaration.name}' debe retornar ${typeToString(declaration.returnType.type)} en todos sus caminos.`); this.functionDepth--; this.currentReturn = previousReturn; });
  }
  private assignment(statement: Extract<Statement, { kind: "Assignment" }>): void {
    const targetType = this.assignableTarget(statement.target); const valueType = this.expression(statement.value, targetType);
    if (!targetType || !assignable(targetType, valueType)) { if (targetType) this.error(statement.value, "SEM-007", `Asignación incompatible: se esperaba ${typeToString(targetType)} y se obtuvo ${typeToString(valueType)}.`); return; }
    if (statement.target.kind === "Identifier") { const symbol = this.resolveWrite(statement.target); if (symbol) symbol.initialized = true; }
  }
  private assignableTarget(target: Extract<Expression, { kind: "Identifier" | "ArrayAccess" | "MemberExpression" }>): CorapriType | undefined {
    if (target.kind === "Identifier") { const symbol = this.resolveWrite(target); if (!symbol) return undefined; if (symbol.isConst) this.error(target, "SEM-008", `No se puede reasignar la constante '${symbol.name}'.`); return symbol.type; }
    if (target.kind === "MemberExpression") { this.error(target, "SEM-030", "Los atributos requieren una instancia de clase válida."); return undefined; }
    const arrayType = this.expression(target.array); const indexType = this.expression(target.index); if (arrayType.kind !== "array") { this.error(target.array, "SEM-009", "Solo se pueden indexar arrays."); return undefined; } if (indexType.kind !== "int") this.error(target.index, "SEM-010", "El índice de un array debe ser int."); return arrayType.element;
  }
  private condition(expression: Expression): void { const type = this.expression(expression); if (type.kind !== "boolean") this.error(expression, "SEM-011", "La condición debe ser de tipo boolean."); }
  private returnStatement(statement: Extract<Statement, { kind: "Return" }>): void { if (!this.currentReturn) { this.error(statement, "SEM-012", "return solo puede usarse dentro de una función."); return; } const value = statement.value ? this.expression(statement.value, this.currentReturn) : voidType; if (!assignable(this.currentReturn, value)) this.error(statement, "SEM-013", `El retorno debe ser ${typeToString(this.currentReturn)}.`); }
  private expression(expression: Expression, expected?: CorapriType): CorapriType {
    let result: CorapriType = voidType;
    switch (expression.kind) {
      case "Literal": { result = { kind: expression.literalType }; if (typeof expression.value === "number" && ((expression.literalType === "int" && (!Number.isInteger(expression.value) || expression.value < INTEGER_MIN || expression.value > INTEGER_MAX)) || (expression.literalType === "float" && !Number.isFinite(expression.value)))) this.error(expression, "SEM-023", "Desbordamiento numérico en literal."); break; }
      case "Identifier": { const symbol = this.resolve(expression); result = symbol?.type ?? voidType; break; }
      case "ArrayLiteral": { if (expression.elements.length === 0) { if (expected?.kind === "array") result = expected; else { this.error(expression, "SEM-014", "No se puede inferir el tipo de un array vacío."); result = { kind: "array", element: int }; } } else { const element = this.expression(expression.elements[0]!); for (const item of expression.elements.slice(1)) { const actual = this.expression(item, element); if (!assignable(element, actual) || !assignable(actual, element)) this.error(item, "SEM-015", "Todos los elementos del array deben tener el mismo tipo."); } result = { kind: "array", element: asValueType(element) }; } break; }
      case "MatrixLiteral": { result = this.matrix(expression, expected); break; }
      case "RangeExpression": { const start = this.expression(expression.startValue); const end = this.expression(expression.endValue); if (!isNumeric(start) || !isNumeric(end)) { this.error(expression, "SEM-024", "Los límites de un rango deben ser numéricos."); result = { kind: "range", element: int }; } else { const element: NumericValueType = start.kind === "float" || end.kind === "float" ? { kind: "float" } : int; result = { kind: "range", element }; } break; }
      case "ArrayAccess": { const arrayType = this.expression(expression.array); const indexType = this.expression(expression.index); if (arrayType.kind !== "array") this.error(expression.array, "SEM-009", "Solo se pueden indexar arrays."); if (indexType.kind !== "int") this.error(expression.index, "SEM-010", "El índice de un array debe ser int."); result = arrayType.kind === "array" ? arrayType.element : voidType; break; }
      case "UnaryExpression": { const operand = this.expression(expression.operand); if (["!", "not"].includes(expression.operator) && operand.kind !== "boolean") this.error(expression, "SEM-016", "El operador lógico requiere boolean."); if (["-", "+"].includes(expression.operator) && !isNumeric(operand)) this.error(expression, "SEM-016", `El operador ${expression.operator} requiere un número.`); result = ["!", "not"].includes(expression.operator) ? bool : operand; break; }
      case "UpdateExpression": { const operand = this.expression(expression.argument); if (expression.argument.kind !== "Identifier") this.error(expression, "SEM-016", "Incremento/decremento requiere una variable."); else { const symbol = this.currentScope.resolve(expression.argument.name); if (symbol?.isConst) this.error(expression, "SEM-008", "No se puede modificar una constante."); if (symbol && !isNumeric(symbol.type)) this.error(expression, "SEM-016", "Incremento/decremento requiere un número."); } result = operand; break; }
      case "BinaryExpression": result = this.binary(expression); break;
      case "CallExpression": result = this.call(expression); break;
      case "MemberExpression": { const object = this.expression(expression.object); if (object.kind !== "class") this.error(expression, "SEM-030", "El acceso requiere una instancia de clase."); const declaration = object.kind === "class" ? this.classes.get(object.name) : undefined; const field = declaration?.fields.find((item) => item.name === expression.property); const method = declaration?.methods.find((item) => item.name === expression.property); result = field?.declaredType.type ?? method?.returnType.type ?? voidType; break; }
      case "NewExpression": { if (!this.classes.has(expression.className)) this.error(expression, "SEM-031", `La clase '${expression.className}' no está declarada.`); result = { kind: "class", name: expression.className }; for (const argument of expression.arguments) this.expression(argument); break; }
      case "LambdaExpression": result = { kind: "fn" }; break;
      case "ErrorExpression": result = voidType; break;
    }
    this.expressionTypes.set(expression.id, result); return result;
  }
  private binary(expression: Extract<Expression, { kind: "BinaryExpression" }>): CorapriType { const left = this.expression(expression.left); const right = this.expression(expression.right); const op = expression.operator; if (["+", "-", "*"].includes(op) && ((left.kind === "range" && isNumeric(right)) || (right.kind === "range" && isNumeric(left)))) { const range = left.kind === "range" ? left : right as Extract<CorapriType, { kind: "range" }>; const scalar = (left.kind === "range" ? right : left) as NumericValueType; const element: NumericValueType = range.element.kind === "float" || scalar.kind === "float" ? { kind: "float" } : int; return { kind: "range", element }; } if (["|", "&"].includes(op)) { if (left.kind !== "array" || right.kind !== "array" || !same(left, right)) this.error(expression, "SEM-016", `El operador ${op} requiere dos arrays del mismo tipo.`); return left.kind === "array" && right.kind === "array" && same(left, right) ? left : voidType; } if (["&&", "||", "and", "or", "xor", "nor", "nand"].includes(op)) { if (left.kind !== "boolean" || right.kind !== "boolean") this.error(expression, "SEM-016", `El operador ${op} requiere boolean.`); return bool; } if (["==", "!=", "<", "<=", ">", ">="].includes(op)) { if (op === "==" || op === "!=") { if (!assignable(left, right) && !assignable(right, left)) this.error(expression, "SEM-016", "La comparación requiere tipos compatibles."); } else if (!isNumeric(left) || !isNumeric(right)) this.error(expression, "SEM-016", "Las comparaciones de orden requieren números."); return bool; } if (op === "+" && (left.kind === "string" || right.kind === "string")) return { kind: "string" }; if (!isNumeric(left) || !isNumeric(right)) { this.error(expression, "SEM-016", `El operador ${op} requiere operandos numéricos, no ${typeToString(left)} y ${typeToString(right)}.`); return voidType; } if (op === "%" && (left.kind !== "int" || right.kind !== "int")) this.error(expression, "SEM-016", "El operador % solo acepta enteros."); return left.kind === "float" || right.kind === "float" || ["root", "log"].includes(op) ? { kind: "float" } : int; }
  /** Flattens nested CallExpression nodes so f(1)(2) validates one ordered parameter list. */
  private call(expression: Extract<Expression, { kind: "CallExpression" }>): CorapriType {
    if (expression.callee.kind === "MemberExpression") { const callable = this.expression(expression.callee); for (const argument of expression.arguments) this.expression(argument); return callable; }
    const flattened = this.flattenCall(expression);
    if (!flattened) { this.error(expression, "SEM-018", "Solo se pueden llamar funciones declaradas."); return voidType; }
    const { callee, arguments: supplied } = flattened;
    const builtins: Record<string, { args: number; type: CorapriType }> = { input: { args: 1, type: { kind: "string" } }, inputInt: { args: 1, type: int }, inputFloat: { args: 1, type: { kind: "float" } }, head: { args: 1, type: int }, tail: { args: 1, type: { kind: "array", element: int } }, cons: { args: 2, type: { kind: "array", element: int } }, length: { args: 1, type: int }, map: { args: 2, type: { kind: "array", element: int } }, filter: { args: 2, type: { kind: "array", element: int } }, reduce: { args: 3, type: int } };
    if (builtins[callee.name]) { const builtin = builtins[callee.name]; if (supplied.length !== builtin.args) this.error(expression, "SEM-019", `${callee.name} requiere ${builtin.args} argumento(s).`); for (const argument of supplied) this.expression(argument); if (["input", "inputInt", "inputFloat"].includes(callee.name) && supplied[0] && this.expression(supplied[0]).kind !== "string") this.error(supplied[0], "SEM-020", `${callee.name} requiere un mensaje string.`); return builtin.type; }
    const symbol = this.resolve(callee);
    if (!symbol || symbol.kind !== "function") { this.error(callee, "SEM-001", `La función '${callee.name}' no está declarada.`); return voidType; }
    const parameters = symbol.parameters ?? [];
    if (supplied.length > parameters.length) this.error(expression, "SEM-019", `${callee.name} espera como máximo ${parameters.length} argumento(s).`);
    supplied.forEach((argument, index) => { const actual = this.expression(argument, parameters[index]); const wanted = parameters[index]; if (wanted && !assignable(wanted, actual)) this.error(argument, "SEM-020", `El argumento ${index + 1} debe ser ${typeToString(wanted)}.`); });
    this.bindings.set(expression.id, symbol);
    return supplied.length === parameters.length ? (symbol.returnType ?? symbol.type) : voidType;
  }
  private flattenCall(expression: Extract<Expression, { kind: "CallExpression" }>): { callee: Extract<Expression, { kind: "Identifier" }>; arguments: Expression[] } | undefined {
    const collectedArguments: Expression[] = []; let current: Expression = expression;
    while (current.kind === "CallExpression") { collectedArguments.unshift(...current.arguments); current = current.callee; }
    return current.kind === "Identifier" ? { callee: current, arguments: collectedArguments } : undefined;
  }
  private resolve(node: Extract<Expression, { kind: "Identifier" }>): SymbolEntry | undefined { const symbol = this.currentScope.resolve(node.name); if (!symbol) this.error(node, "SEM-001", `El identificador '${node.name}' no está declarado.`); else { this.bindings.set(node.id, symbol); if (symbol.kind !== "function") symbol.reads++; if (!symbol.initialized && symbol.kind !== "function") this.error(node, "SEM-021", `La variable '${node.name}' se usa antes de inicializarse.`); } return symbol; }
  private resolveWrite(node: Extract<Expression, { kind: "Identifier" }>): SymbolEntry | undefined { const symbol = this.currentScope.resolve(node.name); if (!symbol) this.error(node, "SEM-001", `El identificador '${node.name}' no está declarado.`); else this.bindings.set(node.id, symbol); return symbol; }
  private matrix(expression: Extract<Expression, { kind: "MatrixLiteral" }>, expected?: CorapriType): CorapriType { const wanted = expected?.kind === "matrix" ? expected.element : undefined; const firstRow = expression.rows[0]; const width = firstRow?.elements.length ?? 0; for (const row of expression.rows) { if (row.elements.length !== width) this.error(row, "SEM-022", `Dimensiones incompatibles en la matriz. Se esperaban ${width} elementos y se encontraron ${row.elements.length}.`); }
    const values = expression.rows.flatMap((row) => row.elements); if (values.length === 0) { if (wanted) return { kind: "matrix", element: wanted }; this.error(expression, "SEM-014", "No se puede inferir el tipo de una matriz vacía."); return { kind: "matrix", element: int }; }
    const element = this.expression(values[0]!, wanted); for (const value of values.slice(1)) { const actual = this.expression(value, element); if (!assignable(element, actual) || !assignable(actual, element)) this.error(value, "SEM-015", "Todos los elementos de la matriz deben tener el mismo tipo."); }
    return { kind: "matrix", element: asValueType(element) };
  }
  private guaranteedReturn(statement: Statement): boolean { if (statement.kind === "Return") return true; if (statement.kind === "Block") return statement.statements.some((item) => this.guaranteedReturn(item)); if (statement.kind === "If") return Boolean(statement.elseBranch && this.guaranteedReturn(statement.thenBranch) && this.guaranteedReturn(statement.elseBranch)); return false; }
  private withScope(kind: ScopeSnapshot["kind"], name: string, action: () => void): void { const previous = this.currentScope; this.currentScope = this.table.createScope(name, kind, previous); action(); this.currentScope = previous; }
  private error(node: AstNode, code: string, message: string): void { this.diagnostics.push(diagnostic("SEMANTIC", code, message, node)); }
  private warning(node: import("../errors/diagnostic").SourceSpan, code: string, message: string): void { this.diagnostics.push(diagnostic("SEMANTIC", code, message, node, { severity: "warning" })); }
}

export const analyze = (program: ProgramNode, options?: SemanticOptions): SemanticResult => new SemanticAnalyzer(options).analyze(program);
