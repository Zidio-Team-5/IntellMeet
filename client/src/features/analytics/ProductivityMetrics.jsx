import { useQuery } from "@tanstack/react-query";
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from "recharts";
import Card from "../../shared/ui/Card.jsx";
import { ChartSkeleton } from "../../shared/ui/Skeleton.jsx";
import { getProductivityMetrics } from "../../services/analyticsService.js";

const FALLBACK = [
  { week: "W1", score: 72, tasks: 45 },
  { week: "W2", score: 78, tasks: 52 },
  { week: "W3", score: 75, tasks: 48 },
  { week: "W4", score: 84, tasks: 61 },
  { week: "W5", score: 88, tasks: 67 },
  { week: "W6", score: 91, tasks: 74 },
];

export default function ProductivityMetrics() {
  const { data, isLoading } = useQuery({
    queryKey: ["productivity-metrics"],
    queryFn: getProductivityMetrics,
  });

  const chartData = data?.weekly ?? FALLBACK;

  return (
    <Card padding="">
      <div className="border-b border-[var(--border)] px-5 py-3.5">
        <h3 className="font-display text-sm font-semibold text-[var(--text)]">Productivity trend</h3>
        <p className="mt-0.5 text-xs text-[var(--text-muted)]">6-week rolling score</p>
      </div>
      <div className="p-5">
        {isLoading ? (
          <ChartSkeleton height={200} />
        ) : (
          <ResponsiveContainer width="100%" height={200}>
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--border-subtle)" vertical={false} />
              <XAxis dataKey="week" tick={{ fontSize: 11, fill: "var(--text-muted)" }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 11, fill: "var(--text-muted)" }} axisLine={false} tickLine={false} domain={[60, 100]} />
              <Tooltip contentStyle={{ background: "var(--bg-overlay)", border: "1px solid var(--border)", borderRadius: 8, fontSize: 12, color: "var(--text)" }} />
              <Line type="monotone" dataKey="score" stroke="var(--brand)" strokeWidth={2.5} dot={{ r: 3, fill: "var(--brand)" }} name="Score" />
              <Line type="monotone" dataKey="tasks" stroke="var(--text-muted)" strokeWidth={2} strokeDasharray="4 2" dot={false} name="Tasks" />
            </LineChart>
          </ResponsiveContainer>
        )}
      </div>
    </Card>
  );
}