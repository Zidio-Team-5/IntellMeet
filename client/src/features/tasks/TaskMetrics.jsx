import { useQuery } from "@tanstack/react-query";
import { CheckSquare, Clock, AlertTriangle, TrendingUp } from "lucide-react";
import StatsCard from "../dashboard/StatsCard.jsx";
import { getTasks } from "../../services/taskService.js";

export default function TaskMetrics() {
  const { data } = useQuery({ queryKey: ["tasks"], queryFn: getTasks });
  const tasks = data?.tasks ?? data ?? [];

  const todo       = tasks.filter((t) => t.status === "todo").length;
  const inProgress = tasks.filter((t) => t.status === "in_progress").length;
  const completed  = tasks.filter((t) => t.status === "completed").length;
  const overdue    = tasks.filter((t) => t.dueDate && new Date(t.dueDate) < new Date() && t.status !== "completed").length;

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
      <StatsCard title="To Do" value={todo} icon={Clock} index={0} />
      <StatsCard title="In Progress" value={inProgress} icon={TrendingUp} index={1} />
      <StatsCard title="Completed" value={completed} icon={CheckSquare} index={2} />
      <StatsCard title="Overdue" value={overdue} icon={AlertTriangle} index={3} />
    </div>
  );
}