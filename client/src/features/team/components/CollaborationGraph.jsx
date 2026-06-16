import { useQuery } from "@tanstack/react-query";
import Card from "../../../shared/ui/Card.jsx";
import { getCollaborationGraph } from "../../../services/teamService.js";

const FALLBACK_NODES = [
  { id: "eng",  label: "Engineering", x: 200, y: 120, size: 32, color: "#457b9d" },
  { id: "prod", label: "Product",     x: 380, y: 80,  size: 26, color: "#2a9d8f" },
  { id: "des",  label: "Design",      x: 320, y: 220, size: 22, color: "#6d6875" },
  { id: "mkt",  label: "Marketing",   x: 120, y: 220, size: 18, color: "#e9c46a" },
];
const FALLBACK_EDGES = [
  { from: "eng", to: "prod", weight: 8 },
  { from: "eng", to: "des",  weight: 5 },
  { from: "prod", to: "des", weight: 6 },
  { from: "prod", to: "mkt", weight: 3 },
  { from: "eng", to: "mkt",  weight: 2 },
];

export default function CollaborationGraph() {
  const { data } = useQuery({ queryKey: ["team-collaboration"], queryFn: getCollaborationGraph });

  // The approved SVG draws nodes from x/y/size/color and weights edges by `weight`.
  // Use backend data only when it carries those presentation fields, so the
  // approved layout renders unchanged until the API supplies coordinate-bearing nodes.
  const apiNodes = data?.nodes;
  const apiEdges = data?.edges;
  const nodes =
    Array.isArray(apiNodes) && apiNodes.length > 0 && apiNodes.every((n) => typeof n.x === "number")
      ? apiNodes
      : FALLBACK_NODES;
  const edges =
    nodes === apiNodes && Array.isArray(apiEdges) && apiEdges.every((e) => typeof e.weight === "number")
      ? apiEdges
      : FALLBACK_EDGES;

  const getNode = (id) => nodes.find((n) => n.id === id);

  return (
    <Card padding="">
      <div className="border-b border-[var(--border)] px-5 py-4">
        <h3 className="font-display text-sm font-semibold text-[var(--text)]">Collaboration Graph</h3>
        <p className="mt-0.5 text-xs text-[var(--text-muted)]">Team interaction strength</p>
      </div>
      <div className="p-5">
        <svg viewBox="0 0 500 300" className="w-full">
          {edges.map((e, i) => {
            const from = getNode(e.from);
            const to   = getNode(e.to);
            return (
              <line key={i}
                x1={from.x} y1={from.y} x2={to.x} y2={to.y}
                stroke="var(--border)" strokeWidth={e.weight / 2} strokeOpacity={0.6}
              />
            );
          })}
          {nodes.map((n) => (
            <g key={n.id}>
              <circle cx={n.x} cy={n.y} r={n.size} fill={n.color} opacity={0.85} />
              <text x={n.x} y={n.y + n.size + 14} textAnchor="middle"
                fontSize={11} fill="var(--text-secondary)" fontFamily="DM Sans, sans-serif">
                {n.label}
              </text>
            </g>
          ))}
        </svg>
      </div>
    </Card>
  );
}