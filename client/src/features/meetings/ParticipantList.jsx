import { useState } from "react";
import {
  Mic, MicOff, Video, VideoOff, Hand, MoreVertical, Pin, Eye, EyeOff,
  UserX, MicOff as MicOffIcon, VideoOff as VideoOffIcon, Video as VideoIcon, Check, X,
  MessagesSquare, MonitorOff, MonitorUp,
} from "lucide-react";
import Card from "../../shared/ui/Card.jsx";
import { initials, avatarColor } from "../../shared/utils/formatters.js";
import useParticipantStore from "../../core/store/participantStore.js";
import useMeetingGateStore from "../../core/store/meetingGateStore.js";
import { getSocket } from "../../services/socketService.js";

const cmd = (type, target) => { const s = getSocket(); if (s) s.emit("meeting:host-command", { type, target }); };
const setMod = (patch) => { const s = getSocket(); if (s) s.emit("meeting:set-moderation", patch); };
const admit = (socketId) => { const s = getSocket(); if (s) s.emit("meeting:admit", { socketId }); };
const deny = (socketId) => { const s = getSocket(); if (s) s.emit("meeting:deny", { socketId }); };

function HostRowMenu({ participant }) {
  const [open, setOpen] = useState(false);
  const sid = participant.socketId;
  const item = "block w-full px-3 py-2 text-left text-xs text-[var(--text)] hover:bg-[var(--muted)]";
  return (
    <div className="relative">
      <button onClick={() => setOpen((v) => !v)} aria-label="Manage participant" className="rounded p-1 text-[var(--text-muted)] hover:bg-[var(--muted)] hover:text-[var(--text)]">
        <MoreVertical size={14} />
      </button>
      {open && (
        <div className="absolute right-0 top-full z-30 mt-1 w-44 overflow-hidden rounded-md border border-[var(--border)] bg-[var(--card)] shadow-[var(--shadow-xl)]" onMouseLeave={() => setOpen(false)}>
          <button className={item} onClick={() => { cmd("mute", sid); setOpen(false); }}><MicOffIcon size={12} className="mr-2 inline" />Mute</button>
          <button className={item} onClick={() => { cmd("video-off", sid); setOpen(false); }}><VideoOffIcon size={12} className="mr-2 inline" />Turn off video</button>
          <button className={item} onClick={() => { cmd("request-video", sid); setOpen(false); }}><VideoIcon size={12} className="mr-2 inline" />Ask to start video</button>
          <button className={`${item} border-t border-[var(--border)] text-[var(--error)]`} onClick={() => { cmd("remove", sid); setOpen(false); }}><UserX size={12} className="mr-2 inline" />Remove</button>
        </div>
      )}
    </div>
  );
}

