import { Lightbulb } from "lucide-react";
import Card from "../../shared/ui/Card.jsx";

export default function MeetingInsights({ insights = [] }) {
  const defaultInsights = insights.length > 0 ? insights : [
    "Meetings under 45 min have 23% higher action item completion rates.",
    "Engineering team leads in productivity score for 3 consecutive months.",
    "AI summaries reduced meeting follow-up effort by 52% on average.",
    "Thursday 2–4 PM shows the highest team attendance rate.",
  ];

  return (
    <Card padding="">
      <div className="flex items-center gap-2 border-b border-[var(--border)] px-5 py-3.5">
        <Lightbulb size={14} className="text-[var(--text-muted)]" />
        <h3 className="font-display text-sm font-semibold text-[var(--text)]">Meeting insights</h3>
      </div>
      <div className="divide-y divide-[var(--border-subtle)]">
        {defaultInsights.map((insight, i) => (
          <div key={i} className="flex items-start gap-3 px-5 py-3.5">
            <span className="mt-0.5 flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full border border-[var(--border)] bg-[var(--muted)] text-[10px] font-semibold tabular-nums text-[var(--text-secondary)]">
              {i + 1}
            </span>
            <p className="text-sm leading-relaxed text-[var(--text-secondary)]">{insight}</p>
          </div>
        ))}
      </div>
    </Card>
  );
}