import { Sparkles } from "lucide-react";
import { Link } from "react-router-dom";
import Card from "../../shared/ui/Card.jsx";

const FALLBACK = [
  "Engineering team meetings average 18% shorter this sprint.",
  "AI summaries saved ~4 hours of follow-up work this week.",
  "Top action item: Backend API integration — 3 assignees.",
];

export default function AIInsightsWidget({ insights }) {
  const items = insights?.insights ?? insights ?? FALLBACK;
  return (
    <Card padding="">
      <div className="flex items-center justify-between border-b border-[var(--border)] px-5 py-3.5">
        <div className="flex items-center gap-2">
          <Sparkles size={14} className="text-[var(--brand)]" />
          <h3 className="font-display text-sm font-semibold text-[var(--text)]">AI insights</h3>
        </div>
        <Link to="/ai">
          <span className="text-xs text-[var(--text-muted)] transition-colors hover:text-[var(--text)]">
            Ask AI →
          </span>
        </Link>
      </div>
      <div className="divide-y divide-[var(--border-subtle)]">
        {items.map((insight, i) => (
          <div key={i} className="flex items-start gap-3 px-5 py-3">
            <span className="mt-0.5 flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full border border-[var(--border)] bg-[var(--muted)] text-[10px] font-semibold tabular-nums text-[var(--text-secondary)]">
              {i + 1}
            </span>
            <p className="text-xs leading-relaxed text-[var(--text-secondary)]">{insight}</p>
          </div>
        ))}
      </div>
    </Card>
  );
}