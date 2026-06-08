import { Video, CheckSquare, Users, Sparkles } from "lucide-react";
import StatsCard from "./StatsCard.jsx";

export default function ExecutiveOverview({ stats }) {
  const cards = [
    { title: "Total Meetings", value: stats?.meetings ?? "—", change: "+12%", icon: Video },
    { title: "Open Tasks", value: stats?.tasks ?? "—", change: "+8%", icon: CheckSquare },
    { title: "Team Members", value: stats?.members ?? "—", change: "+4%", icon: Users },
    { title: "AI Summaries", value: stats?.summaries ?? "—", change: "+18%", icon: Sparkles },
  ];

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
      {cards.map((card, i) => (
        <StatsCard key={card.title} {...card} index={i} />
      ))}
    </div>
  );
}