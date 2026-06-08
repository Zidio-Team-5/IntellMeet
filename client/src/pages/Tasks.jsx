import { useState } from "react";
import { Plus } from "lucide-react";
import DashboardLayout from "../shared/layouts/DashboardLayout.jsx";
import PageHeader from "../shared/ui/PageHeader.jsx";
import Button from "../shared/ui/Button.jsx";
import TaskMetrics from "../features/tasks/TaskMetrics.jsx";
import KanbanBoard from "../features/tasks/KanbanBoard.jsx";
import ActionItemImporter from "../features/tasks/ActionItemImporter.jsx";

export default function Tasks() {
  const [showImporter, setShowImporter] = useState(false);

  return (
    <DashboardLayout>
      <PageHeader
        title="Tasks"
        subtitle="Kanban board — track and manage your team's work."
        actions={
          <div className="flex gap-2">
            <Button variant="outline" onClick={() => setShowImporter((v) => !v)}>
              Import from AI
            </Button>
            <Button icon={Plus}>New task</Button>
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
    </DashboardLayout>
  );
}