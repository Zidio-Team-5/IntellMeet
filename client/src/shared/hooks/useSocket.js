import { useEffect, useRef } from "react";
import { connectSocket, disconnectSocket } from "../../services/socketService.js";
import useAuthStore from "../../core/store/authStore.js";

export default function useSocket() {
  const { token } = useAuthStore();
  const socketRef = useRef(null);

  useEffect(() => {
    if (!token) return;

    socketRef.current = connectSocket(token);

    return () => {
      disconnectSocket();
    };
  }, [token]);

  return socketRef.current;
}
