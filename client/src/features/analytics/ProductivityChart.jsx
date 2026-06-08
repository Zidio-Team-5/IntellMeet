import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from "recharts";
import Card from "../../shared/ui/Card.jsx";

const FALLBACK = [
  { day: "Mon", productivity: 72 }, { day: "Tue", productivity: 80 },
  { day: "Wed", productivity: 68 }, { day: "Thu", productivity: 88 },
  { day: "Fri", productivity: 84 },
];

export default function ProductivityChart({ data = FALLBACK }) {
  return (
    <Card padding="">
      <div className="border-b border-[var(--border)] px-5 py-3.5">
        <h3 className="font-display text-sm font-semibold text-[var(--text)]">Productivity</h3>
      </div>
      <div className="p-5">
        <ResponsiveContainer width="100%" height={200}>
          <AreaChart data={data}>
            <defs>
              <linearGradient id="prod" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="var(--brand)" stopOpacity={0.25} />
                <stop offset="95%" stopColor="var(--brand)" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="var(--border-subtle)" vertical={false} />
            <XAxis dataKey="day" tick={{ fontSize: 11, fill: "var(--text-muted)" }} axisLine={false} tickLine={false} />
            <YAxis tick={{ fontSize: 11, fill: "var(--text-muted)" }} axisLine={false} tickLine={false} />
            <Tooltip contentStyle={{ background: "var(--bg-overlay)", border: "1px solid var(--border)", borderRadius: 8, fontSize: 12, color: "var(--text)" }} />
            <Area type="monotone" dataKey="productivity" stroke="var(--brand)" fill="url(#prod)" strokeWidth={2} />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </Card>
  );
}