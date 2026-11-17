import type { CorapriType } from "../ast/nodes";
import type { SourceSpan } from "../errors/diagnostic";

export type SymbolKind = "variable" | "constant" | "parameter" | "function";
export interface SymbolEntry { id: string; name: string; kind: SymbolKind; type: CorapriType; scopeId: string; declaredAt: SourceSpan; isConst: boolean; initialized: boolean; reads: number; parameters?: readonly CorapriType[]; returnType?: CorapriType }
export interface ScopeSnapshot { id: string; name: string; parentId?: string; kind: "program" | "function" | "block" | "loop"; symbols: SymbolEntry[] }

export class Scope {
  readonly symbols = new Map<string, SymbolEntry>();
  constructor(readonly id: string, readonly name: string, readonly kind: ScopeSnapshot["kind"], readonly parent?: Scope) {}
  resolve(name: string): SymbolEntry | undefined { return this.symbols.get(name) ?? this.parent?.resolve(name); }
  define(entry: SymbolEntry): boolean { if (this.symbols.has(entry.name)) return false; this.symbols.set(entry.name, entry); return true; }
}

export class SymbolTable {
  private scopeNumber = 0; private symbolNumber = 0; readonly allScopes: Scope[] = [];
  readonly global = this.createScope("global", "program");
  createScope(name: string, kind: ScopeSnapshot["kind"], parent?: Scope): Scope { const scope = new Scope(`scope-${++this.scopeNumber}`, name, kind, parent); this.allScopes.push(scope); return scope; }
  symbol(name: string, kind: SymbolKind, type: CorapriType, scope: Scope, span: SourceSpan, isConst = false, initialized = false, parameters?: readonly CorapriType[], returnType?: CorapriType): SymbolEntry { return { id: `sym-${++this.symbolNumber}`, name, kind, type, scopeId: scope.id, declaredAt: span, isConst, initialized, reads: 0, ...(parameters ? { parameters } : {}), ...(returnType ? { returnType } : {}) }; }
  snapshot(): ScopeSnapshot[] { return this.allScopes.map((scope) => ({ id: scope.id, name: scope.name, kind: scope.kind, ...(scope.parent ? { parentId: scope.parent.id } : {}), symbols: [...scope.symbols.values()] })); }
}
