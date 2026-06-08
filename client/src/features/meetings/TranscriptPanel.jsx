import { Mic } from "lucide-react";
import Card from "../../shared/ui/Card.jsx";
import useRealtimeStore from "../../core/store/realtimeStore.js";
import { formatTime } from "../../shared/utils/formatters.js";

export default function TranscriptPanel() {
  const { transcript, isTranscribing } = useRealtimeStore();

  return (
    <Card padding="">
      <div className="flex items-center justify-between border-b border-[var(--border)] px-4 py-3">
        <h3 className="font-display text-sm font-semibold text-[var(--text)]">Live Transcript</h3>
        {isTranscribing && (
          <div className="flex items-center gap-1.5">
            <Mic size={12} className="text-[var(--accent)]" />
            <span className="text-xs text-[var(--accent)]">Transcribing</span>
          </div>
        )}
      </div>
      <div className="h-40 overflow-y-auto p-4 space-y-2">
        {transcript.length === 0 ? (
          <p className="text-center text-xs text-[var(--text-muted)] py-4">
            Transcript will appear here when the meeting starts.
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
