import { useState } from "react";
import { useParams } from "react-router-dom";
import { MessageSquare, Users, Sparkles } from "lucide-react";
import VideoGrid from "../features/meetings/VideoGrid.jsx";
import ParticipantList from "../features/meetings/ParticipantList.jsx";
import ChatPanel from "../features/chat/ChatPanel.jsx";
import ControlBar from "../features/meetings/ControlBar.jsx";
import TranscriptPanel from "../features/meetings/TranscriptPanel.jsx";
import AISummaryPanel from "../features/meetings/AISummaryPanel.jsx";
import ActionItemsPanel from "../features/meetings/ActionItemsPanel.jsx";
import SegmentedControl from "../shared/ui/SegmentedControl.jsx";
import useRealtimeMeeting from "../shared/hooks/useRealtimeMeeting.js";
import useParticipants from "../shared/hooks/useParticipants.js";
import useMeetingSession from "../shared/hooks/useMeetingSession.js";

const TABS = [
  { label: "Chat", value: "chat" },
  { label: "People", value: "people" },
  { label: "AI", value: "ai" },
];

export default function MeetingRoom() {
  const { id } = useParams();
  const { participants } = useParticipants();
  const { data: meeting } = useMeetingSession(id);
  const [tab, setTab] = useState("chat");

  useRealtimeMeeting(id);

  return (
    <div className="flex h-screen flex-col overflow-hidden bg-[var(--background)] text-[var(--text)]">
      {/* Top bar */}
      <div className="flex h-12 flex-shrink-0 items-center justify-between gap-3 border-b border-[var(--border)] px-4">
        <div className="flex items-center gap-2.5 min-w-0">
          <MessageSquare size={15} className="flex-shrink-0 text-[var(--text-muted)]" />
          <div className="min-w-0">
            <h1 className="truncate font-display text-sm font-semibold text-[var(--text)]">
              {meeting?.title || "Meeting Room"}
            </h1>
            <p className="text-xs text-[var(--text-muted)]">
              {participants.length} participants · {meeting?.status === "live" ? "Live" : "In session"}
            </p>
          </div>
        </div>
        {meeting?.isRecording && (
          <span className="flex flex-shrink-0 items-center gap-1.5 rounded-full bg-[var(--live-subtle)] px-2.5 py-1 text-xs font-medium text-[var(--live)]">
            <span className="live-badge h-1.5 w-1.5 rounded-full bg-[var(--live)]" />
            REC
          </span>
        )}
      </div>

      {/* Main: video + dock (stacked on mobile, side-by-side on lg) */}
      <div className="flex min-h-0 flex-1 flex-col lg:flex-row">
        {/* Video */}
        <div className="min-h-0 flex-1 overflow-hidden p-4 pb-24">
          <VideoGrid participants={participants} />
        </div>

        {/* Dock */}
        <div className="flex max-h-[45vh] min-h-0 flex-col border-t border-[var(--border)] lg:max-h-none lg:w-80 lg:flex-none lg:border-l lg:border-t-0">
          <div className="border-b border-[var(--border)] p-2.5">
            <SegmentedControl
              options={TABS}
              value={tab}
              onChange={setTab}
              size="sm"
              className="w-full"
              ariaLabel="Meeting panels"
            />
          </div>

          {/* All panels stay mounted; visibility toggled (preserves realtime lifecycles) */}
          <div className="min-h-0 flex-1 overflow-y-auto p-2.5 pb-24 lg:pb-24">
            <div className={tab === "chat" ? "h-full" : "hidden"}>
              <ChatPanel meetingId={id} />
            </div>
            <div className={tab === "people" ? "" : "hidden"}>
              <ParticipantList participants={participants} />
            </div>
            <div className={tab === "ai" ? "space-y-3" : "hidden"}>
              <TranscriptPanel />
              <AISummaryPanel />
              <ActionItemsPanel />
            </div>
          </div>
        </div>
      </div>

      <ControlBar meetingId={id} />
    </div>
  );
}