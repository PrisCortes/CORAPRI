import { analyze, type SemanticResult } from "../semantic/analyzer";
import { generateIr } from "../ir/generator";
import type { IrProgram } from "../ir/instructions";
import { lex, type TokenTrace } from "../lexer/lexer";
import type { Token } from "../lexer/token";
import type { SignNormalization } from "../lexer/normalization/sign-normalization";
import { optimize, type OptimizationRecord } from "../optimizer/optimizer";
import { parse } from "../parser/parser";
import type { ProgramNode } from "../ast/nodes";
import type { CompilerDiagnostic } from "../errors/diagnostic";

export type PipelineStage = "lexer" | "parser" | "semantic" | "ir" | "optimizer";
export interface PipelineResult { source: string; tokens: Token[]; originalTokens: Token[]; lexicalTraces: TokenTrace[]; signNormalizations: SignNormalization[]; ast?: ProgramNode; semantic?: SemanticResult; ir?: IrProgram; optimizedIr?: IrProgram; optimizations: OptimizationRecord[]; diagnostics: CompilerDiagnostic[]; completed: readonly PipelineStage[] }
export interface PipelineOptions { warnings?: boolean }
const hasErrors = (diagnostics: readonly CompilerDiagnostic[]): boolean => diagnostics.some((item) => item.severity === "error");
/** The parser consumes this exact lexer token stream; it never re-tokenizes source code. */
export const runLexicalAnalysis = (source: string): PipelineResult => {
  const lexical = lex(source); return { source, tokens: lexical.tokens, originalTokens: lexical.originalTokens, lexicalTraces: lexical.traces, signNormalizations: lexical.signNormalizations, optimizations: [], diagnostics: [...lexical.diagnostics], completed: ["lexer"] };
};
export const runSyntaxAnalysis = (source: string, cachedLexical?: PipelineResult): PipelineResult => {
  const result = cachedLexical && cachedLexical.source === source ? { ...cachedLexical, diagnostics: [...cachedLexical.diagnostics], completed: [...cachedLexical.completed] } : runLexicalAnalysis(source);
  if (result.diagnostics.some((item) => item.phase === "LEXICAL")) return result;
  const parsed = parse(result.tokens); result.ast = parsed.ast; result.diagnostics.push(...parsed.diagnostics); result.completed = ["lexer", "parser"];
  return result;
};
export const runPipeline = (source: string, options: PipelineOptions = {}): PipelineResult => {
  const result = runSyntaxAnalysis(source);
  if (hasErrors(result.diagnostics) || !result.ast) return result;
  const semantic = analyze(result.ast, { warnings: options.warnings }); result.semantic = semantic; result.diagnostics.push(...semantic.diagnostics); result.completed = ["lexer", "parser", "semantic"];
  if (hasErrors(semantic.diagnostics)) return result;
  result.ir = generateIr(result.ast); result.completed = ["lexer", "parser", "semantic", "ir"];
  const optimized = optimize(result.ir); result.optimizedIr = optimized.ir; result.optimizations = optimized.records; result.completed = ["lexer", "parser", "semantic", "ir", "optimizer"];
  return result;
};

export const runLiveAnalysis = (source: string): PipelineResult => {
  return runSyntaxAnalysis(source);
};
