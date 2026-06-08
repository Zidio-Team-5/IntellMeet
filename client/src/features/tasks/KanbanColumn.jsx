import TaskCard from "./TaskCard.jsx";

const COLUMN_STYLE = {
  todo:        { label: "To Do",       dot: "var(--text-muted)" },
  in_progress: { label: "In Progress", dot: "var(--brand)" },
  completed:   { label: "Done",        dot: "var(--success)" },
};

export default function KanbanColumn({ title, status, tasks = [], onMoveTask }) {
  const style = COLUMN_STYLE[status] || { label: title, dot: "var(--text-muted)" };

  return (
    <div className="flex flex-col rounded-[10px] border border-[var(--border)] bg-[var(--bg-surface)]">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-[var(--border)] px-3.5 py-2.5">
        <div className="flex items-center gap-2">
          <span className="h-2 w-2 rounded-full" style={{ background: style.dot }} />
          <h3 className="text-sm font-semibold text-[var(--text)]">{style.label}</h3>
        </div>
        <span className="rounded-full border border-[var(--border)] bg-[var(--muted)] px-2 py-0.5 text-xs font-medium tabular-nums text-[var(--text-secondary)]">
          {tasks.length}
        </span>
      </div>

      {/* Tasks */}
      <div className="min-h-[200px] flex-1 space-y-2.5 p-2.5">
        {tasks.map((task) => (
          <TaskCard key={task._id || task.id} task={task} onMove={onMoveTask} />
        ))}
        {tasks.length === 0 && (
          <div className="flex h-24 items-center justify-center rounded-md border border-dashed border-[var(--border)]">
            <p className="text-xs text-[var(--text-muted)]">No tasks</p>
          </div>
        )}
      </div>
    </div>
  );
}