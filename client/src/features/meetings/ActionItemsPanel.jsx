import { CheckSquare, User } from "lucide-react";
import Card from "../../shared/ui/Card.jsx";

export default function ActionItemsPanel({ items = [] }) {
  return (
    <Card padding="">
      <div className="flex items-center gap-2 border-b border-[var(--border)] px-4 py-3">
        <CheckSquare size={13} style={{ color: "var(--success)" }} />
        <h3 className="font-display text-sm font-semibold text-[var(--text)]">
          Action Items ({items.length})
        </h3>
      </div>
      <div className="divide-y divide-[var(--border)]">
        {items.length === 0 ? (
          <p className="px-4 py-4 text-center text-xs text-[var(--text-muted)]">
            Action items appear here once notes are generated.
          </p>
        ) : (
          items.map((item, i) => (
            <div key={i} className="flex items-start gap-3 px-4 py-3">
              <input type="checkbox" className="mt-0.5 accent-[var(--highlight)]" />
              <div>
                <p className="text-sm text-[var(--text)]">{item.task}</p>
                <div className="mt-0.5 flex items-center gap-1">
                  <User size={10} style={{ color: "var(--text-muted)" }} />
                  <span className="text-xs text-[var(--text-muted)]">{item.assignee || "Team"}</span>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </Card>
  );
}
