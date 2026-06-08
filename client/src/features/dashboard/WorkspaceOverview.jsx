import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";
import Card from "../../shared/ui/Card.jsx";

const FALLBACK = [
  { day: "Mon", meetings: 3, tasks: 8 },
  { day: "Tue", meetings: 5, tasks: 12 },
  { day: "Wed", meetings: 2, tasks: 6 },
  { day: "Thu", meetings: 7, tasks: 15 },
  { day: "Fri", meetings: 4, tasks: 10 },
  { day: "Sat", meetings: 1, tasks: 3 },
  { day: "Sun", meetings: 0, tasks: 2 },
];

export default function WorkspaceOverview() {
  return (
    <Card padding="">
      <div className="border-b border-[var(--border)] px-5 py-3.5">
        <h3 className="font-display text-sm font-semibold text-[var(--text)]">This week</h3>
        <p className="mt-0.5 text-xs text-[var(--text-muted)]">Meetings &amp; tasks activity</p>
      </div>
      <div className="p-5">
        <ResponsiveContainer width="100%" height={160}>
          <AreaChart data={FALLBACK} margin={{ top: 4, right: 0, left: -20, bottom: 0 }}>
            <defs>
              <linearGradient id="wo-meetings" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="var(--brand)" stopOpacity={0.25} />
                <stop offset="95%" stopColor="var(--brand)" stopOpacity={0} />
              </linearGradient>
              <linearGradient id="wo-tasks" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="var(--text-muted)" stopOpacity={0.2} />
                <stop offset="95%" stopColor="var(--text-muted)" stopOpacity={0} />
              </linearGradient>
            </defs>
            <XAxis dataKey="day" tick={{ fontSize: 11, fill: "var(--text-muted)" }} axisLine={false} tickLine={false} />
            <YAxis tick={{ fontSize: 11, fill: "var(--text-muted)" }} axisLine={false} tickLine={false} />
            <Tooltip
              contentStyle={{
                background: "var(--bg-overlay)", border: "1px solid var(--border)",
                borderRadius: 8, fontSize: 12, color: "var(--text)",
              }}
            />
            <Area type="monotone" dataKey="meetings" stroke="var(--brand)" fill="url(#wo-meetings)" strokeWidth={2} />
            <Area type="monotone" dataKey="tasks" stroke="var(--text-muted)" fill="url(#wo-tasks)" strokeWidth={2} />
          </AreaChart>
        </ResponsiveContainer>
        <div className="mt-3 flex gap-4">
          <div className="flex items-center gap-1.5">
            <span className="h-2 w-2 rounded-full bg-[var(--brand)]" />
            <span className="text-xs text-[var(--text-muted)]">Meetings</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="h-2 w-2 rounded-full bg-[var(--text-muted)]" />
            <span className="text-xs text-[var(--text-muted)]">Tasks</span>
          </div>
        </div>
      </div>
    </Card>
  );
}