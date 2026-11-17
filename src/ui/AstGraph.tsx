import { Background, Controls, MarkerType, ReactFlow, type Edge, type Node } from "@xyflow/react";
import "@xyflow/react/dist/style.css";
import type { AstNode } from "../language";

type GraphNode = { id: string; kind: string; line: number; column: number };
const isNode = (value: unknown): value is GraphNode => typeof value === "object" && value !== null && "id" in value && "kind" in value && "line" in value;
const childNodes = (value: GraphNode): GraphNode[] => Object.values(value as unknown as Record<string, unknown>).flatMap((item) => Array.isArray(item) ? item.filter(isNode) : isNode(item) ? [item] : []);

export function AstGraph({ ast }: { ast: AstNode }): React.JSX.Element {
  const nodes: Node[] = []; const edges: Edge[] = []; let row = 0;
  const visit = (current: GraphNode, parent?: GraphNode, depth = 0): void => { const position = { x: depth * 220, y: row++ * 90 }; nodes.push({ id: current.id, position, data: { label: `${current.kind}\nL${current.line}:C${current.column}` }, style: { background: "#1f3852", color: "#eaf4ff", border: "1px solid #6ab8ec", borderRadius: 7, whiteSpace: "pre-line", padding: 8, fontSize: 12 } }); if (parent) edges.push({ id: `${parent.id}-${current.id}`, source: parent.id, target: current.id, markerEnd: { type: MarkerType.ArrowClosed } }); childNodes(current).forEach((child) => visit(child, current, depth + 1)); };
  visit(ast);
  return <div style={{ height: 520 }} aria-label="Grafo interactivo del AST"><ReactFlow nodes={nodes} edges={edges} fitView minZoom={0.1}><Background /><Controls /></ReactFlow></div>;
}
