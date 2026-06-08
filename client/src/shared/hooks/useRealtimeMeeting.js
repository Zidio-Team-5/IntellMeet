import { useEffect } from "react";
import { connectSocket, disconnectSocket } from "../../services/socketService.js";
import useAuthStore from "../../core/store/authStore.js";
import useParticipantStore from "../../core/store/participantStore.js";
import useRealtimeStore from "../../core/store/realtimeStore.js";

export default function useRealtimeMeeting(meetingId) {
  const { token } = useAuthStore();
  const { addParticipant, removeParticipant } = useParticipantStore();
  const { addTranscriptEntry } = useRealtimeStore();

  useEffect(() => {
    if (!meetingId || !token) return;

    const socket = connectSocket(token);

    socket.emit("meeting:join", { meetingId });

    socket.on("meeting:participant-joined", (participant) => {
      addParticipant(participant);
    });

    socket.on("meeting:participant-left", ({ id }) => {
      removeParticipant(id);
    });

    socket.on("meeting:transcript", (entry) => {
      addTranscriptEntry(entry);
    });

    return () => {
      socket.emit("meeting:leave", { meetingId });
      socket.off("meeting:participant-joined");
      socket.off("meeting:participant-left");
      socket.off("meeting:transcript");
      disconnectSocket();
    };
  }, [meetingId, token, addParticipant, removeParticipant, addTranscriptEntry]);
}
