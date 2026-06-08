import Card from "../../shared/ui/Card.jsx";
import { initials, avatarColor } from "../../shared/utils/formatters.js";

const MEMBERS = [
  { name: "Rahul Kumar",  action: "completed 3 tasks",     time: "5m ago" },
  { name: "Ananya Singh", action: "joined a meeting",      time: "1h ago" },
  { name: "Alex Chen",    action: "created AI summary",    time: "2h ago" },
  { name: "Sarah Park",   action: "assigned 2 action items", time: "3h ago" },
];

export default function TeamActivity() {
  return (
    <Card>
      <h3 className="font-display text-sm font-semibold text-[var(--text)] mb-4">Team Activity</h3>
      <div className="space-y-4">
        {MEMBERS.map((m, i) => (
          <div key={i} className="flex items-center gap-3">
            <div
              className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-lg text-xs font-bold text-white"
              style={{ background: avatarColor(m.name) }}
            >
              {initials(m.name)}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm text-[var(--text)]">
                <span className="font-medium">{m.name}</span>{" "}
                <span className="text-[var(--text-secondary)]">{m.action}</span>
              </p>
              <p className="text-xs text-[var(--text-muted)]">{m.time}</p>
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
}
