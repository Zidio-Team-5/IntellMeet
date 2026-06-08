import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from "recharts";
import Card from "../../shared/ui/Card.jsx";

const DATA = [
  { month: "Jan", meetings: 38 }, { month: "Feb", meetings: 42 },
  { month: "Mar", meetings: 35 }, { month: "Apr", meetings: 51 },
  { month: "May", meetings: 48 }, { month: "Jun", meetings: 55 },
];

export default function MeetingsChart() {
  return (
    <Card padding="">
      <div className="border-b border-[var(--border)] px-5 py-3.5">
        <h3 className="font-display text-sm font-semibold text-[var(--text)]">Meetings per month</h3>
      </div>
      <div className="p-5">
        <ResponsiveContainer width="100%" height={200}>
          <BarChart data={DATA}>
            <CartesianGrid strokeDasharray="3 3" stroke="var(--border-subtle)" vertical={false} />
            <XAxis dataKey="month" tick={{ fontSize: 11, fill: "var(--text-muted)" }} axisLine={false} tickLine={false} />
            <YAxis tick={{ fontSize: 11, fill: "var(--text-muted)" }} axisLine={false} tickLine={false} />
            <Tooltip cursor={{ fill: "var(--bg-hover)" }} contentStyle={{ background: "var(--bg-overlay)", border: "1px solid var(--border)", borderRadius: 8, fontSize: 12, color: "var(--text)" }} />
            <Bar dataKey="meetings" fill="var(--brand)" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </Card>
  );
}