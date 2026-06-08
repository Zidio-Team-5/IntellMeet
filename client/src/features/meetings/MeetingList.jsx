import { Link } from "react-router-dom";
import { Video, Sparkles, ArrowRight } from "lucide-react";
import Table from "../../shared/ui/Table.jsx";
import Badge from "../../shared/ui/Badge.jsx";
import Button from "../../shared/ui/Button.jsx";
import MeetingCard from "./MeetingCard.jsx";
import MeetingEmptyState from "./MeetingEmptyState.jsx";
import { formatDate, formatTime, formatDuration } from "../../shared/utils/formatters.js";
import { MEETING_STATUS, STATUS_COLORS } from "../../shared/utils/constants.js";

export default function MeetingList({ meetings = [], filter = "all" }) {
  const filtered = meetings.filter((m) => {
    if (filter === "all") return true;
    if (filter === "live") return m.status === "live";
    if (filter === "upcoming") return m.status === "upcoming";
    if (filter === "completed") return m.status === "completed";
    return true;
  });

  if (!filtered.length) return <MeetingEmptyState />;

  return (
    <div>
      {/* Desktop: dense table */}
      <div className="hidden md:block">
        <Table>
          <Table.Head>
            <Table.Row>
              <Table.HeadCell>Title</Table.HeadCell>
              <Table.HeadCell>Status</Table.HeadCell>
              <Table.HeadCell>When</Table.HeadCell>
              <Table.HeadCell align="right">Duration</Table.HeadCell>
              <Table.HeadCell align="right">People</Table.HeadCell>
              <Table.HeadCell align="right" className="w-px">Action</Table.HeadCell>
            </Table.Row>
          </Table.Head>
          <Table.Body>
            {filtered.map((m) => {
              const id = m._id || m.id;
              const status = m.status || MEETING_STATUS.UPCOMING;
              const statusStyle = STATUS_COLORS[status] || STATUS_COLORS.upcoming;
              const isLive = status === "live";
              const people = m.participants?.length ?? m.participantCount ?? 0;
              return (
                <Table.Row key={id}>
                  <Table.Cell>
                    <div className="flex items-center gap-2.5">
                      <span
                        className={`flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-md border ${
                          isLive ? "border-[var(--live)]/30 bg-[var(--live-subtle)]" : "border-[var(--border)] bg-[var(--muted)]"
                        }`}
                      >
                        <Video size={13} className={isLive ? "text-[var(--live)]" : "text-[var(--text-secondary)]"} />
                      </span>
                      <span className="flex items-center gap-2 font-medium text-[var(--text)]">
                        {m.title}
                        {m.hasSummary && <Sparkles size={12} className="text-[var(--text-muted)]" />}
                      </span>
                    </div>
                  </Table.Cell>
                  <Table.Cell>
                    <Badge className={statusStyle}>
                      {isLive && <span className="h-1.5 w-1.5 rounded-full bg-current live-badge" />}
                      {status}
                    </Badge>
                  </Table.Cell>
                  <Table.Cell className="whitespace-nowrap text-[var(--text-secondary)]">
                    {formatDate(m.scheduledAt || m.date)} · {formatTime(m.scheduledAt || m.date)}
                  </Table.Cell>
                  <Table.Cell align="right" numeric className="text-[var(--text-secondary)]">
                    {m.duration ? formatDuration(m.duration) : "—"}
                  </Table.Cell>
                  <Table.Cell align="right" numeric className="text-[var(--text-secondary)]">
                    {people || "—"}
                  </Table.Cell>
                  <Table.Cell align="right">
                    <Link to={`/meeting/${id}`}>
                      <Button size="xs" variant={isLive ? "primary" : "outline"} icon={ArrowRight}>
                        {isLive ? "Join" : "Open"}
                      </Button>
                    </Link>
                  </Table.Cell>
                </Table.Row>
              );
            })}
          </Table.Body>
        </Table>
      </div>

      {/* Mobile: stacked cards */}
      <div className="space-y-2 md:hidden">
        {filtered.map((m) => (
          <MeetingCard key={m._id || m.id} meeting={m} />
        ))}
      </div>
    </div>
  );
}