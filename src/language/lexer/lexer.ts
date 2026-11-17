import { diagnostic, type CompilerDiagnostic, type SourceSpan } from "../errors/diagnostic";
import { identifierNfa, isIdentifierStart, minusNfa, numberNfa, plusNfa, punctuationNfas, stringNfa, charNfa } from "./automata/machines";
import { type NFA, type NfaRun, type NfaStep } from "./automata/nfa";
import { normalizeSigns, type SignNormalization } from "./normalization/sign-normalization";
import type { Token, TokenKind } from "./token";

const keywords = new Map<string, TokenKind>([["program", "PROGRAM"], ["function", "FUNCTION"], ["const", "CONST"], ["par", "PAR"], ["class", "CLASS"], ["extends", "EXTENDS"], ["new", "NEW"], ["this", "THIS"], ["super", "SUPER"], ["constructor", "CONSTRUCTOR"], ["lambda", "LAMBDA"], ["fn", "FN"], ["parallel", "PARALLEL"], ["task", "TASK"], ["int", "INT"], ["float", "FLOAT"], ["string", "STRING"], ["char", "CHAR"], ["boolean", "BOOLEAN"], ["void", "VOID"], ["array", "ARRAY"], ["matrix", "MATRIX"], ["range", "RANGE"], ["if", "IF"], ["else", "ELSE"], ["while", "WHILE"], ["do", "DO"], ["for", "FOR"], ["return", "RETURN"], ["print", "PRINT"], ["true", "TRUE"], ["false", "FALSE"], ["root", "ROOT"], ["log", "LOG"], ["and", "LOGICAL_AND"], ["or", "LOGICAL_OR"], ["not", "LOGICAL_NOT"], ["xor", "XOR"], ["nor", "NOR"], ["nand", "NAND"]]);
const operatorKinds: Record<string, TokenKind> = { RangeSeparatorNFA: "RANGE_SEPARATOR", FatArrowNFA: "FAT_ARROW", PlusIncrementNFA: "PLUS", MinusDecrementNFA: "MINUS", StarNFA: "STAR", SlashNFA: "SLASH", PercentNFA: "PERCENT", PowerNFA: "POWER", UnionNFA: "UNION", IntersectionNFA: "INTERSECTION", EqualNFA: "EQUAL_EQUAL", NotEqualNFA: "BANG_EQUAL", LessEqualNFA: "LESS_EQUAL", GreaterEqualNFA: "GREATER_EQUAL", AndNFA: "AND_AND", OrNFA: "OR_OR", AssignNFA: "EQUAL", NotNFA: "BANG", LessNFA: "LESS", GreaterNFA: "GREATER", LeftParenNFA: "LPAREN", RightParenNFA: "RPAREN", LeftBraceNFA: "LBRACE", RightBraceNFA: "RBRACE", LeftBracketNFA: "LBRACKET", RightBracketNFA: "RBRACKET", DotNFA: "DOT", CommaNFA: "COMMA", SemicolonNFA: "SEMICOLON", ColonNFA: "COLON" };
const machines: readonly NFA[] = [identifierNfa, numberNfa, stringNfa, charNfa, plusNfa, minusNfa, ...punctuationNfas];

export interface TokenTrace { tokenStart: number; tokenEnd: number; lexeme: string; machine: string; accepted: boolean; acceptingState?: string; steps: NfaStep[] }
export interface LexResult { tokens: Token[]; originalTokens: Token[]; diagnostics: CompilerDiagnostic[]; traces: TokenTrace[]; signNormalizations: SignNormalization[] }
const isWhitespace = (char: string): boolean => char === " " || char === "\t" || char === "\r" || char === "\n";
const isLineBreak = (char: string): boolean => char === "\n" || char === "\r";
const nfaKind = (run: NfaRun, lexeme: string): TokenKind | undefined => { if (run.machine === "IdentifierNFA") return keywords.get(lexeme) ?? "IDENTIFIER"; if (run.machine === "NumberNFA") return run.acceptingState === "qFloat" ? "FLOAT_LITERAL" : "INTEGER_LITERAL"; if (run.machine === "StringNFA") return "STRING_LITERAL"; if (run.machine === "CharNFA") return "CHAR_LITERAL"; if (run.machine === "PlusIncrementNFA") return lexeme === "++" ? "INCREMENT" : "PLUS"; if (run.machine === "MinusDecrementNFA") return lexeme === "--" ? "DECREMENT" : "MINUS"; return operatorKinds[run.machine]; };

