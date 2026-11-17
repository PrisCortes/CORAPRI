export type DiagnosticPhase = "LEXICAL" | "SYNTAX" | "SEMANTIC" | "RUNTIME";
export type DiagnosticSeverity = "error" | "warning" | "info";

export interface SourceSpan { start: number; end: number; line: number; column: number }

export interface CompilerDiagnostic extends SourceSpan {
  code: string;
  phase: DiagnosticPhase;
  severity: DiagnosticSeverity;
  message: string;
  lexeme?: string;
  suggestion?: string;
  expected?: string;
  found?: string;
}

export const diagnostic = (
  phase: DiagnosticPhase, code: string, message: string, span: SourceSpan,
  extra: Partial<Pick<CompilerDiagnostic, "lexeme" | "suggestion" | "expected" | "found" | "severity">> = {},
): CompilerDiagnostic => ({ ...span, phase, code, message, ...extra, severity: extra.severity ?? "error" });
