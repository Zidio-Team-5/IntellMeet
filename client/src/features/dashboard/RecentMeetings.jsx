import { useQuery } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import { Video, ExternalLink, Clock } from "lucide-react";
import Card from "../../shared/ui/Card.jsx";
import { ListSkeleton } from "../../shared/ui/Skeleton.jsx";
import EmptyState from "../../shared/ui/EmptyState.jsx";
import Button from "../../shared/ui/Button.jsx";
import { getMeetings } from "../../services/meetingService.js";
import { formatRelativeTime } from "../../shared/utils/formatters.js";

export default function RecentMeetings() {
  const { data, isLoading } = useQuery({
    queryKey: ["meetings"],
    queryFn: getMeetings,
  });

  const meetings = (data?.meetings ?? data ?? []).slice(0, 4);

  return (
    <Card padding="">
      <div className="flex items-center justify-between border-b border-[var(--border)] px-5 py-3.5">
        <h3 className="font-display text-sm font-semibold text-[var(--text)]">Recent meetings</h3>
        <Link to="/meetings">
          <Button variant="ghost" size="sm">View all</Button>
        </Link>
      </div>
      <div className="p-4">
        {isLoading ? (
          <ListSkeleton rows={4} />
        ) : meetings.length === 0 ? (
          <EmptyState icon={Video} title="No meetings yet" description="Create your first meeting to get started." />
        ) : (
          <div className="space-y-2">
            {meetings.map((m) => (
              <div
                key={m._id || m.id}
                className="flex items-center justify-between rounded-md border border-[var(--border)] px-3 py-2.5 transition-colors hover:border-[var(--border-hover)] hover:bg-[var(--bg-hover)]"
              >
                <div className="flex min-w-0 items-center gap-3">
                  <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-md border border-[var(--border)] bg-[var(--muted)]">
                    <Video size={14} className="text-[var(--text-secondary)]" />
                  </div>
                  <div className="min-w-0">
                    <p className="truncate text-sm font-medium text-[var(--text)]">{m.title}</p>
                    <div className="mt-0.5 flex items-center gap-1">
                      <Clock size={11} className="text-[var(--text-muted)]" />
                      <span className="text-xs text-[var(--text-muted)]">{formatRelativeTime(m.createdAt || m.date)}</span>
                    </div>
                  </div>
                </div>
                <Link to={`/meeting/${m._id || m.id}`} className="flex-shrink-0">
                  <Button variant="outline" size="xs" icon={ExternalLink}>Join</Button>
                </Link>
              </div>
            ))}
          </div>
        )}
      </div>
    </Card>
  );
}