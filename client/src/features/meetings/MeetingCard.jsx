import { Link } from "react-router-dom";
import { Video, Users, Clock, Sparkles, ArrowRight } from "lucide-react";
import Card from "../../shared/ui/Card.jsx";
import Button from "../../shared/ui/Button.jsx";
import Badge from "../../shared/ui/Badge.jsx";
import { formatDate, formatTime, formatDuration } from "../../shared/utils/formatters.js";
import { MEETING_STATUS, STATUS_COLORS } from "../../shared/utils/constants.js";

export default function MeetingCard({ meeting }) {
  const id = meeting._id || meeting.id;
  const status = meeting.status || MEETING_STATUS.UPCOMING;
  const statusStyle = STATUS_COLORS[status] || STATUS_COLORS.upcoming;
  const isLive = status === "live";
  const people = meeting.participants?.length ?? meeting.participantCount;

  return (
    <Card padding="p-3.5" className="transition-colors hover:border-[var(--border-hover)]">
      <div className="flex items-start justify-between gap-3">
        <div className="flex min-w-0 flex-1 items-start gap-3">
          <div
            className={`flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-md border ${
              isLive
                ? "border-[var(--live)]/30 bg-[var(--live-subtle)]"
                : "border-[var(--border)] bg-[var(--muted)]"
            }`}
          >
            <Video size={15} className={isLive ? "text-[var(--live)]" : "text-[var(--text-secondary)]"} />
          </div>
          <div className="min-w-0 flex-1">
            <div className="flex flex-wrap items-center gap-2">
              <h3 className="truncate text-sm font-medium text-[var(--text)]">{meeting.title}</h3>
              <Badge className={statusStyle}>
                {isLive && <span className="h-1.5 w-1.5 rounded-full bg-current live-badge" />}
                {status}
              </Badge>
            </div>
            <div className="mt-1.5 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-[var(--text-muted)]">
              <span className="flex items-center gap-1">
                <Clock size={11} />
                {formatDate(meeting.scheduledAt || meeting.date)} · {formatTime(meeting.scheduledAt || meeting.date)}
              </span>
              {meeting.duration && (
                <span className="flex items-center gap-1 tabular-nums">
                  <Clock size={11} />
                  {formatDuration(meeting.duration)}
                </span>
              )}
              {people > 0 && (
                <span className="flex items-center gap-1 tabular-nums">
                  <Users size={11} />
                  {people}
                </span>
              )}
              {meeting.hasSummary && (
                <span className="flex items-center gap-1 text-[var(--text-secondary)]">
                  <Sparkles size={11} />
                  Summary
                </span>
              )}
            </div>
          </div>
        </div>
        <Link to={`/meeting/${id}`} className="flex-shrink-0">
          <Button size="sm" variant={isLive ? "primary" : "outline"} icon={ArrowRight}>
            {isLive ? "Join" : "Open"}
          </Button>
        </Link>
      </div>
    </Card>
  );
}