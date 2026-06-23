import { useEffect } from "react";
import { useQueryClient } from "@tanstack/react-query";
import useAuthStore from "../store/authStore.js";
import { connectSocket, disconnectSocket } from "../../services/socketService.js";
import { toast } from "../store/toastStore.js";

/**
 * App-wide realtime connection. Establishes a single authenticated socket
 * after login and listens for server-pushed events:
 *   - notification:new      -> refresh notifications + toast
 *   - meeting:created        -> a meeting you can see was created/you were invited
 *   - meeting:updated        -> a meeting you can see changed (joins, edits, end)
 *   - meeting:deleted        -> a meeting you could see was removed
 * Each meeting event invalidates the meeting-related queries so every dashboard
 * stays in sync across devices and users WITHOUT a manual refresh.
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

    // Any meeting change → refresh the lists/widgets that read from the backend.
    const refreshMeetings = (meeting) => {
      queryClient.invalidateQueries({ queryKey: ["meetings"] });
      queryClient.invalidateQueries({ queryKey: ["meeting-history"] });
      queryClient.invalidateQueries({ queryKey: ["upcoming-meetings"] });
      queryClient.invalidateQueries({ queryKey: ["dashboard-stats"] });
      queryClient.invalidateQueries({ queryKey: ["dashboard-activity"] });
      queryClient.invalidateQueries({ queryKey: ["dashboard-insights"] });
      const id = meeting?._id || meeting?.id || meeting?.meetingId || meeting?.roomId;
      if (id) {
        queryClient.invalidateQueries({ queryKey: ["meeting", id] });
        if (meeting?.roomId) queryClient.invalidateQueries({ queryKey: ["meeting", meeting.roomId] });
      }
    };

    const onMeetingCreated = (meeting) => {
      refreshMeetings(meeting);
    };

    socket.on("notification:new", onNotification);
    socket.on("meeting:created", onMeetingCreated);
    socket.on("meeting:updated", refreshMeetings);
    socket.on("meeting:deleted", refreshMeetings);

    return () => {
      socket.off("notification:new", onNotification);
      socket.off("meeting:created", onMeetingCreated);
      socket.off("meeting:updated", refreshMeetings);
      socket.off("meeting:deleted", refreshMeetings);
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
