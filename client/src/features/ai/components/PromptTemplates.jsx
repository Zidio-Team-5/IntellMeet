import { Zap } from "lucide-react";

const TEMPLATES = [
  { label: "Summarize meeting",    prompt: "Summarize the key points from the last meeting." },
  { label: "Extract action items", prompt: "Extract all action items from the transcript and list them with assignees." },
  { label: "Team performance",     prompt: "Analyze team performance based on recent meeting data." },
  { label: "Follow-up email",      prompt: "Draft a follow-up email based on the meeting summary." },
  { label: "Identify blockers",    prompt: "Identify any blockers or risks mentioned in the last meeting." },
  { label: "Next sprint goals",    prompt: "Based on this sprint review, suggest goals for the next sprint." },
];

export default function PromptTemplates({ onSelect }) {
  return (
    <div>
      <p className="mb-3 text-[11px] font-semibold uppercase tracking-wider text-[var(--text-muted)]">
        Quick templates
      </p>
      <div className="grid grid-cols-2 gap-2">
        {TEMPLATES.map((t) => (
          <button
            key={t.label}
            onClick={() => onSelect?.(t.prompt)}
            className="group flex items-center gap-2 rounded-md border border-[var(--border)] px-3 py-2.5 text-left transition-colors hover:border-[var(--border-hover)] hover:bg-[var(--muted)]"
          >
            <Zap size={12} className="flex-shrink-0 text-[var(--text-muted)] group-hover:text-[var(--brand)]" />
            <span className="truncate text-xs text-[var(--text-secondary)] group-hover:text-[var(--text)]">
              {t.label}
            </span>
          </button>
        ))}
      </div>
    </div>
  );
}