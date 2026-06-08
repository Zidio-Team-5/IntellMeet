import { useQuery } from "@tanstack/react-query";
import { Sparkles, CheckSquare, Video, Users } from "lucide-react";
import Card from "../../shared/ui/Card.jsx";
import { SkeletonText } from "../../shared/ui/Skeleton.jsx";
import { getDashboardActivity } from "../../services/dashboardService.js";
import { formatRelativeTime } from "../../shared/utils/formatters.js";

const TYPE_ICONS = {
  meeting: Video,
  task: CheckSquare,
  ai: Sparkles,
  team: Users,
};

const FALLBACK = [
  { id: 1, type: "ai",      text: "AI summary generated for Sprint Planning",   time: "2m ago" },
  { id: 2, type: "task",    text: "3 action items extracted and created",        time: "15m ago" },
  { id: 3, type: "meeting", text: "Client Demo completed — transcript saved",    time: "1h ago" },
  { id: 4, type: "team",    text: "Alex joined the Engineering team",            time: "3h ago" },
];

export default function ActivityFeed() {
  const { data, isLoading } = useQuery({
    queryKey: ["dashboard-activity"],
    queryFn: getDashboardActivity,
  });

  const items = data?.activities ?? data ?? FALLBACK;

  return (
    <Card padding="">
      <div className="flex items-center justify-between border-b border-[var(--border)] px-5 py-3.5">
        <h3 className="font-display text-sm font-semibold text-[var(--text)]">Activity feed</h3>
        <span className="flex items-center gap-1.5">
          <span className="h-1.5 w-1.5 rounded-full bg-[var(--success)] live-badge" />
          <span className="text-xs text-[var(--text-muted)]">Live</span>
        </span>
      </div>
      <div className="p-5">
        {isLoading ? (
          <SkeletonText lines={4} />
        ) : (
          <div className="space-y-3.5">
            {items.map((item, idx) => {
              const Icon = TYPE_ICONS[item.type] || Sparkles;
              return (
                <div
                  key={item.id || idx}
                  className="flex items-start gap-3 animate-fade-in"
                  style={{ animationDelay: `${idx * 0.05}s` }}
                >
                  <div className="mt-0.5 flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-md border border-[var(--border)] bg-[var(--muted)]">
                    <Icon size={13} className="text-[var(--text-secondary)]" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-sm leading-snug text-[var(--text)]">{item.text}</p>
                    <p className="mt-0.5 text-xs text-[var(--text-muted)]">
                      {item.time || formatRelativeTime(item.createdAt)}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </Card>
  );
}