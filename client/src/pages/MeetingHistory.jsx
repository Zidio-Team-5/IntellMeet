import { useQuery } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import { Video, Clock, Sparkles, ArrowRight, FileText } from "lucide-react";
import DashboardLayout from "../shared/layouts/DashboardLayout.jsx";
import PageHeader from "../shared/ui/PageHeader.jsx";
import Table from "../shared/ui/Table.jsx";
import Button from "../shared/ui/Button.jsx";
import Badge from "../shared/ui/Badge.jsx";
import { TableSkeleton } from "../shared/ui/Skeleton.jsx";
import EmptyState from "../shared/ui/EmptyState.jsx";
import { getMeetingHistory } from "../services/meetingService.js";
import { formatDate, formatDuration } from "../shared/utils/formatters.js";

export default function MeetingHistory() {
  const { data, isLoading } = useQuery({
    queryKey: ["meeting-history"],
    queryFn: getMeetingHistory,
  });

  const meetings = data?.meetings ?? data ?? [];

  return (
    <DashboardLayout>
      <PageHeader
        title="Meeting history"
        subtitle="Browse past meetings, transcripts, and AI summaries."
      />

      {isLoading ? (
        <TableSkeleton rows={8} cols={4} />
      ) : meetings.length === 0 ? (
        <div className="rounded-[10px] border border-[var(--border)]">
          <EmptyState
            icon={Video}
            title="No past meetings"
            description="Your completed meetings will appear here."
          />
        </div>
      ) : (
        <>
          {/* Desktop: dense table */}
          <div className="hidden md:block">
            <Table>
              <Table.Head>
                <Table.Row>
                  <Table.HeadCell>Title</Table.HeadCell>
                  <Table.HeadCell>Date</Table.HeadCell>
                  <Table.HeadCell align="right">Duration</Table.HeadCell>
                  <Table.HeadCell>Summary</Table.HeadCell>
                  <Table.HeadCell align="right" className="w-px">Action</Table.HeadCell>
                </Table.Row>
              </Table.Head>
              <Table.Body>
                {meetings.map((m) => {
                  const id = m._id || m.id;
                  return (
                    <Table.Row key={id}>
                      <Table.Cell>
                        <div className="flex items-center gap-2.5">
                          <span className="flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-md border border-[var(--border)] bg-[var(--muted)]">
                            <Video size={13} className="text-[var(--text-secondary)]" />
                          </span>
                          <span className="font-medium text-[var(--text)]">{m.title}</span>
                        </div>
                      </Table.Cell>
                      <Table.Cell className="whitespace-nowrap text-[var(--text-secondary)]">
                        {formatDate(m.createdAt || m.date)}
                      </Table.Cell>
                      <Table.Cell align="right" numeric className="text-[var(--text-secondary)]">
                        {m.duration ? formatDuration(m.duration) : "—"}
                      </Table.Cell>
                      <Table.Cell>
                        {m.hasSummary ? (
                          <Badge variant="success" dot>Ready</Badge>
                        ) : (
                          <span className="text-[var(--text-muted)]">—</span>
                        )}
                        {m.recordingUrl && (
                          <span className="ml-1.5 inline-flex items-center gap-1 text-xs text-[var(--text-muted)]">
                            <Video size={10} /> Recorded
                          </span>
                        )}
                      </Table.Cell>
                      <Table.Cell align="right">
                        <div className="flex items-center justify-end gap-2">
                          <Link to={`/meeting/${id}/transcript`}>
                            <Button size="xs" variant="ghost" icon={FileText}>Transcript</Button>
                          </Link>
                          <Link to={`/meeting/${id}`}>
                            <Button size="xs" variant="outline" icon={ArrowRight}>View</Button>
                          </Link>
                        </div>
                      </Table.Cell>
                    </Table.Row>
                  );
                })}
              </Table.Body>
            </Table>
          </div>

          {/* Mobile: stacked rows */}
          <div className="space-y-2 md:hidden">
            {meetings.map((m) => {
              const id = m._id || m.id;
              return (
                <Link
                  key={id}
                  to={`/meeting/${id}`}
                  className="flex items-center justify-between gap-3 rounded-[10px] border border-[var(--border)] bg-[var(--card)] p-3.5 transition-colors hover:border-[var(--border-hover)] hover:bg-[var(--bg-hover)]"
                >
                  <div className="flex min-w-0 items-center gap-3">
                    <span className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-md border border-[var(--border)] bg-[var(--muted)]">
                      <Video size={14} className="text-[var(--text-secondary)]" />
                    </span>
                    <div className="min-w-0">
                      <p className="truncate text-sm font-medium text-[var(--text)]">{m.title}</p>
                      <div className="mt-1 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-[var(--text-muted)]">
                        <span>{formatDate(m.createdAt || m.date)}</span>
                        {m.duration && (
                          <span className="flex items-center gap-1 tabular-nums">
                            <Clock size={10} />
                            {formatDuration(m.duration)}
                          </span>
                        )}
                        {m.hasSummary && (
                          <span className="flex items-center gap-1 text-[var(--text-secondary)]">
                            <Sparkles size={10} /> Summary
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                  <ArrowRight size={15} className="flex-shrink-0 text-[var(--text-muted)]" />
                </Link>
              );
            })}
          </div>
        </>
      )}
    </DashboardLayout>
  );
}