import { useEffect } from "react";
import { connectSocket, getSocket } from "../../services/socketService.js";
import useAuthStore from "../../core/store/authStore.js";

export default function useSocket() {
  const { token } = useAuthStore();

  useEffect(() => {
    // Reuse the app-wide singleton socket. Do NOT disconnect on unmount — the
    // socket's lifecycle is owned by RealtimeProvider and torn down on logout.
    if (token) connectSocket(token);
  }, [token]);

  return getSocket();
}
