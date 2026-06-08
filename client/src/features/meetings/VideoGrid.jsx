import { Mic, MicOff } from "lucide-react";
import { initials, avatarColor } from "../../shared/utils/formatters.js";

function VideoTile({ participant, isLocal }) {
  return (
    <div className="relative flex aspect-video items-center justify-center overflow-hidden rounded-lg border border-[var(--border)] bg-[var(--card)]">
      {participant?.stream ? (
        <video autoPlay muted={isLocal} playsInline
          className="h-full w-full object-cover"
          ref={(el) => { if (el && participant.stream) el.srcObject = participant.stream; }}
        />
      ) : (
        <div className="flex flex-col items-center gap-2">
          <div
            className="flex h-16 w-16 items-center justify-center rounded-lg text-xl font-bold text-white"
            style={{ background: avatarColor(participant?.name || "U") }}
          >
            {initials(participant?.name || "User")}
          </div>
          <p className="text-sm font-medium text-[var(--text-secondary)]">
            {participant?.name || "Participant"}
          </p>
        </div>
      )}

      <div className="absolute bottom-2 left-2 flex items-center gap-1.5 rounded-md bg-black/60 px-2 py-1">
        <span className="max-w-[100px] truncate text-xs font-medium text-white">
          {isLocal ? "You" : participant?.name}
        </span>
        {participant?.audioMuted ? (
          <MicOff size={12} className="text-[var(--error)]" />
        ) : (
          <Mic size={12} className="text-[var(--success)]" />
        )}
      </div>

      {isLocal && (
        <div className="absolute right-2 top-2 rounded-full bg-[var(--brand)] px-2 py-0.5 text-[10px] font-medium text-white">
          You
        </div>
      )}
    </div>
  );
}

export default function VideoGrid({ participants = [], localParticipant }) {
  const total = participants.length + (localParticipant ? 1 : 0);
  const gridClass = total <= 1 ? "grid-cols-1" :
    total <= 2 ? "grid-cols-1 sm:grid-cols-2" :
    total <= 4 ? "grid-cols-2" :
    "grid-cols-2 lg:grid-cols-3";

  return (
    <div className={`grid h-full gap-3 ${gridClass}`}>
      {localParticipant && <VideoTile participant={localParticipant} isLocal />}
      {participants.map((p) => (
        <VideoTile key={p._id || p.id || p.socketId} participant={p} isLocal={false} />
      ))}
      {total === 0 && (
        <div className="col-span-full flex aspect-video items-center justify-center rounded-lg border border-dashed border-[var(--border)]">
          <p className="text-sm text-[var(--text-muted)]">Waiting for participants…</p>
        </div>
      )}
    </div>
  );
}