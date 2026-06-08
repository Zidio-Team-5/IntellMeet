import { useQuery } from "@tanstack/react-query";
import { BarChart3, Clock, Users, TrendingUp } from "lucide-react";
import StatsCard from "../dashboard/StatsCard.jsx";
import { getAnalyticsOverview } from "../../services/analyticsService.js";

export default function AnalyticsOverview() {
  const { data } = useQuery({
    queryKey: ["analytics-overview"],
    queryFn: getAnalyticsOverview,
  });

  const stats = data?.stats ?? data ?? {};

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
      <StatsCard title="Total Meetings"     value={stats.totalMeetings  ?? 142}      change="+12%" icon={BarChart3}  index={0} />
      <StatsCard title="Avg Duration"       value={stats.avgDuration    ?? "38 min"} change="-5%"  icon={Clock}      index={1} />
      <StatsCard title="Team Utilization"   value={stats.utilization    ?? "84%"}    change="+7%"  icon={Users}      index={2} />
      <StatsCard title="Productivity Index" value={stats.productivity   ?? "91"}     change="+14%" icon={TrendingUp} index={3} />
    </div>
  );
}