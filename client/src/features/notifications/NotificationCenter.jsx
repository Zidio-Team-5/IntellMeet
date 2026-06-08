import { Bell, Check, CheckCheck, Sparkles, Video, CheckSquare, Users } from "lucide-react";
import Card from "../../shared/ui/Card.jsx";
import Button from "../../shared/ui/Button.jsx";
import useNotifications from "../../shared/hooks/useNotifications.js";
import { formatRelativeTime } from "../../shared/utils/formatters.js";

const TYPE_ICON = { meeting: Video, task: CheckSquare, ai: Sparkles, team: Users, default: Bell };

function NotifItem({ notif, onRead }) {
  const Icon = TYPE_ICON[notif.type] || TYPE_ICON.default;
  return (
    <div
      className={`flex items-start gap-3 px-5 py-3.5 transition-colors hover:bg-[var(--bg-hover)] ${!notif.read ? "bg-[var(--muted)]/50" : ""}`}
    >
      <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-md border border-[var(--border)] bg-[var(--muted)]">
        <Icon size={14} className="text-[var(--text-secondary)]" />
      </div>
      <div className="min-w-0 flex-1">
        <p className={`text-sm ${notif.read ? "text-[var(--text-secondary)]" : "font-medium text-[var(--text)]"}`}>
          {notif.message || notif.text}
        </p>
        <p className="mt-0.5 text-xs text-[var(--text-muted)]">
          {formatRelativeTime(notif.createdAt || notif.time)}
        </p>
      </div>
      {!notif.read && (
        <button
          onClick={() => onRead(notif._id || notif.id)}
          aria-label="Mark as read"
          className="flex-shrink-0 rounded-md p-1.5 text-[var(--text-muted)] transition-colors hover:bg-[var(--muted)] hover:text-[var(--text)]"
        >
          <Check size={13} />
        </button>
      )}
    </div>
  );
}

export default function NotificationCenter() {
  const { data, markRead, markAllRead } = useNotifications();
  const notifications = data?.notifications ?? data ?? [];
  const unread = notifications.filter((n) => !n.read).length;

  return (
    <Card padding="">
      <div className="flex items-center justify-between border-b border-[var(--border)] px-5 py-3.5">
        <div className="flex items-center gap-2">
          <Bell size={14} className="text-[var(--text-secondary)]" />
          <h3 className="font-display text-sm font-semibold text-[var(--text)]">Notifications</h3>
          {unread > 0 && (
            <span className="rounded-full bg-[var(--brand)] px-2 py-0.5 text-[10px] font-bold tabular-nums text-white">
              {unread}
            </span>
          )}
        </div>
        {unread > 0 && (
          <Button variant="ghost" size="xs" icon={CheckCheck} onClick={() => markAllRead.mutate()}>
            Mark all read
          </Button>
        )}
      </div>

      <div className="divide-y divide-[var(--border-subtle)]">
        {notifications.length === 0 ? (
          <p className="py-12 text-center text-sm text-[var(--text-muted)]">
            You're all caught up!
          </p>
        ) : (
          notifications.map((n) => (
            <NotifItem key={n._id || n.id} notif={n} onRead={(id) => markRead.mutate(id)} />
          ))
        )}
      </div>
    </Card>
  );
}