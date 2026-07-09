import { User, Clock } from "lucide-react";
import Badge from "../../shared/ui/Badge.jsx";
import { PRIORITY_COLORS } from "../../shared/utils/constants.js";
import { formatRelativeTime } from "../../shared/utils/formatters.js";

export default function TaskCard({ task, onMove }) {
  const priorityClass = PRIORITY_COLORS[task.priority] || PRIORITY_COLORS.medium;

  return (
    <div className="group rounded-md border border-[var(--border)] bg-[var(--card)] p-3 transition-colors hover:border-[var(--border-hover)]">
      <div className="mb-2 flex items-start justify-between gap-2">
        <p className="flex-1 text-sm font-medium leading-snug text-[var(--text)]">
          {task.title}
        </p>
        {task.priority && <Badge className={priorityClass}>{task.priority}</Badge>}
      </div>

      {task.description && (
        <p className="mb-3 line-clamp-2 text-xs text-[var(--text-muted)]">{task.description}</p>
      )}

      <div className="mt-2 flex items-center justify-between gap-2">
        <div className="flex min-w-0 items-center gap-3">
          {(task.assignees?.length ? task.assignees : task.assignee ? [task.assignee] : []).length > 0 && (
            <span className="flex min-w-0 items-center gap-1 truncate text-xs text-[var(--text-muted)]">
              <User size={11} />
              {(task.assignees?.length ? task.assignees : [task.assignee]).slice(0, 2).join(", ")}
              {(task.assignees?.length || 0) > 2 && ` +${task.assignees.length - 2}`}
            </span>
          )}
          {task.dueDate && (
            <span className="flex items-center gap-1 whitespace-nowrap text-xs text-[var(--text-muted)]">
              <Clock size={11} />
              {formatRelativeTime(task.dueDate)}
            </span>
          )}
        </div>
        {onMove && (
          <select
            className="flex-shrink-0 rounded-md border border-[var(--border)] bg-[var(--muted)] px-2 py-1 text-xs text-[var(--text-secondary)] outline-none transition-colors hover:border-[var(--border-hover)] focus:border-[var(--brand)] focus:ring-2 focus:ring-[var(--brand)]/25"
            value={task.status}
            onChange={(e) => onMove(task._id || task.id, e.target.value)}
            onClick={(e) => e.stopPropagation()}
            aria-label="Move task to status"
          >
            <option value="todo">To Do</option>
            <option value="in_progress">In Progress</option>
            <option value="completed">Done</option>
          </select>
        )}
      </div>
    </div>
  );
}