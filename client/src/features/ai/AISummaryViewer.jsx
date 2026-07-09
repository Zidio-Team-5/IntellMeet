import { useState } from "react";
import { FileText, Copy, Check, Sparkles } from "lucide-react";
import Card from "../../shared/ui/Card.jsx";
import Button from "../../shared/ui/Button.jsx";
import EmptyState from "../../shared/ui/EmptyState.jsx";
import useAISummary from "../../shared/hooks/useAISummary.js";
import useAIContextStore from "../../core/store/aiContextStore.js";

const SAMPLE_TRANSCRIPT = "Team reviewed sprint goals. Backend API integration is complete. Frontend team will begin WebRTC implementation next week. Deployment to staging planned for Thursday. Action items assigned to Alex, Sarah, and John.";

export default function AISummaryViewer({ summary: propSummary, transcript }) {
  const [summary, setSummary] = useState(propSummary || "");
  const [copied, setCopied] = useState(false);
  const aiSummary = useAISummary();
  const { attachedText } = useAIContextStore();

  const handleGenerate = async () => {
    const text = transcript || attachedText || SAMPLE_TRANSCRIPT;
    try {
      const result = await aiSummary.mutateAsync(text);
      setSummary(result.summary || result.text || result);
    } catch {
      setSummary("Failed to generate summary. Please try again.");
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(summary);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <Card padding="" style={{ minHeight: "520px" }}>
      <div className="flex items-center justify-between border-b border-[var(--border)] px-5 py-3.5">
        <div className="flex items-center gap-2">
          <FileText size={14} className="text-[var(--text-secondary)]" />
          <h3 className="font-display text-sm font-semibold text-[var(--text)]">Meeting summary</h3>
        </div>
        <div className="flex items-center gap-2">
          {summary && (
            <button
              onClick={handleCopy}
              className="flex items-center gap-1 rounded-md px-2.5 py-1.5 text-xs text-[var(--text-muted)] transition-colors hover:bg-[var(--muted)] hover:text-[var(--text)]"
            >
              {copied ? <Check size={12} /> : <Copy size={12} />}
              {copied ? "Copied" : "Copy"}
            </button>
          )}
          <Button size="sm" icon={Sparkles} loading={aiSummary.isPending} onClick={handleGenerate}>
            Generate
          </Button>
        </div>
      </div>

      <div className="p-5">
        {summary ? (
          <p className="whitespace-pre-wrap text-sm leading-relaxed text-[var(--text-secondary)]">
            {summary}
          </p>
        ) : (
          <EmptyState
            icon={Sparkles}
            title="No summary yet"
            description="Click Generate to create an AI summary from the transcript."
          />
        )}
      </div>
    </Card>
  );
}