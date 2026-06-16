import { useEffect } from "react";
import { useQueryClient } from "@tanstack/react-query";
import useAuthStore from "../store/authStore.js";
import { connectSocket, disconnectSocket } from "../../services/socketService.js";
import { toast } from "../store/toastStore.js";

/**
 * App-wide realtime connection. Establishes a single authenticated socket
 * after login and listens for server-pushed notifications, keeping the
 * notification list + unread badge live and surfacing a toast.
 * Mounting-only; renders nothing and changes no layout.
 */
export default function RealtimeProvider({ children }) {
  const { token } = useAuthStore();
  const queryClient = useQueryClient();

  useEffect(() => {
    if (!token) return;
    const socket = connectSocket(token);

    const onNotification = (notif) => {
      queryClient.invalidateQueries({ queryKey: ["notifications"] });
      toast({ type: notif?.type || "info", title: "New notification", message: notif?.message });
    };
    socket.on("notification:new", onNotification);

    return () => {
      socket.off("notification:new", onNotification);
      // Leave the singleton socket alone if a meeting view still needs it;
      // disconnect only when logging out (token cleared) — handled below.
    };
  }, [token, queryClient]);

  // Tear down the socket entirely when the user logs out.
  useEffect(() => {
    if (!token) disconnectSocket();
  }, [token]);

  return children;
}
