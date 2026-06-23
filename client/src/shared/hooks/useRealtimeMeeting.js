import { useEffect } from "react";
import { connectSocket } from "../../services/socketService.js";
import useAuthStore from "../../core/store/authStore.js";
import useParticipantStore from "../../core/store/participantStore.js";
import useRealtimeStore from "../../core/store/realtimeStore.js";
import useMeetingGateStore from "../../core/store/meetingGateStore.js";
import useMediaStore from "../../core/store/mediaStore.js";
import { toast } from "../../core/store/toastStore.js";
import { playDing, playKnock } from "../../shared/utils/sound.js";

/**
 * Single socket lifecycle for a meeting room: join + admission gating (waiting
 * room), presence, transcript, moderation state, host commands, and the
 * join/knock sounds + toasts. Uses the app-wide singleton socket (never
 * disconnects it).
 */
export default function useRealtimeMeeting(meetingId) {
  const { token } = useAuthStore();
  const {
    setParticipants, addParticipant, removeParticipant, updateParticipant, clearParticipants,
  } = useParticipantStore();
  const { addTranscriptEntry, clearTranscript } = useRealtimeStore();
  const { setGate, setWaitingList, setModeration, reset: resetGate } = useMeetingGateStore();

  useEffect(() => {
    if (!meetingId || !token) return;
    const socket = connectSocket(token);
    setGate("joining");
    socket.emit("meeting:join", { meetingId });

    // --- admission gating ---
    const onRoster = (list) => { setParticipants(list || []); setGate("admitted"); };
    const onWaitingRoom = () => setGate("waiting");
    const onAdmitted = () => setGate("admitted");
    const onDenied = () => setGate("denied");
    const onJoinError = ({ reason }) => setGate("blocked", reason || "unavailable");
    const onRemoved = () => { setGate("removed"); toast({ type: "warning", title: "Removed", message: "You were removed from the meeting." }); };
    const onEnded = () => { setGate("ended"); toast({ type: "info", title: "Meeting ended", message: "The host ended the meeting." }); };

    // --- host: waiting room ---
    const onWaiting = (list) => setWaitingList(list || []);
    const onKnock = (p) => { playKnock(); toast({ type: "info", title: "Waiting to join", message: `${p?.name || "Someone"} is in the waiting room.` }); };

    // --- presence ---
    const onJoined = (p) => { addParticipant(p); playDing(); toast({ type: "info", title: "Joined", message: `${p?.name || "Someone"} joined the meeting.` }); };
    const onLeft = ({ socketId, id }) => removeParticipant(socketId || id);
    const onUpdated = (p) => updateParticipant(p.socketId || p.id, p);
    const onTranscript = (entry) =>
      addTranscriptEntry({
        ...entry,
        speaker: entry.speaker || entry.sender || entry.senderName || "Speaker",
        text: entry.text ?? entry.content ?? entry.message ?? "",
      });

    // --- moderation + host commands ---
    const onModeration = (mod) => setModeration(mod);
    const onNotice = (n) => toast({ type: n?.type || "info", title: "Meeting update", message: n?.message || "" });
    const onCommand = ({ type, by }) => {
      const media = useMediaStore.getState();
      if (type === "mute") { media.setAudioEnabled(false); toast({ type: "warning", title: "Muted", message: `${by || "Host"} muted you.` }); }
      else if (type === "video-off") { media.setVideoEnabled(false); toast({ type: "warning", title: "Video off", message: `${by || "Host"} turned off your video.` }); }
      else if (type === "request-video") { toast({ type: "info", title: "Turn on video", message: `${by || "Host"} asks you to turn on your video.` }); }
    };

    socket.on("meeting:participants", onRoster);
    socket.on("meeting:waiting-room", onWaitingRoom);
    socket.on("meeting:admitted", onAdmitted);
    socket.on("meeting:denied", onDenied);
    socket.on("meeting:join-error", onJoinError);
    socket.on("meeting:removed", onRemoved);
    socket.on("meeting:ended", onEnded);
    socket.on("meeting:waiting", onWaiting);
    socket.on("meeting:knock", onKnock);
    socket.on("meeting:participant-joined", onJoined);
    socket.on("meeting:participant-left", onLeft);
    socket.on("meeting:participant-updated", onUpdated);
    socket.on("meeting:transcript", onTranscript);
    socket.on("meeting:moderation", onModeration);
    socket.on("meeting:notice", onNotice);
    socket.on("meeting:command", onCommand);

    return () => {
      socket.emit("meeting:leave", { meetingId });
      socket.off("meeting:participants", onRoster);
      socket.off("meeting:waiting-room", onWaitingRoom);
      socket.off("meeting:admitted", onAdmitted);
      socket.off("meeting:denied", onDenied);
      socket.off("meeting:join-error", onJoinError);
      socket.off("meeting:removed", onRemoved);
      socket.off("meeting:ended", onEnded);
      socket.off("meeting:waiting", onWaiting);
      socket.off("meeting:knock", onKnock);
      socket.off("meeting:participant-joined", onJoined);
      socket.off("meeting:participant-left", onLeft);
      socket.off("meeting:participant-updated", onUpdated);
      socket.off("meeting:transcript", onTranscript);
      socket.off("meeting:moderation", onModeration);
      socket.off("meeting:notice", onNotice);
      socket.off("meeting:command", onCommand);
      clearParticipants();
      clearTranscript();
      resetGate();
    };
  }, [meetingId, token, setParticipants, addParticipant, removeParticipant, updateParticipant, clearParticipants, addTranscriptEntry, clearTranscript, setGate, setWaitingList, setModeration, resetGate]);
}
