import { Bell } from "lucide-react";
import { formatRelativeTime } from "../../shared/utils/formatters.js";

export default function NotificationItem({ notification, onRead }) {
  return (
    <div
      className={`flex items-start gap-3 p-3 rounded-xl cursor-pointer transition-colors hover:bg-[var(--muted)] ${!notification.read ? "bg-[var(--muted)]/40" : ""}`}
      onClick={() => !notification.read && onRead?.(notification._id || notification.id)}
    >
      <Bell size={14} className="mt-0.5 flex-shrink-0 text-[var(--text-muted)]" />
      <div className="flex-1 min-w-0">
        <p className="text-sm text-[var(--text)]">{notification.message || notification.text}</p>
        <p className="text-xs text-[var(--text-muted)] mt-0.5">
          {formatRelativeTime(notification.createdAt)}
        </p>
      </div>
      {!notification.read && (
        <span className="h-2 w-2 flex-shrink-0 rounded-full bg-[var(--accent)] mt-1" />
      )}
    </div>
  );
}
