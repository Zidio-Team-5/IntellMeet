import { useQuery } from "@tanstack/react-query";
import { getMeetingDetails } from "../../services/meetingService.js";

export default function useMeetingSession(meetingId) {
  return useQuery({
    queryKey: ["meeting", meetingId],
    queryFn: () => getMeetingDetails(meetingId),
    enabled: !!meetingId,
  });
}
