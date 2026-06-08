import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend } from "recharts";
import Card from "../../shared/ui/Card.jsx";

// Minimal color: completed = brand, remaining states = neutral greys.
const DATA = [
  { name: "Completed",   value: 64, color: "var(--brand)" },
  { name: "In Progress", value: 22, color: "var(--text-secondary)" },
  { name: "Pending",     value: 14, color: "var(--text-muted)" },
];

export default function TaskProgressChart() {
  return (
    <Card padding="">
      <div className="border-b border-[var(--border)] px-5 py-3.5">
        <h3 className="font-display text-sm font-semibold text-[var(--text)]">Task status</h3>
      </div>
      <div className="p-5">
        <ResponsiveContainer width="100%" height={180}>
          <PieChart>
            <Pie data={DATA} cx="50%" cy="50%" innerRadius={50} outerRadius={80} paddingAngle={3} dataKey="value" stroke="var(--card)">
              {DATA.map((entry, i) => <Cell key={i} fill={entry.color} />)}
            </Pie>
            <Tooltip contentStyle={{ background: "var(--bg-overlay)", border: "1px solid var(--border)", borderRadius: 8, fontSize: 12, color: "var(--text)" }} />
            <Legend iconType="circle" iconSize={8} wrapperStyle={{ fontSize: 12, color: "var(--text-secondary)" }} />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </Card>
  );
}