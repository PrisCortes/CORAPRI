export type CharPredicate = (char: string) => boolean;
export interface NfaState { id: string; accepting?: boolean; tokenKind?: string }
export interface NfaTransition { from: string; to: string; label: string; accepts?: CharPredicate; epsilon?: boolean }
export interface NfaStep { index: number; symbol: string; before: string[]; transitions: string[]; after: string[]; accepting: string[] }
export interface NfaRun { machine: string; start: number; end: number; accepted: boolean; acceptingState?: string; steps: NfaStep[] }

export class NFA {
  readonly stateById = new Map<string, NfaState>();
  readonly transitionsByState = new Map<string, NfaTransition[]>();
  constructor(readonly name: string, readonly states: readonly NfaState[], readonly initialState: string, readonly acceptingStates: readonly string[], readonly transitions: readonly NfaTransition[]) {
    states.forEach((state) => this.stateById.set(state.id, state));
    transitions.forEach((transition) => this.transitionsByState.set(transition.from, [...(this.transitionsByState.get(transition.from) ?? []), transition]));
  }
  epsilonClosure(ids: Iterable<string>): Set<string> { const closure = new Set(ids); const pending = [...closure]; while (pending.length) { const state = pending.pop()!; for (const transition of this.transitionsByState.get(state) ?? []) if (transition.epsilon && !closure.has(transition.to)) { closure.add(transition.to); pending.push(transition.to); } } return closure; }
  run(source: string, start: number): NfaRun {
    let active = this.epsilonClosure([this.initialState]); let index = start; const steps: NfaStep[] = []; let lastAccept: { end: number; state: string; stepCount: number } | undefined;
    if ([...active].some((state) => this.acceptingStates.includes(state))) lastAccept = { end: start, state: this.initialState, stepCount: 0 };
    while (index < source.length) { const symbol = source[index]!; const before = [...active]; const taken: NfaTransition[] = []; const next = new Set<string>(); for (const state of active) for (const transition of this.transitionsByState.get(state) ?? []) if (!transition.epsilon && transition.accepts?.(symbol)) { taken.push(transition); next.add(transition.to); }
      if (!next.size) break;
      active = this.epsilonClosure(next); index++; const accepting = [...active].filter((state) => this.acceptingStates.includes(state)); steps.push({ index: index - 1, symbol, before, transitions: taken.map((transition) => `${transition.from} --${transition.label}--> ${transition.to}`), after: [...active], accepting }); if (accepting.length) lastAccept = { end: index, state: accepting[0]!, stepCount: steps.length };
    }
    if (!lastAccept) return { machine: this.name, start, end: start, accepted: false, steps: [] };
    return { machine: this.name, start, end: lastAccept.end, accepted: true, acceptingState: lastAccept.state, steps: steps.slice(0, lastAccept.stepCount) };
  }
}
