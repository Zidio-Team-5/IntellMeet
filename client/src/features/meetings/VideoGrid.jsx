import { Mic, MicOff, Hand, MonitorUp, Pin, PinOff, Eye, EyeOff } from "lucide-react";
import { initials, avatarColor } from "../../shared/utils/formatters.js";
import useParticipantStore from "../../core/store/participantStore.js";

function TileControls({ id, isLocal, pinned, hidden, onPin, onHide }) {
  if (isLocal) return null;
  return (
    <div className="absolute right-2 top-2 flex items-center gap-1 opacity-0 transition-opacity group-hover:opacity-100">
      <button onClick={onHide} title={hidden ? "Show incoming video" : "Hide incoming video"}
        className="flex h-6 w-6 items-center justify-center rounded-md bg-black/60 text-white hover:bg-black/80">
        {hidden ? <EyeOff size={12} /> : <Eye size={12} />}
      </button>
      <button onClick={onPin} title={pinned ? "Unpin" : "Pin to screen"}
        className={`flex h-6 w-6 items-center justify-center rounded-md text-white hover:bg-black/80 ${pinned ? "bg-[var(--brand)]" : "bg-black/60"}`}>
        {pinned ? <PinOff size={12} /> : <Pin size={12} />}
      </button>
    </div>
  );
}

function VideoTile({ participant, isLocal, isScreen = false, compact = false, fill = false }) {
  const { pinnedId, hiddenVideoIds, togglePin, toggleHiddenVideo } = useParticipantStore();
  const pid = participant?.socketId || participant?.id;
  const pinned = pinnedId === pid;
  const hidden = hiddenVideoIds.includes(pid);
  const showHand = participant?.handRaised;
  const sizeClass = compact || fill ? "h-full w-full" : "aspect-video";
  const avatarClass = compact ? "h-10 w-10 text-sm" : "h-16 w-16 text-xl";
  const showVideo = participant?.stream && !participant?.videoMuted && !(hidden && !isLocal);

  return (
    <div className={`group relative flex ${sizeClass} items-center justify-center overflow-hidden rounded-lg border ${showHand ? "border-[var(--brand)]" : "border-[var(--border)]"} bg-[var(--card)]`}>
      {showVideo ? (
        <video
          autoPlay muted={isLocal} playsInline
          className={`h-full w-full ${isScreen ? "object-contain bg-black" : "object-contain bg-black"}`}
          ref={(el) => { if (el && participant.stream) el.srcObject = participant.stream; }}
        />
      ) : (
        <div className="flex flex-col items-center gap-2">
          <div className={`flex items-center justify-center rounded-lg font-bold text-white ${avatarClass}`} style={{ background: avatarColor(participant?.name || "U") }}>
            {initials(participant?.name || "User")}
          </div>
          {!compact && <p className="text-sm font-medium text-[var(--text-secondary)]">{participant?.name || "Participant"}</p>}
        </div>
      )}

      <div className="absolute bottom-2 left-2 flex items-center gap-1.5 rounded-md bg-black/60 px-2 py-1">
        <span className="max-w-[120px] truncate text-xs font-medium text-white">
          {isLocal ? "You" : participant?.name}{participant?.isHost ? " (Host)" : ""}
        </span>
        {participant?.audioMuted ? <MicOff size={12} className="text-[var(--error)]" /> : <Mic size={12} className="text-[var(--success)]" />}
        {participant?.screenSharing && <MonitorUp size={12} className="text-[var(--brand)]" />}
      </div>

      {showHand && (
        <div className="absolute left-2 top-2 rounded-full bg-[var(--brand)] p-1 text-white" title="Hand raised"><Hand size={12} /></div>
      )}

      {!compact && (
        <TileControls id={pid} isLocal={isLocal} pinned={pinned} hidden={hidden}
          onPin={() => togglePin(pid)} onHide={() => toggleHiddenVideo(pid)} />
      )}

      {isLocal && (
        <div className="absolute right-2 top-2 rounded-full bg-[var(--brand)] px-2 py-0.5 text-[10px] font-medium text-white">You</div>
      )}
    </div>
  );
}

const colsFor = (n) =>
  n <= 1 ? "grid-cols-1" : n <= 4 ? "grid-cols-2" : n <= 9 ? "grid-cols-3" : "grid-cols-4";

function SelfThumbnail({ participant }) {
  return (
    <div className="absolute bottom-3 right-3 z-20 aspect-video w-40 max-w-[34%] overflow-hidden rounded-lg shadow-[var(--shadow-xl)]">
      <VideoTile participant={participant} isLocal compact />
    </div>
  );
}

export default function VideoGrid({ participants = [], localParticipant, spotlight }) {
  const local = localParticipant ? { ...localParticipant, _isLocal: true } : null;

  if (spotlight) {
    const sid = spotlight.socketId || spotlight.id;
    const everyone = [...(local ? [local] : []), ...participants];
    const others = everyone.filter((p) => (p.socketId || p.id) !== sid);
    return (
      <div className="flex h-full flex-col gap-3">
        <div className="min-h-0 flex-1">
          <VideoTile participant={spotlight} isLocal={spotlight._isLocal} isScreen={!!spotlight.screenSharing} fill />
        </div>
        {others.length > 0 && (
          <div className="flex h-24 flex-shrink-0 gap-3 overflow-x-auto">
            {others.map((p) => (
              <div key={p._id || p.id || p.socketId} className="aspect-video h-full flex-shrink-0">
                <VideoTile participant={p} isLocal={p._isLocal} compact />
              </div>
            ))}
          </div>
        )}
      </div>
    );
  }

  const totalPeople = participants.length + (local ? 1 : 0);
  if (totalPeople === 0) {
    return (
      <div className="flex h-full items-center justify-center rounded-lg border border-dashed border-[var(--border)]">
        <p className="text-sm text-[var(--text-muted)]">Waiting for participants…</p>
      </div>
    );
  }

  const selfAsThumbnail = totalPeople > 4 && local;
  const tiles = selfAsThumbnail ? participants : [...(local ? [local] : []), ...participants];

  return (
    <div className="relative h-full">
      <div className={`grid h-full auto-rows-fr gap-3 ${colsFor(tiles.length)}`}>
        {tiles.map((p) => (
          <VideoTile key={p._id || p.id || p.socketId} participant={p} isLocal={p._isLocal} fill />
        ))}
      </div>
      {selfAsThumbnail && <SelfThumbnail participant={local} />}
    </div>
  );
}
