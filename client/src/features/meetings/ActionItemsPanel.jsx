import { CheckSquare, User } from "lucide-react";
import Card from "../../shared/ui/Card.jsx";

export default function ActionItemsPanel({ items = [] }) {
  const defaultItems = items.length > 0 ? items : [
    { task: "Integrate WebRTC signaling", assignee: "Alex" },
    { task: "Deploy backend to staging",  assignee: "Sarah" },
    { task: "Write test coverage",        assignee: "John" },
  ];

  return (
    <Card padding="">
      <div className="flex items-center gap-2 border-b border-[var(--border)] px-4 py-3">
        <CheckSquare size={13} style={{ color: "var(--success)" }} />
        <h3 className="font-display text-sm font-semibold text-[var(--text)]">
          Action Items ({defaultItems.length})
        </h3>
      </div>
      <div className="divide-y divide-[var(--border)]">
        {defaultItems.map((item, i) => (
          <div key={i} className="flex items-start gap-3 px-4 py-3">
            <input type="checkbox" className="mt-0.5 accent-[var(--highlight)]" />
            <div>
              <p className="text-sm text-[var(--text)]">{item.task}</p>
              <div className="mt-0.5 flex items-center gap-1">
                <User size={10} style={{ color: "var(--text-muted)" }} />
                <span className="text-xs text-[var(--text-muted)]">{item.assignee}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
}