export default function ParticipantList({ participants = [], localParticipant, isHost = false }) {
  const { pinnedId, hiddenVideoIds, togglePin, toggleHiddenVideo } = useParticipantStore();
  const { waitingList, moderation } = useMeetingGateStore();

  const all = [
    ...(localParticipant ? [{ ...localParticipant, _isLocal: true, isHost }] : []),
    ...participants,
  ];

  return (
    <Card padding="">
      <div className="flex items-center justify-between border-b border-[var(--border)] px-4 py-3">
        <h3 className="font-display text-sm font-semibold text-[var(--text)]">Participants ({all.length})</h3>
        {isHost && (
          <button onClick={() => cmd("mute", "all")} className="rounded-md border border-[var(--border)] px-2 py-1 text-[11px] font-medium text-[var(--text-secondary)] hover:text-[var(--text)]">
            Mute all
          </button>
        )}
      </div>

      {/* Host moderation toggles */}
      {isHost && (
        <div className="flex flex-wrap gap-2 border-b border-[var(--border)] px-4 py-2.5">
          <button onClick={() => setMod({ chatEnabled: !moderation.chatEnabled })}
            className={`flex items-center gap-1.5 rounded-md border px-2 py-1 text-[11px] font-medium ${moderation.chatEnabled ? "border-[var(--border)] text-[var(--text-secondary)]" : "border-[var(--error)] text-[var(--error)]"}`}>
            <MessagesSquare size={12} />{moderation.chatEnabled ? "Chat on" : "Chat off"}
          </button>
          <button onClick={() => setMod({ screenShareLocked: !moderation.screenShareLocked })}
            className={`flex items-center gap-1.5 rounded-md border px-2 py-1 text-[11px] font-medium ${moderation.screenShareLocked ? "border-[var(--error)] text-[var(--error)]" : "border-[var(--border)] text-[var(--text-secondary)]"}`}>
            {moderation.screenShareLocked ? <MonitorOff size={12} /> : <MonitorUp size={12} />}{moderation.screenShareLocked ? "Share locked" : "Share allowed"}
          </button>
        </div>
      )}

      {/* Waiting room (host only) */}
      {isHost && waitingList.length > 0 && (
        <div className="border-b border-[var(--border)] px-4 py-2.5">
          <p className="mb-2 text-[11px] font-semibold uppercase tracking-wide text-[var(--text-muted)]">Waiting room ({waitingList.length})</p>
          <div className="space-y-1.5">
            {waitingList.map((w) => (
              <div key={w.socketId} className="flex items-center justify-between">
                <span className="flex items-center gap-2 text-sm text-[var(--text)]">
                  <span className="flex h-6 w-6 items-center justify-center rounded-md text-[10px] font-bold text-white" style={{ background: avatarColor(w.name || "U") }}>{initials(w.name || "U")}</span>
                  {w.name}
                </span>
                <div className="flex items-center gap-1">
                  <button onClick={() => admit(w.socketId)} className="flex items-center gap-1 rounded-md bg-[var(--brand)] px-2 py-1 text-[11px] font-medium text-white hover:bg-[var(--brand-hover)]"><Check size={11} />Admit</button>
                  <button onClick={() => deny(w.socketId)} className="flex items-center gap-1 rounded-md border border-[var(--border)] px-2 py-1 text-[11px] font-medium text-[var(--text-secondary)] hover:text-[var(--text)]"><X size={11} />Deny</button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="max-h-64 overflow-y-auto divide-y divide-[var(--border)]">
        {all.map((p) => {
          const pid = p.socketId || p.id;
          const pinned = pinnedId === pid;
          const hidden = hiddenVideoIds.includes(pid);
          return (
            <div key={p._id || p.id || p.socketId} className="flex items-center justify-between px-4 py-2.5">
              <div className="flex min-w-0 items-center gap-2.5">
                <div className="flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-lg text-[11px] font-bold text-white" style={{ background: avatarColor(p.name || "U") }}>
                  {initials(p.name || "U")}
                </div>
                <span className="truncate text-sm font-medium text-[var(--text)]">
                  {p.name || "Participant"}{p._isLocal ? " (You)" : ""}{p.isHost ? " · Host" : ""}
                </span>
              </div>
              <div className="flex flex-shrink-0 items-center gap-1">
                {p.handRaised && <Hand size={13} className="text-[var(--brand)]" />}
                {p.audioMuted ? <MicOff size={13} className="text-red-400" /> : <Mic size={13} className="text-green-400" />}
                {p.videoMuted ? <VideoOff size={13} className="text-red-400" /> : <Video size={13} className="text-green-400" />}
                {!p._isLocal && (
                  <>
                    <button onClick={() => toggleHiddenVideo(pid)} title={hidden ? "Show video" : "Hide video"} className="rounded p-1 text-[var(--text-muted)] hover:text-[var(--text)]">
                      {hidden ? <EyeOff size={13} /> : <Eye size={13} />}
                    </button>
                    <button onClick={() => togglePin(pid)} title={pinned ? "Unpin" : "Pin"} className={`rounded p-1 hover:text-[var(--text)] ${pinned ? "text-[var(--brand)]" : "text-[var(--text-muted)]"}`}>
                      <Pin size={13} />
                    </button>
                    {isHost && <HostRowMenu participant={p} />}
                  </>
                )}
              </div>
            </div>
          );
        })}
        {all.length === 0 && <p className="px-4 py-4 text-center text-xs text-[var(--text-muted)]">No participants yet</p>}
      </div>
    </Card>
  );
}
