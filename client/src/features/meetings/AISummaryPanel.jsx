import { Sparkles } from "lucide-react";
import Card from "../../shared/ui/Card.jsx";

export default function AISummaryPanel({ summary, onGenerate, loading }) {
  return (
    <Card padding="">
      <div className="flex items-center justify-between border-b border-[var(--border)] px-4 py-3">
        <div className="flex items-center gap-2">
          <Sparkles size={13} style={{ color: "var(--accent)" }} />
          <h3 className="font-display text-sm font-semibold text-[var(--text)]">AI Summary</h3>
        </div>
        {onGenerate && (
          <button
            onClick={onGenerate}
            disabled={loading}
            className="flex items-center gap-1.5 rounded-md border border-[var(--border)] bg-[var(--card)] px-2.5 py-1 text-xs font-medium text-[var(--text-secondary)] transition-colors hover:border-[var(--border-hover)] hover:text-[var(--text)] disabled:opacity-50"
          >
            <Sparkles size={12} />
            {loading ? "Generating…" : summary ? "Regenerate" : "Generate notes"}
          </button>
        )}
      </div>
      <div className="p-4">
        {summary ? (
          <p className="whitespace-pre-line text-xs leading-relaxed text-[var(--text-secondary)]">{summary}</p>
        ) : (
          <p className="text-center text-xs text-[var(--text-muted)] py-2">
            AI summary will be generated from the transcript.
          </p>
        )}
      </div>
    </Card>
  );
}
