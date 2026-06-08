import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import KanbanColumn from "./KanbanColumn.jsx";
import Skeleton from "../../shared/ui/Skeleton.jsx";
import { getTasks, updateTask } from "../../services/taskService.js";

const COLUMNS = ["todo", "in_progress", "completed"];
const COLUMN_LABELS = { todo: "To Do", in_progress: "In Progress", completed: "Done" };

function BoardSkeleton() {
  return (
    <div className="grid grid-cols-1 gap-5 lg:grid-cols-3">
      {COLUMNS.map((status) => (
        <div key={status} className="rounded-[10px] border border-[var(--border)] bg-[var(--bg-surface)]">
          <div className="flex items-center justify-between border-b border-[var(--border)] px-3.5 py-2.5">
            <Skeleton className="h-3.5 w-20" />
            <Skeleton className="h-4 w-6 rounded-full" />
          </div>
          <div className="space-y-2.5 p-2.5">
            {[0, 1].map((i) => (
              <div key={i} className="rounded-md border border-[var(--border)] bg-[var(--card)] p-3">
                <Skeleton className="h-3.5 w-3/4" />
                <Skeleton className="mt-2 h-3 w-1/2" />
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

export default function KanbanBoard() {
  const queryClient = useQueryClient();

  const { data, isLoading } = useQuery({
    queryKey: ["tasks"],
    queryFn: getTasks,
  });

  const moveMutation = useMutation({
    mutationFn: ({ id, status }) => updateTask(id, { status }),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["tasks"] }),
  });

  const tasks = data?.tasks ?? data ?? [];

  const getTasksByStatus = (status) => tasks.filter((t) => t.status === status);

  if (isLoading) return <BoardSkeleton />;

  return (
    <div className="grid grid-cols-1 gap-5 lg:grid-cols-3">
      {COLUMNS.map((status) => (
        <KanbanColumn
          key={status}
          status={status}
          title={COLUMN_LABELS[status]}
          tasks={getTasksByStatus(status)}
          onMoveTask={(id, newStatus) => moveMutation.mutate({ id, status: newStatus })}
        />
      ))}
    </div>
  );
}