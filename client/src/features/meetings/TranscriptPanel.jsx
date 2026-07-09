import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Mic, Copy, Check, Sparkles } from "lucide-react";
import Card from "../../shared/ui/Card.jsx";
import useRealtimeStore from "../../core/store/realtimeStore.js";
import useAIContextStore from "../../core/store/aiContextStore.js";
import { formatTime } from "../../shared/utils/formatters.js";

const SR_SUPPORTED = typeof window !== "undefined" && !!(window.SpeechRecognition || window.webkitSpeechRecognition);

const asText = (transcript) => transcript.map((e) => `${e.speaker}: ${e.text}`).join("\n");

export default function TranscriptPanel({ meetingTitle }) {
  const { transcript, isTranscribing } = useRealtimeStore();
  const { setAttachedContext } = useAIContextStore();
  const [copied, setCopied] = useState(false);
  const navigate = useNavigate();

  const handleCopy = () => {
    navigator.clipboard.writeText(asText(transcript));
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleAnalyze = () => {
    setAttachedContext(asText(transcript), meetingTitle || "Live meeting");
    navigate("/ai");
  };

  return (
    <Card padding="">
      <div className="flex items-center justify-between border-b border-[var(--border)] px-4 py-3">
        <h3 className="font-display text-sm font-semibold text-[var(--text)]">Live Transcript</h3>
        <div className="flex items-center gap-2">
          {isTranscribing && (
            <div className="flex items-center gap-1.5">
              <Mic size={12} className="text-[var(--accent)]" />
              <span className="text-xs text-[var(--accent)]">Transcribing</span>
            </div>
          )}
          {transcript.length > 0 && (
            <>
              <button
                onClick={handleCopy}
                aria-label="Copy transcript"
                className="flex items-center gap-1 rounded-md px-2 py-1 text-xs text-[var(--text-muted)] transition-colors hover:bg-[var(--muted)] hover:text-[var(--text)]"
              >
                {copied ? <Check size={11} /> : <Copy size={11} />}
                {copied ? "Copied" : "Copy"}
              </button>
              <button
                onClick={handleAnalyze}
                aria-label="Analyze transcript with AI"
                className="flex items-center gap-1 rounded-md px-2 py-1 text-xs text-[var(--brand)] transition-colors hover:bg-[var(--brand-subtle)]"
              >
                <Sparkles size={11} />
                Analyze
              </button>
            </>
          )}
        </div>
      </div>
      <div className="h-40 overflow-y-auto p-4 space-y-2">
        {transcript.length === 0 ? (
          <p className="text-center text-xs text-[var(--text-muted)] py-4">
            {SR_SUPPORTED
              ? "Transcript will appear here when the meeting starts."
              : "Live captions aren't supported in this browser (try Chrome or Edge). Chat messages will still appear here."}
          </p>
        ) : (
          transcript.map((entry, i) => (
            <div key={i} className="text-xs leading-relaxed">
              <span className="font-semibold text-[var(--highlight)]">{entry.speaker}: </span>
              <span className="text-[var(--text-secondary)]">{entry.text}</span>
            </div>
          ))
        )}
      </div>
    </Card>
  );
}
