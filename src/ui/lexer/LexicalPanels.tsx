import { useEffect, useMemo, useState } from "react";
import type { PipelineResult, Token, TokenTrace } from "../../language";

const classFor = (kind: string): string => `token-badge token-${kind.toLowerCase()}`;
const printable = (value: string): string => value === " " ? "espacio" : value === "\n" ? "salto de línea" : value;

export function LexicalTokenTable({ result }: { result: PipelineResult }): React.JSX.Element {
  const [mode, setMode] = useState<"normalized" | "original">("normalized"); const [filter, setFilter] = useState("ALL");
  const tokens = mode === "normalized" ? result.tokens : result.originalTokens;
  const kinds = useMemo(() => [...new Set(tokens.filter((token) => token.kind !== "EOF").map((token) => token.kind))], [tokens]);
  const visible = tokens.filter((token) => token.kind !== "EOF" && (filter === "ALL" || token.kind === filter));
  return <><div className="lexical-controls"><label>Flujo<select value={mode} onChange={(event) => setMode(event.target.value as "normalized" | "original")}><option value="normalized">Tokens normalizados</option><option value="original">Tokens originales</option></select></label><label>Tipo<select value={filter} onChange={(event) => setFilter(event.target.value)}><option value="ALL">Todos</option>{kinds.map((kind) => <option key={kind}>{kind}</option>)}</select></label></div><table><thead><tr><th>Lexema</th><th>Token</th><th>AFN</th><th>Línea</th><th>Columna</th></tr></thead><tbody>{visible.map((token) => <tr key={`${mode}-${token.start}-${token.end}-${token.kind}`}><td>{token.lexeme}</td><td><span className={classFor(token.kind)}>{token.kind}</span></td><td>{token.nfa ?? "—"}</td><td>{token.line}</td><td>{token.column}</td></tr>)}</tbody></table></>;
}

export function NfaVisualizer({ traces }: { traces: readonly TokenTrace[] }): React.JSX.Element {
  const [selected, setSelected] = useState(0); const [step, setStep] = useState(0); const [playing, setPlaying] = useState(false); const trace = traces[selected];
  useEffect(() => { setStep(0); setPlaying(false); }, [selected]);
  useEffect(() => { if (!playing || !trace || step >= trace.steps.length) return; const timer = window.setTimeout(() => setStep((value) => value + 1), 550); return () => window.clearTimeout(timer); }, [playing, step, trace]);
  useEffect(() => { if (trace && step >= trace.steps.length) setPlaying(false); }, [step, trace]);
  if (!trace) return <p>No hay lexemas aceptados para visualizar.</p>;
  const current = trace.steps[Math.min(step, Math.max(trace.steps.length - 1, 0))];
  return <section className="nfa-panel"><div className="lexical-controls"><label>Lexema<select value={selected} onChange={(event) => setSelected(Number(event.target.value))}>{traces.map((item, index) => <option key={`${item.tokenStart}-${index}`} value={index}>{item.lexeme} — {item.machine}</option>)}</select></label><div><button onClick={() => setStep(0)}>⏮ Reiniciar</button><button className="run" onClick={() => setPlaying(true)}>▶ Automático</button><button onClick={() => setPlaying(false)}>⏸ Pausar</button><button onClick={() => setStep((value) => Math.min(value + 1, trace.steps.length))}>⏭ Siguiente carácter</button></div></div><div className="nfa-summary"><p><strong>AFN:</strong> {trace.machine}</p><p><strong>Lexema:</strong> <code>{trace.lexeme}</code></p><p><strong>Estado inicial:</strong> <span className="nfa-initial">→ q0</span></p><p><strong>Estado final:</strong> <span className="nfa-accept">(( {trace.acceptingState ?? "—"} )) aceptado</span></p></div>{current ? <article className="transition-card"><h3>Transición {Math.min(step + 1, trace.steps.length)} de {trace.steps.length}</h3><p><strong>Carácter:</strong> {printable(current.symbol)} · posición {current.index}</p><p><strong>Estados antes:</strong> {`{${current.before.join(", ")}}`}</p><p><strong>Transición:</strong> {current.transitions.join("; ")}</p><p><strong>Estados después:</strong> {`{${current.after.join(", ")}}`}</p><p><strong>Aceptación:</strong> {current.accepting.length ? `Sí: ${current.accepting.join(", ")}` : "Aún no"}</p></article> : <p>El AFN aceptó un lexema vacío.</p>}<details><summary>Diagrama textual del autómata</summary><pre>{trace.steps.map((item) => item.transitions.join("\n")).join("\n")}</pre></details></section>;
}

export function SignNormalizationPanel({ result }: { result: PipelineResult }): React.JSX.Element {
  if (!result.signNormalizations.length) return <p>No hubo secuencias de signos que normalizar.</p>;
  return <section><p>La normalización conserva las posiciones originales y nunca convierte <code>++</code> o <code>--</code>.</p><table><thead><tr><th>Antes</th><th>Regla</th><th>Después</th></tr></thead><tbody>{result.signNormalizations.map((change) => <tr key={`${change.after.start}-${change.after.end}`}><td>{change.before.map((token) => <span className={classFor(token.kind)} key={token.start}>{token.lexeme}</span>)}</td><td>{change.rule}</td><td><span className={classFor(change.after.kind)}>{change.after.lexeme}</span></td></tr>)}</tbody></table></section>;
}

export function LexicalLimitations({ tokens }: { tokens: readonly Token[] }): React.JSX.Element {
  const kinds = new Set<string>(tokens.map((token) => token.kind)); const limitations = [
    { kinds: ["POWER"], label: "Potencia ^", detail: "El AFN la reconoce; el parser actual no incluye este operador." },
    { kinds: ["UNION", "INTERSECTION"], label: "Operaciones de conjuntos | y &", detail: "Reconocidas léxicamente; no existe gramática de conjuntos todavía." },
    { kinds: ["ROOT", "LOG"], label: "root y log", detail: "Son palabras operadoras del lexer; el parser no las evalúa aún." },
    { kinds: ["INCREMENT", "DECREMENT"], label: "++ y --", detail: "Los tokens son correctos, pero no hay reglas sintácticas de incremento/decremento." },
  ].filter((item) => item.kinds.some((kind) => kinds.has(kind)));
  return <section><p>Estas advertencias no son errores léxicos: el AFN produjo tokens válidos.</p>{limitations.length ? <ul className="limitations">{limitations.map((item) => <li key={item.label}><strong>⚠ {item.label}</strong><br />✓ Tokenización correcta · {item.detail}</li>)}</ul> : <p>No hay operadores léxicos nuevos que requieran una advertencia en este código.</p>}<p><strong>Notación prefija y postfija:</strong> el lexer conserva las fronteras de los tokens, pero el parser actual solo interpreta expresiones infijas de CoRaPri.</p></section>;
}
