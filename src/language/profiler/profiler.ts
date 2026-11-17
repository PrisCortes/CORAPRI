import type { ProgramNode } from "../ast/nodes";
import { execute, type ExecuteOptions, type ExecutionResult, type ExecutionSnapshot } from "../interpreter/interpreter";

export interface ProfileEntry { line: number; column: number; hits: number; lastVariables: Record<string, string> }
export interface ProfileReport { elapsedMs: number; steps: number; entries: ProfileEntry[]; execution: ExecutionResult }

export const profileExecution = async (program: ProgramNode, options: ExecuteOptions = {}): Promise<ProfileReport> => {
  const entries = new Map<string, ProfileEntry>();
  const started = performance.now();
  const onStep = async (snapshot: ExecutionSnapshot): Promise<void> => {
    const key = `${snapshot.line}:${snapshot.column}`;
    const current = entries.get(key);
    if (current) { current.hits++; current.lastVariables = snapshot.variables; } else entries.set(key, { line: snapshot.line, column: snapshot.column, hits: 1, lastVariables: snapshot.variables });
    await options.onStep?.(snapshot);
  };
  const execution = await execute(program, { ...options, onStep });
  return { elapsedMs: performance.now() - started, steps: [...entries.values()].reduce((total, item) => total + item.hits, 0), entries: [...entries.values()].sort((left, right) => right.hits - left.hits || left.line - right.line), execution };
};
