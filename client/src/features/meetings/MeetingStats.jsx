import { useQuery } from "@tanstack/react-query";
import { Video, Clock, CheckSquare, Sparkles } from "lucide-react";
import StatsCard from "../dashboard/StatsCard.jsx";
import { getMeetings } from "../../services/meetingService.js";

export default function MeetingStats() {
  const { data } = useQuery({ queryKey: ["meetings"], queryFn: getMeetings });
  const meetings = data?.meetings ?? data ?? [];
  const live = meetings.filter((m) => m.status === "live").length;
  const upcoming = meetings.filter((m) => m.status === "upcoming").length;
  const completed = meetings.filter((m) => m.status === "completed").length;
  const withSummary = meetings.filter((m) => m.hasSummary).length;

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
      <StatsCard title="Live Now" value={live} icon={Video} index={0} />
      <StatsCard title="Upcoming" value={upcoming} icon={Clock} index={1} />
      <StatsCard title="Completed" value={completed} icon={CheckSquare} index={2} />
      <StatsCard title="AI Summaries" value={withSummary} icon={Sparkles} index={3} />
    </div>
  );
}