import type { Token } from "../token";

export interface SignNormalization { before: readonly Token[]; after: Token; rule: "+ + → +" | "+ - → -" | "- + → -" | "- - → +" }
const result = (first: Token, second: Token): { kind: "PLUS" | "MINUS"; rule: SignNormalization["rule"] } | undefined => {
  if (first.kind === "PLUS" && second.kind === "PLUS") return { kind: "PLUS", rule: "+ + → +" };
  if (first.kind === "PLUS" && second.kind === "MINUS") return { kind: "MINUS", rule: "+ - → -" };
  if (first.kind === "MINUS" && second.kind === "PLUS") return { kind: "MINUS", rule: "- + → -" };
  if (first.kind === "MINUS" && second.kind === "MINUS") return { kind: "PLUS", rule: "- - → +" };
  return undefined;
};

export const normalizeSigns = (original: readonly Token[]): { tokens: Token[]; changes: SignNormalization[] } => {
  const tokens: Token[] = []; const changes: SignNormalization[] = [];
  for (let index = 0; index < original.length; index++) { const first = original[index]!; const second = original[index + 1]; const normalized = second ? result(first, second) : undefined; if (!normalized) { tokens.push(first); continue; }
    const after: Token = { kind: normalized.kind, lexeme: normalized.kind === "PLUS" ? "+" : "-", start: first.start, end: second.end, line: first.line, column: first.column, nfa: "LexicalSignNormalization", acceptingState: "normalized", originalLexemes: [first.lexeme, second.lexeme], originalStart: first.start, originalEnd: second.end };
    tokens.push(after); changes.push({ before: [first, second], after, rule: normalized.rule }); index++;
  }
  return { tokens, changes };
};
