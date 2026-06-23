import { useState, useEffect, useCallback } from "react";
import { connectSocket, getSocket } from "../../services/socketService.js";
import useAuthStore from "../../core/store/authStore.js";

/**
 * In-room chat over the shared socket. Messages are rendered from the server
 * echo (the backend broadcasts meeting:transcript to EVERYONE in the room,
 * including the sender), so every participant sees the same messages in the
 * same order. We do not optimistically append — that would double the sender's
 * own messages once the echo arrives.
 */
export default function useMeetingChat(meetingId) {
  const { token } = useAuthStore();
  const [messages, setMessages] = useState([]);

  useEffect(() => {
    if (!meetingId || !token) return;
    const socket = connectSocket(token);

    const onTranscript = (entry) => {
      // The transcript channel carries BOTH chat and captions; the chat panel
      // should only show actual chat messages.
      if (entry?.kind && entry.kind !== "chat") return;
      setMessages((prev) => {
        if (entry?.id && prev.some((m) => m.id === entry.id)) return prev;
        return [...prev, {
          id: entry.id || `${entry.timestamp || Date.now()}-${prev.length}`,
          sender: entry.sender || entry.senderName || "Unknown",
          content: entry.content ?? entry.text ?? entry.message ?? "",
          timestamp: entry.timestamp || new Date().toISOString(),
        }];
      });
    };

    socket.on("meeting:transcript", onTranscript);
    return () => socket.off("meeting:transcript", onTranscript);
  }, [meetingId, token]);

  const sendMessage = useCallback(
    (content) => {
      const socket = getSocket();
      if (!socket || !content.trim()) return;
      socket.emit("meeting:chat", { meetingId, content });
    },
    [meetingId]
  );

  return { messages, sendMessage };
}
