import { useState } from "react";
import { Mic, MicOff, Video, VideoOff, MonitorUp, PhoneOff, Hand, ChevronUp } from "lucide-react";
import { useNavigate } from "react-router-dom";
import useMediaStore from "../../core/store/mediaStore.js";
import useMeetingGateStore from "../../core/store/meetingGateStore.js";
import { getSocket } from "../../services/socketService.js";
import { leaveMeeting, endMeeting } from "../../services/meetingService.js";
import { toast } from "../../core/store/toastStore.js";

export default function ControlBar({ meetingId, isHost = false }) {
  const navigate = useNavigate();
  const [leaveMenu, setLeaveMenu] = useState(false);
  const {
    audioEnabled, toggleAudio,
    videoEnabled, toggleVideo,
    screenSharing, toggleScreenShare,
    handRaised, toggleHand,
    isRecording,
  } = useMediaStore();
  const { moderation } = useMeetingGateStore();

  const goBack = () => navigate("/meetings");

  const handleLeaveOnly = async () => {
    try { await leaveMeeting(meetingId); } catch { /* socket cleans up too */ }
    goBack();
  };

  const handleEndForAll = async () => {
    const socket = getSocket();
    if (socket) socket.emit("meeting:end-all");
    try { await endMeeting(meetingId); } catch { /* best effort */ }
    goBack();
  };

  const handleMemberLeave = async () => {
    try { await leaveMeeting(meetingId); } catch { /* noop */ }
    goBack();
  };

  const handleShare = () => {
    // Respect a host screen-share lock for non-hosts.
    if (!screenSharing && moderation.screenShareLocked && !isHost) {
      toast({ type: "warning", title: "Sharing locked", message: "The host has disabled screen sharing." });
      return;
    }
    toggleScreenShare();
  };

  const btn = "flex flex-col items-center gap-1 rounded-md p-2.5 transition-colors hover:bg-[var(--muted)]";
  const label = "text-[10px] text-[var(--text-muted)]";

  return (
    <div className="fixed bottom-5 left-1/2 z-50 -translate-x-1/2">
      <div className="flex items-center gap-1 rounded-lg border border-[var(--border)] bg-[var(--card)] px-3 py-1.5 shadow-[var(--shadow-xl)]">
        <button onClick={toggleAudio} className={`${btn} ${!audioEnabled ? "text-[var(--error)]" : "text-[var(--text)]"}`} aria-label={audioEnabled ? "Mute" : "Unmute"}>
          {audioEnabled ? <Mic size={18} /> : <MicOff size={18} />}
          <span className={label}>{audioEnabled ? "Mute" : "Unmute"}</span>
        </button>

        <button onClick={toggleVideo} className={`${btn} ${!videoEnabled ? "text-[var(--error)]" : "text-[var(--text)]"}`} aria-label={videoEnabled ? "Stop video" : "Start video"}>
          {videoEnabled ? <Video size={18} /> : <VideoOff size={18} />}
          <span className={label}>{videoEnabled ? "Stop" : "Start"}</span>
        </button>

        <button onClick={handleShare} className={`${btn} ${screenSharing ? "bg-[var(--brand-subtle)] text-[var(--brand)]" : "text-[var(--text)]"}`} aria-label="Share screen">
          <MonitorUp size={18} />
          <span className={label}>{screenSharing ? "Stop share" : "Share"}</span>
        </button>

        <button onClick={toggleHand} className={`${btn} ${handRaised ? "bg-[var(--brand-subtle)] text-[var(--brand)]" : "text-[var(--text)]"}`} aria-pressed={handRaised} aria-label={handRaised ? "Lower hand" : "Raise hand"}>
          <Hand size={18} />
          <span className={label}>{handRaised ? "Lower" : "Hand"}</span>
        </button>

        {isRecording && (
          <div className="flex items-center gap-1.5 rounded-md border border-[var(--border)] bg-[var(--live-subtle)] px-2.5 py-2">
            <span className="live-badge h-2 w-2 rounded-full bg-[var(--live)]" />
            <span className="text-xs font-medium text-[var(--live)]">REC</span>
          </div>
        )}

        <div className="mx-1.5 h-8 w-px bg-[var(--border)]" />

        {isHost ? (
          <div className="relative">
            <button
              onClick={() => setLeaveMenu((v) => !v)}
              className="flex items-center gap-2 rounded-md bg-[var(--error)] px-4 py-2 text-sm font-medium text-white transition-opacity hover:opacity-90"
            >
              <PhoneOff size={16} />
              Leave
              <ChevronUp size={14} className={`transition-transform ${leaveMenu ? "" : "rotate-180"}`} />
            </button>
            {leaveMenu && (
              <div className="absolute bottom-full right-0 mb-2 w-56 overflow-hidden rounded-lg border border-[var(--border)] bg-[var(--card)] shadow-[var(--shadow-xl)]">
                <button onClick={handleLeaveOnly} className="block w-full px-4 py-2.5 text-left text-sm text-[var(--text)] hover:bg-[var(--muted)]">
                  Leave meeting
                  <span className="block text-xs text-[var(--text-muted)]">Others stay in the meeting</span>
                </button>
                <button onClick={handleEndForAll} className="block w-full border-t border-[var(--border)] px-4 py-2.5 text-left text-sm text-[var(--error)] hover:bg-[var(--muted)]">
                  End meeting for everyone
                  <span className="block text-xs text-[var(--text-muted)]">Removes all participants</span>
                </button>
              </div>
            )}
          </div>
        ) : (
          <button onClick={handleMemberLeave} className="flex items-center gap-2 rounded-md bg-[var(--error)] px-4 py-2 text-sm font-medium text-white transition-opacity hover:opacity-90">
            <PhoneOff size={16} />
            Leave
          </button>
        )}
      </div>
    </div>
  );
}
