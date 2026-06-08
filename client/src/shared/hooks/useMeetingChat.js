import { useState, useCallback } from "react";
import { getSocket } from "../../services/socketService.js";

export default function useMeetingChat(meetingId) {
  const [messages, setMessages] = useState([]);

  const sendMessage = useCallback(
    (content) => {
      const socket = getSocket();
      if (!socket || !content.trim()) return;

      const msg = {
        id: Date.now(),
        content,
        sender: "You",
        timestamp: new Date().toISOString(),
      };

      setMessages((prev) => [...prev, msg]);
      socket.emit("meeting:chat", { meetingId, content });
    },
    [meetingId]
  );

  return { messages, sendMessage };
}
