import { useEffect } from "react";
import { getSocket } from "../../../services/socketService.js";

export default function useMeetingSocket(meetingId, handlers = {}) {
  useEffect(() => {
    const socket = getSocket();
    if (!socket || !meetingId) return;

    Object.entries(handlers).forEach(([event, handler]) => {
      socket.on(event, handler);
    });

    return () => {
      Object.keys(handlers).forEach((event) => socket.off(event));
    };
  }, [meetingId]);
}
