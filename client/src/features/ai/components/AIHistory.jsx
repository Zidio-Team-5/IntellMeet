import { Clock, MessageSquare } from "lucide-react";
import { formatRelativeTime } from "../../../shared/utils/formatters.js";

const MOCK_HISTORY = [
  { id: 1, query: "Summarize last sprint planning",     response: "Sprint goals reviewed…", time: new Date(Date.now() - 3600000) },
  { id: 2, query: "Extract action items from Demo",     response: "3 items extracted…",     time: new Date(Date.now() - 86400000) },
  { id: 3, query: "What did the team decide about API?", response: "Backend integration…",  time: new Date(Date.now() - 172800000) },
];

export default function AIHistory({ onSelect }) {
  return (
    <div className="space-y-2">
      <p className="mb-3 text-[11px] font-semibold uppercase tracking-wider text-[var(--text-muted)]">
        Recent queries
      </p>
      {MOCK_HISTORY.map((h) => (
        <button
          key={h.id}
          onClick={() => onSelect?.(h.query)}
          className="flex w-full items-start gap-3 rounded-md border border-[var(--border)] p-3 text-left transition-colors hover:bg-[var(--muted)]"
        >
          <MessageSquare size={14} className="mt-0.5 flex-shrink-0 text-[var(--text-muted)]" />
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm text-[var(--text)]">{h.query}</p>
            <div className="mt-0.5 flex items-center gap-1">
              <Clock size={10} className="text-[var(--text-muted)]" />
              <span className="text-xs text-[var(--text-muted)]">{formatRelativeTime(h.time)}</span>
            </div>
          </div>
        </button>
      ))}
    </div>
  );
}