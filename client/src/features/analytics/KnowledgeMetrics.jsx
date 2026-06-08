import { FileText, Sparkles, CheckSquare } from "lucide-react";
import Card from "../../shared/ui/Card.jsx";

export default function KnowledgeMetrics({ transcripts = 248, summaries = 180, actionItems = 542 }) {
  const metrics = [
    { label: "Transcripts",  value: transcripts, icon: FileText },
    { label: "AI Summaries", value: summaries,   icon: Sparkles },
    { label: "Action Items", value: actionItems, icon: CheckSquare },
  ];

  return (
    <Card>
      <h3 className="mb-5 font-display text-sm font-semibold text-[var(--text)]">Knowledge base</h3>
      <div className="grid grid-cols-3 gap-4">
        {metrics.map(({ label, value, icon: Icon }) => (
          <div
            key={label}
            className="flex flex-col items-center gap-2 rounded-md border border-[var(--border)] bg-[var(--muted)] p-4 text-center"
          >
            <div className="flex h-10 w-10 items-center justify-center rounded-md border border-[var(--border)] bg-[var(--card)]">
              <Icon size={18} className="text-[var(--text-secondary)]" />
            </div>
            <p className="font-display text-2xl font-semibold tabular-nums text-[var(--text)]">{value}</p>
            <p className="text-xs text-[var(--text-muted)]">{label}</p>
          </div>
        ))}
      </div>
    </Card>
  );
}