import { Mic, MicOff, Video, VideoOff, MonitorUp, PhoneOff, Hand } from "lucide-react";
import { useNavigate } from "react-router-dom";
import useMediaStore from "../../core/store/mediaStore.js";

export default function ControlBar({ meetingId }) {
  const navigate = useNavigate();
  const {
    audioEnabled, toggleAudio,
    videoEnabled, toggleVideo,
    screenSharing, toggleScreenShare,
    isRecording,
  } = useMediaStore();

  const handleLeave = () => {
    navigate("/meetings");
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

        <button
          onClick={toggleScreenShare}
          className={`${btn} ${screenSharing ? "bg-[var(--brand-subtle)] text-[var(--brand)]" : "text-[var(--text)]"}`}
          aria-label="Share screen"
        >
          <MonitorUp size={18} />
          <span className={label}>Share</span>
        </button>

        <button className={`${btn} text-[var(--text)]`} aria-label="Raise hand">
          <Hand size={18} />
          <span className={label}>Hand</span>
        </button>

        {isRecording && (
          <div className="flex items-center gap-1.5 rounded-md border border-[var(--border)] bg-[var(--live-subtle)] px-2.5 py-2">
            <span className="live-badge h-2 w-2 rounded-full bg-[var(--live)]" />
            <span className="text-xs font-medium text-[var(--live)]">REC</span>
          </div>
        )}

        <div className="mx-1.5 h-8 w-px bg-[var(--border)]" />

        <button
          onClick={handleLeave}
          className="flex items-center gap-2 rounded-md bg-[var(--error)] px-4 py-2 text-sm font-medium text-white transition-opacity hover:opacity-90"
        >
          <PhoneOff size={16} />
          Leave
        </button>
      </div>
    </div>
  );
}