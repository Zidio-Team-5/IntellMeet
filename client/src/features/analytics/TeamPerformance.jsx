import { useQuery } from "@tanstack/react-query";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";
import Card from "../../shared/ui/Card.jsx";
import { getTeamPerformance } from "../../services/analyticsService.js";

const FALLBACK = [
  { name: "Engineering", score: 94, meetings: 28, tasks: 142 },
  { name: "Product",     score: 88, meetings: 22, tasks: 98 },
  { name: "Design",      score: 86, meetings: 18, tasks: 76 },
  { name: "Marketing",   score: 79, meetings: 15, tasks: 54 },
];

export default function TeamPerformance() {
  const { data } = useQuery({ queryKey: ["team-performance"], queryFn: getTeamPerformance });
  const teams = data?.teams ?? FALLBACK;

  return (
    <Card padding="">
      <div className="border-b border-[var(--border)] px-5 py-3.5">
        <h3 className="font-display text-sm font-semibold text-[var(--text)]">Team performance</h3>
        <p className="mt-0.5 text-xs text-[var(--text-muted)]">Score by department</p>
      </div>
      <div className="p-5">
        <ResponsiveContainer width="100%" height={180}>
          <BarChart data={teams} layout="vertical" margin={{ left: 8 }}>
            <XAxis type="number" tick={{ fontSize: 11, fill: "var(--text-muted)" }} axisLine={false} tickLine={false} domain={[0, 100]} />
            <YAxis dataKey="name" type="category" tick={{ fontSize: 11, fill: "var(--text-muted)" }} axisLine={false} tickLine={false} width={72} />
            <Tooltip cursor={{ fill: "var(--bg-hover)" }} contentStyle={{ background: "var(--bg-overlay)", border: "1px solid var(--border)", borderRadius: 8, fontSize: 12, color: "var(--text)" }} />
            <Bar dataKey="score" fill="var(--brand)" radius={[0, 4, 4, 0]} name="Score" />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </Card>
  );
}