export const lex = (source: string): LexResult => {
  const originalTokens: Token[] = []; const diagnostics: CompilerDiagnostic[] = []; const traces: TokenTrace[] = [];
  let pos = 0, line = 1, column = 1, halted = false;
  const span = (start: number, startLine: number, startColumn: number): SourceSpan => ({ start, end: pos, line: startLine, column: startColumn });
  const advance = (): string => { const char = source[pos++] ?? ""; if (char === "\n") { line++; column = 1; } else column++; return char; };
  const addError = (code: string, message: string, start: number, startLine: number, startColumn: number, lexeme: string, suggestion?: string): void => { diagnostics.push(diagnostic("LEXICAL", code, message, span(start, startLine, startColumn), { lexeme, suggestion })); halted = true; };
  const addToken = (kind: TokenKind, raw: string, start: number, startLine: number, startColumn: number, run: NfaRun): Token => { const token: Token = { kind, lexeme: raw, ...span(start, startLine, startColumn), nfa: run.machine, ...(run.acceptingState ? { acceptingState: run.acceptingState } : {}) }; originalTokens.push(token); traces.push({ tokenStart: start, tokenEnd: token.end, lexeme: raw, machine: run.machine, accepted: true, ...(run.acceptingState ? { acceptingState: run.acceptingState } : {}), steps: run.steps }); return token; };
  const consumeUntilBoundary = (): void => { while (pos < source.length) { const char = source[pos] ?? ""; if (isWhitespace(char) || char === ";" || char === "," || char === ")" || char === "}" || char === "]") return; advance(); } };
  while (pos < source.length && !halted) {
    const char = source[pos] ?? "";
    if (isWhitespace(char)) { advance(); continue; }
    const start = pos, startLine = line, startColumn = column;
    if (char === "/" && source[pos + 1] === "/") { while (pos < source.length && !isLineBreak(source[pos] ?? "")) advance(); continue; }
    if (char === "/" && (source[pos + 1] === "*" || source[pos + 1] === "-")) { const closer = source[pos + 1] === "*" ? "*" : "-"; advance(); advance(); let closed = false; while (pos < source.length) { const current = advance(); if (current === closer && source[pos] === "/") { advance(); closed = true; break; } } if (!closed) addError("LEX-004", "Comentario multilínea sin cerrar.", start, startLine, startColumn, source.slice(start, pos), `Cierra el comentario con '${closer}/'.`); continue; }
    let best: NfaRun | undefined;
    for (const machine of machines) { const candidate = machine.run(source, start); if (candidate.accepted && (!best || candidate.end > best.end)) best = candidate; }
    if (!best) {
      if (char === "\"" || char === "'") { const quote = advance(); let closed = false; while (pos < source.length && !isLineBreak(source[pos] ?? "")) if (advance() === quote) { closed = true; break; } const raw = source.slice(start, pos); addError(closed && quote === "'" ? "LEX-005" : "LEX-003", closed ? "Un literal char debe contener exactamente un carácter." : "Literal de texto sin cerrar.", start, startLine, startColumn, raw, closed ? "Use exactamente un carácter entre comillas simples." : `Cierra el literal con ${quote}.`); continue; }
      advance(); addError("LEX-001", "Carácter no reconocido.", start, startLine, startColumn, char, "Elimina o reemplaza este carácter."); continue;
    }
    while (pos < best.end) advance(); const raw = source.slice(start, pos); const kind = nfaKind(best, raw);
    if (!kind) { addError("LEX-001", "No fue posible clasificar el lexema.", start, startLine, startColumn, raw); continue; }
    if (kind === "INTEGER_LITERAL" || kind === "FLOAT_LITERAL") { const next = source[pos] ?? ""; if (next === "." || isIdentifierStart(next)) { consumeUntilBoundary(); addError("LEX-002", "Número inválido.", start, startLine, startColumn, source.slice(start, pos), "Usa un entero o float con un solo punto decimal."); continue; } }
    const token = addToken(kind, raw, start, startLine, startColumn, best);
    const previous = originalTokens[originalTokens.length - 2]; const next = source[pos] ?? "";
    void token; void previous; void next;
  }
  const normalized = normalizeSigns(originalTokens);
  const eof: Token = { kind: "EOF", lexeme: "", start: pos, end: pos, line, column, nfa: "Scanner" };
  return { tokens: [...normalized.tokens, eof], originalTokens: [...originalTokens, eof], diagnostics, traces, signNormalizations: normalized.changes };
};
