import { Sparkles } from "lucide-react";
import Card from "../../shared/ui/Card.jsx";

export default function AISummaryPanel({ summary }) {
  return (
    <Card padding="">
      <div className="flex items-center gap-2 border-b border-[var(--border)] px-4 py-3">
        <Sparkles size={13} style={{ color: "var(--accent)" }} />
        <h3 className="font-display text-sm font-semibold text-[var(--text)]">AI Summary</h3>
      </div>
      <div className="p-4">
        {summary ? (
          <p className="text-xs leading-relaxed text-[var(--text-secondary)]">{summary}</p>
        ) : (
          <p className="text-center text-xs text-[var(--text-muted)] py-2">
            AI summary will be generated after the meeting.
          </p>
        )}
      </div>
    </Card>
  );
}
