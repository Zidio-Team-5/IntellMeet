import { Users, UserCheck, TrendingUp, Award } from "lucide-react";
import StatsCard from "../dashboard/StatsCard.jsx";

export default function TeamStats({ stats }) {
  return (
    <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
      <StatsCard title="Total Members"  value={stats?.total   ?? 24} icon={Users}     index={0} />
      <StatsCard title="Online Now"     value={stats?.online  ?? 8}  icon={UserCheck} index={1} />
      <StatsCard title="Avg Score"      value={stats?.avgScore ?? "87"} icon={TrendingUp} index={2} />
      <StatsCard title="Top Performer"  value={stats?.topPerformer ?? "Engineering"} icon={Award} index={3} />
    </div>
  );
}