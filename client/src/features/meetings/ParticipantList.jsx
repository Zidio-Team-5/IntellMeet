import { Mic, MicOff, Video, VideoOff } from "lucide-react";
import Card from "../../shared/ui/Card.jsx";
import { initials, avatarColor } from "../../shared/utils/formatters.js";

export default function ParticipantList({ participants = [] }) {
  return (
    <Card padding="">
      <div className="flex items-center justify-between border-b border-[var(--border)] px-4 py-3">
        <h3 className="font-display text-sm font-semibold text-[var(--text)]">
          Participants ({participants.length})
        </h3>
      </div>
      <div className="max-h-48 overflow-y-auto divide-y divide-[var(--border)]">
        {participants.map((p) => (
          <div key={p._id || p.id || p.socketId} className="flex items-center justify-between px-4 py-2.5">
            <div className="flex items-center gap-2.5">
              <div
                className="flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-lg text-[11px] font-bold text-white"
                style={{ background: avatarColor(p.name || "U") }}
              >
                {initials(p.name || "U")}
              </div>
              <span className="text-sm text-[var(--text)] font-medium">{p.name || "Participant"}</span>
            </div>
            <div className="flex items-center gap-1">
              {p.audioMuted
                ? <MicOff size={13} className="text-red-400" />
                : <Mic size={13} className="text-green-400" />}
              {p.videoMuted
                ? <VideoOff size={13} className="text-red-400" />
                : <Video size={13} className="text-green-400" />}
            </div>
          </div>
        ))}
        {participants.length === 0 && (
          <p className="px-4 py-4 text-center text-xs text-[var(--text-muted)]">
            No participants yet
          </p>
        )}
      </div>
    </Card>
  );
}
