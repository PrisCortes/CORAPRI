import type { SourceSpan } from "../errors/diagnostic";

export type TokenKind =
  | "PROGRAM" | "FUNCTION" | "CONST" | "PAR" | "CLASS" | "EXTENDS" | "NEW" | "THIS" | "SUPER" | "CONSTRUCTOR" | "LAMBDA" | "FN" | "PARALLEL" | "TASK" | "INT" | "FLOAT" | "STRING" | "CHAR" | "BOOLEAN" | "VOID" | "ARRAY" | "MATRIX" | "RANGE"
  | "IF" | "ELSE" | "WHILE" | "DO" | "FOR" | "RETURN" | "PRINT" | "TRUE" | "FALSE"
  | "IDENTIFIER" | "INTEGER_LITERAL" | "FLOAT_LITERAL" | "STRING_LITERAL" | "CHAR_LITERAL"
  | "PLUS" | "MINUS" | "STAR" | "SLASH" | "PERCENT" | "EQUAL" | "EQUAL_EQUAL" | "BANG" | "BANG_EQUAL"
  | "LESS" | "LESS_EQUAL" | "GREATER" | "GREATER_EQUAL" | "AND_AND" | "OR_OR"
  | "INCREMENT" | "DECREMENT" | "POWER" | "UNION" | "INTERSECTION" | "ROOT" | "LOG"
  | "LOGICAL_AND" | "LOGICAL_OR" | "LOGICAL_NOT" | "XOR" | "NOR" | "NAND"
  | "LPAREN" | "RPAREN" | "LBRACE" | "RBRACE" | "LBRACKET" | "RBRACKET" | "COMMA" | "SEMICOLON" | "COLON" | "DOT" | "FAT_ARROW" | "RANGE_SEPARATOR" | "EOF";

export interface Token extends SourceSpan {
  kind: TokenKind;
  lexeme: string;
  nfa?: string;
  acceptingState?: string;
  originalLexemes?: string[];
  originalStart?: number;
  originalEnd?: number;
}

export const typeTokens = new Set<TokenKind>(["INT", "FLOAT", "STRING", "CHAR", "BOOLEAN", "FN", "ARRAY", "MATRIX", "RANGE"]);
