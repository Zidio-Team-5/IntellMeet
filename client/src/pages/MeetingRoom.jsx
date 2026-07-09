import { useState } from "react";
import { useParams } from "react-router-dom";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { MessageSquare, Users, Sparkles, Link as LinkIcon, Check, PanelRightClose, PanelRightOpen } from "lucide-react";
import VideoGrid from "../features/meetings/VideoGrid.jsx";
import ParticipantList from "../features/meetings/ParticipantList.jsx";
import ChatPanel from "../features/chat/ChatPanel.jsx";
import ControlBar from "../features/meetings/ControlBar.jsx";
import WaitingRoom from "../features/meetings/WaitingRoom.jsx";
import TranscriptPanel from "../features/meetings/TranscriptPanel.jsx";
import AISummaryPanel from "../features/meetings/AISummaryPanel.jsx";
import ActionItemsPanel from "../features/meetings/ActionItemsPanel.jsx";
import SegmentedControl from "../shared/ui/SegmentedControl.jsx";
import useRealtimeMeeting from "../shared/hooks/useRealtimeMeeting.js";
import useMeetingMedia from "../shared/hooks/useMeetingMedia.js";
import useParticipants from "../shared/hooks/useParticipants.js";
import useMeetingSession from "../shared/hooks/useMeetingSession.js";
import useAuthStore from "../core/store/authStore.js";
import useMediaStore from "../core/store/mediaStore.js";
import useMeetingGateStore from "../core/store/meetingGateStore.js";
import { canManageMeeting } from "../shared/utils/permissions.js";
import { generateMeetingNotes } from "../services/meetingService.js";
import { toast } from "../core/store/toastStore.js";

const TABS = [
  { label: "Chat", value: "chat" },
  { label: "People", value: "people" },
  { label: "AI", value: "ai" },
];

export default function MeetingRoom() {
  const { id } = useParams();
  const { participants, pinnedId } = useParticipants();
  const { data: meeting } = useMeetingSession(id);
  const [tab, setTab] = useState("chat");
  const [copied, setCopied] = useState(false);
  const [dockOpen, setDockOpen] = useState(true);
  const queryClient = useQueryClient();

  useRealtimeMeeting(id);
  const { localParticipant } = useMeetingMedia(id);
  const { user } = useAuthStore();
  const { screenSharing } = useMediaStore();
  const gate = useMeetingGateStore((s) => s.gate);
  const blockedReason = useMeetingGateStore((s) => s.blockedReason);

  // Unique people by user (defends against any transient duplicate roster rows).
  const uniqueRemote = [];
  const seen = new Set();
  for (const p of participants) {
    const key = p.userId || p.id || p.socketId;
    if (key && !seen.has(key)) { seen.add(key); uniqueRemote.push(p); }
  }
  const participantCount = uniqueRemote.length + 1;

  // Spotlight priority: a pinned participant, else whoever is screen-sharing.
  const pinned = pinnedId
    ? [...uniqueRemote, { ...localParticipant, _isLocal: true }].find((p) => (p.socketId || p.id) === pinnedId)
    : null;
  const remoteSharing = uniqueRemote.find((p) => p.screenSharing);
  const spotlight = pinned || remoteSharing || (screenSharing ? { ...localParticipant, _isLocal: true } : null);

  const isHost = canManageMeeting(user, meeting);

  const notesMutation = useMutation({
    mutationFn: () => generateMeetingNotes(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["meeting", id] });
      toast({ type: "success", title: "AI notes ready", message: "Summary and action items generated." });
    },
    onError: (e) =>
      toast({ type: "error", title: "Notes failed", message: e?.response?.data?.message || "Could not generate notes." }),
  });

  const summary = notesMutation.data?.summary ?? meeting?.summary ?? "";
  const actionItems = notesMutation.data?.actionItems ?? meeting?.actionItems ?? [];

  const shareId = meeting?.meetingId || meeting?.roomId || id;
  const handleCopyLink = async () => {
    const url = `${window.location.origin}/meeting/${shareId}`;
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      toast({ type: "success", title: "Link copied", message: "Invite link copied to clipboard." });
      setTimeout(() => setCopied(false), 2000);
    } catch {
      toast({ type: "error", title: "Copy failed", message: url });
    }
  };

  // Admission gate: until the host admits us (or if blocked/removed/ended),
  // show the waiting room instead of the meeting. The hooks above stay mounted
  // so the socket gating keeps working.
  if (gate !== "admitted") {
    return <WaitingRoom gate={gate} title={meeting?.title} reason={blockedReason} />;
  }

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
              {participantCount} participants · {meeting?.status === "live" ? "Live" : "In session"}
            </p>
          </div>
        </div>
        <div className="flex flex-shrink-0 items-center gap-2">
          <button
            onClick={handleCopyLink}
            aria-label="Copy invite link"
            title={`Meeting ID: ${shareId}`}
            className="flex items-center gap-1.5 rounded-md border border-[var(--border)] bg-[var(--card)] px-2.5 py-1 text-xs font-medium text-[var(--text-secondary)] transition-colors hover:border-[var(--border-hover)] hover:text-[var(--text)]"
          >
            {copied ? <Check size={13} /> : <LinkIcon size={13} />}
            <span className="hidden sm:inline">{copied ? "Copied" : "Copy link"}</span>
          </button>
          {meeting?.isRecording && (
            <span className="flex items-center gap-1.5 rounded-full bg-[var(--live-subtle)] px-2.5 py-1 text-xs font-medium text-[var(--live)]">
              <span className="live-badge h-1.5 w-1.5 rounded-full bg-[var(--live)]" />
              REC
            </span>
          )}
          <button
            onClick={() => setDockOpen((v) => !v)}
            aria-label={dockOpen ? "Hide panel" : "Show panel"}
            title={dockOpen ? "Hide panel" : "Show panel"}
            className="hidden items-center justify-center rounded-md border border-[var(--border)] bg-[var(--card)] p-1.5 text-[var(--text-secondary)] transition-colors hover:border-[var(--border-hover)] hover:text-[var(--text)] lg:flex"
          >
            {dockOpen ? <PanelRightClose size={15} /> : <PanelRightOpen size={15} />}
          </button>
        </div>
      </div>

      {/* Main: video + dock (stacked on mobile, side-by-side on lg) */}
      <div className="flex min-h-0 flex-1 flex-col lg:flex-row">
        {/* Video */}
        <div className="min-h-0 flex-1 overflow-hidden p-4 pb-24">
          <VideoGrid participants={uniqueRemote} localParticipant={localParticipant} spotlight={spotlight} />
        </div>

        {/* Dock (retractable on desktop) */}
        <div className={`${dockOpen ? "flex" : "hidden"} max-h-[45vh] min-h-0 flex-col border-t border-[var(--border)] lg:max-h-none lg:w-80 lg:flex-none lg:border-l lg:border-t-0`}>
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
              <ParticipantList participants={uniqueRemote} localParticipant={localParticipant} isHost={isHost} />
            </div>
            <div className={tab === "ai" ? "space-y-3" : "hidden"}>
              <TranscriptPanel meetingTitle={meeting?.title} />
              <AISummaryPanel
                summary={summary}
                onGenerate={() => notesMutation.mutate()}
                loading={notesMutation.isPending}
              />
              <ActionItemsPanel items={actionItems} />
            </div>
          </div>
        </div>
      </div>

      <ControlBar meetingId={id} isHost={isHost} />
    </div>
  );
}