import { useQuery } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import { Clock } from "lucide-react";
import Card from "../../shared/ui/Card.jsx";
import { getUpcomingMeetings } from "../../services/dashboardService.js";
import { formatTime } from "../../shared/utils/formatters.js";

const FALLBACK = [
  { _id: "1", title: "Daily Standup",    scheduledAt: new Date(Date.now() + 3600000).toISOString(), duration: 15 },
  { _id: "2", title: "Sprint Review",    scheduledAt: new Date(Date.now() + 86400000).toISOString(), duration: 60 },
  { _id: "3", title: "Client Sync",      scheduledAt: new Date(Date.now() + 172800000).toISOString(), duration: 30 },
];

export default function UpcomingMeetings() {
  const { data } = useQuery({ queryKey: ["upcoming-meetings"], queryFn: getUpcomingMeetings });
  const meetings = (data?.meetings ?? data ?? FALLBACK).slice(0, 3);

  return (
    <Card padding="">
      <div className="border-b border-[var(--border)] px-5 py-3.5">
        <h3 className="font-display text-sm font-semibold text-[var(--text)]">Upcoming</h3>
      </div>
      <div className="divide-y divide-[var(--border-subtle)]">
        {meetings.map((m) => (
          <Link
            key={m._id || m.id}
            to={`/meeting/${m._id || m.id}`}
            className="flex items-center gap-3 px-4 py-3 transition-colors hover:bg-[var(--bg-hover)]"
          >
            <div className="flex h-9 w-9 flex-shrink-0 flex-col items-center justify-center rounded-md border border-[var(--border)] bg-[var(--muted)] text-center">
              <span className="text-[10px] font-medium text-[var(--text-muted)]">
                {new Date(m.scheduledAt || m.date).toLocaleDateString("en", { month: "short" })}
              </span>
              <span className="font-display text-sm font-semibold leading-none tabular-nums text-[var(--text)]">
                {new Date(m.scheduledAt || m.date).getDate()}
              </span>
            </div>
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-medium text-[var(--text)]">{m.title}</p>
              <div className="mt-0.5 flex items-center gap-1">
                <Clock size={10} className="text-[var(--text-muted)]" />
                <span className="text-xs text-[var(--text-muted)]">
                  {formatTime(m.scheduledAt || m.date)} · {m.duration}min
                </span>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </Card>
  );
}