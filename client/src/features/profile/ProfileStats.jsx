import { Video, CheckSquare, Sparkles, TrendingUp } from "lucide-react";
import StatsCard from "../dashboard/StatsCard.jsx";
import useAuthStore from "../../core/store/authStore.js";

export default function ProfileStats() {
  const { user } = useAuthStore();
  const s = user?.stats ?? {};
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
      <StatsCard title="Meetings Hosted" value={s.hostedMeetings ?? 23} icon={Video} index={0} />
      <StatsCard title="Tasks Completed" value={s.completedTasks ?? 98} icon={CheckSquare} index={1} />
      <StatsCard title="AI Summaries"    value={s.summaries ?? 31}      icon={Sparkles} index={2} />
      <StatsCard title="Productivity"    value={`${s.score ?? 91}%`}    icon={TrendingUp} index={3} />
    </div>
  );
}