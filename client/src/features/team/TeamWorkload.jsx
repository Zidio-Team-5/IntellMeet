import { useQuery } from "@tanstack/react-query";
import Card from "../../shared/ui/Card.jsx";
import { initials, avatarColor } from "../../shared/utils/formatters.js";
import { getTeamWorkload } from "../../services/teamService.js";

const WORKLOAD = [
  { name: "Alex Chen",    tasks: 8,  capacity: 10, meetings: 5 },
  { name: "Sarah Park",   tasks: 6,  capacity: 10, meetings: 3 },
  { name: "Rahul Kumar",  tasks: 9,  capacity: 10, meetings: 7 },
  { name: "Ananya Singh", tasks: 4,  capacity: 10, meetings: 4 },
  { name: "John Miller",  tasks: 3,  capacity: 10, meetings: 2 },
];

export default function TeamWorkload() {
  const { data } = useQuery({ queryKey: ["team-workload"], queryFn: getTeamWorkload });
  const workload = (data?.workload ?? WORKLOAD).map((m) => ({
    name: m.name,
    tasks: m.tasks ?? m.openTasks ?? 0,
    capacity: m.capacity ?? 10,
    meetings: m.meetings ?? 0,
  }));

  return (
    <Card padding="">
      <div className="border-b border-[var(--border)] px-5 py-4">
        <h3 className="font-display text-sm font-semibold text-[var(--text)]">Team Workload</h3>
      </div>
      <div className="divide-y divide-[var(--border)]">
        {workload.map((m) => {
          const pct = Math.round((m.tasks / m.capacity) * 100);
          const color = pct >= 90 ? "#e63946" : pct >= 70 ? "#e9c46a" : "#2a9d8f";
          return (
            <div key={m.name} className="flex items-center gap-4 px-5 py-3">
              <div
                className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-lg text-xs font-bold text-white"
                style={{ background: avatarColor(m.name) }}
              >
                {initials(m.name)}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-sm font-medium text-[var(--text)]">{m.name}</span>
                  <span className="text-xs font-medium" style={{ color }}>{pct}%</span>
                </div>
                <div className="h-1.5 rounded-full bg-[var(--muted)] overflow-hidden">
                  <div
                    className="h-full rounded-full transition-all"
                    style={{ width: `${pct}%`, background: color }}
                  />
                </div>
                <p className="mt-0.5 text-[10px] text-[var(--text-muted)]">
                  {m.tasks} tasks · {m.meetings} meetings
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </Card>
  );
}