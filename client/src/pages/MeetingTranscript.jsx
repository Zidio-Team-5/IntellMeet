import { useParams, useNavigate, Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { Copy, Check, Sparkles, ArrowLeft, FileText, Video, ExternalLink } from "lucide-react";
import { useState } from "react";
import DashboardLayout from "../shared/layouts/DashboardLayout.jsx";
import PageHeader from "../shared/ui/PageHeader.jsx";
import Card from "../shared/ui/Card.jsx";
import Button from "../shared/ui/Button.jsx";
import EmptyState from "../shared/ui/EmptyState.jsx";
import Skeleton from "../shared/ui/Skeleton.jsx";
import { getMeetingDetails, getMeetingTranscript } from "../services/meetingService.js";
import useAIContextStore from "../core/store/aiContextStore.js";
import { formatDate } from "../shared/utils/formatters.js";

const asText = (entries) => entries.map((e) => `${e.senderName || e.speaker || "Speaker"}: ${e.message || e.text}`).join("\n");

export default function MeetingTranscript() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [copied, setCopied] = useState(false);
  const { setAttachedContext } = useAIContextStore();

  const { data: meeting, isLoading: loadingMeeting } = useQuery({
    queryKey: ["meeting", id],
    queryFn: () => getMeetingDetails(id),
  });
  const { data: transcriptData, isLoading: loadingTranscript } = useQuery({
    queryKey: ["meeting-transcript", id],
    queryFn: () => getMeetingTranscript(id),
  });

  const m = meeting?.meeting ?? meeting ?? {};
  const entries = transcriptData?.transcript ?? transcriptData ?? [];
  const isLoading = loadingMeeting || loadingTranscript;

  const handleCopy = () => {
    navigator.clipboard.writeText(asText(entries));
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleAnalyze = () => {
    setAttachedContext(asText(entries), m.title || "Meeting transcript");
    navigate("/ai");
  };

  return (
    <DashboardLayout>
      <PageHeader
        title={m.title || "Meeting transcript"}
        subtitle={m.createdAt ? formatDate(m.createdAt) : "Full transcript for this meeting."}
        actions={
          <Link to="/history">
            <Button variant="outline" icon={ArrowLeft}>Back to history</Button>
          </Link>
        }
      />

      {m.recordingUrl && (
        <Card padding="" className="mb-5">
          <div className="flex items-center justify-between px-5 py-3.5">
            <div className="flex items-center gap-2">
              <Video size={14} className="text-[var(--text-secondary)]" />
              <h3 className="font-display text-sm font-semibold text-[var(--text)]">Recording</h3>
              <span className="text-xs text-[var(--text-muted)]">Saved to Google Drive</span>
            </div>
            <a href={m.recordingUrl} target="_blank" rel="noopener noreferrer">
              <Button size="sm" icon={ExternalLink}>Open recording</Button>
            </a>
          </div>
        </Card>
      )}

      <Card padding="">
        <div className="flex items-center justify-between border-b border-[var(--border)] px-5 py-3.5">
          <div className="flex items-center gap-2">
            <FileText size={14} className="text-[var(--text-secondary)]" />
            <h3 className="font-display text-sm font-semibold text-[var(--text)]">Transcript</h3>
            {entries.length > 0 && (
              <span className="rounded-full border border-[var(--border)] bg-[var(--muted)] px-2 py-0.5 text-[10px] font-semibold text-[var(--text-secondary)]">
                {entries.length} entries
              </span>
            )}
          </div>
          {!isLoading && entries.length > 0 && (
            <div className="flex items-center gap-2">
              <Button size="sm" variant="outline" icon={copied ? Check : Copy} onClick={handleCopy}>
                {copied ? "Copied" : "Copy"}
              </Button>
              <Button size="sm" icon={Sparkles} onClick={handleAnalyze}>
                Analyze with AI
              </Button>
            </div>
          )}
        </div>

        <div className="max-h-[60vh] space-y-3 overflow-y-auto p-5">
          {isLoading ? (
            <div className="space-y-3">
              {[0, 1, 2, 3].map((i) => <Skeleton key={i} className="h-4 w-full" />)}
            </div>
          ) : entries.length === 0 ? (
            <EmptyState
              icon={FileText}
              title="No transcript yet"
              description="This meeting doesn't have any recorded transcript entries."
            />
          ) : (
            entries.map((e, i) => (
              <div key={i} className="text-sm leading-relaxed">
                <span className="font-semibold text-[var(--highlight)]">{e.senderName || e.speaker || "Speaker"}: </span>
                <span className="text-[var(--text-secondary)]">{e.message || e.text}</span>
              </div>
            ))
          )}
        </div>
      </Card>
    </DashboardLayout>
  );
}
