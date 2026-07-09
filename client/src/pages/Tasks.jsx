import { useState } from "react";
import { Plus } from "lucide-react";
import DashboardLayout from "../shared/layouts/DashboardLayout.jsx";
import PageHeader from "../shared/ui/PageHeader.jsx";
import Button from "../shared/ui/Button.jsx";
import TaskMetrics from "../features/tasks/TaskMetrics.jsx";
import KanbanBoard from "../features/tasks/KanbanBoard.jsx";
import ActionItemImporter from "../features/tasks/ActionItemImporter.jsx";
import NewTaskModal from "../features/tasks/NewTaskModal.jsx";
import useAuthStore from "../core/store/authStore.js";

export default function Tasks() {
  const [showImporter, setShowImporter] = useState(false);
  const [showNewTask, setShowNewTask] = useState(false);
  const { user } = useAuthStore();
  const isAdmin = user?.role === "admin";

  return (
    <DashboardLayout>
      <PageHeader
        title="Tasks"
        subtitle="Kanban board — track and manage your team's work."
        actions={
          <div className="flex gap-2">
            {isAdmin && (
              <>
                <Button variant="outline" onClick={() => setShowImporter((v) => !v)}>
                  Import from AI
                </Button>
                <Button icon={Plus} onClick={() => setShowNewTask(true)}>New task</Button>
              </>
            )}
          </div>
        }
      />

      <TaskMetrics />

      {showImporter && (
        <div className="mt-5">
          <ActionItemImporter />
        </div>
      )}

      <div className="mt-6">
        <KanbanBoard />
      </div>

      <NewTaskModal isOpen={showNewTask} onClose={() => setShowNewTask(false)} />
    </DashboardLayout>
  );
}
