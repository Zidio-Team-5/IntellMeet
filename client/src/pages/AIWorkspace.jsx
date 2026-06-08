import DashboardLayout from "../shared/layouts/DashboardLayout.jsx";
import PageHeader from "../shared/ui/PageHeader.jsx";
import AICopilotPanel from "../features/ai/AICopilotPanel.jsx";
import AISummaryViewer from "../features/ai/AISummaryViewer.jsx";
import AIActionItems from "../features/ai/AIActionItems.jsx";
import AIKnowledgeSearch from "../features/ai/AIKnowledgeSearch.jsx";
import PromptTemplates from "../features/ai/components/PromptTemplates.jsx";
import AIHistory from "../features/ai/components/AIHistory.jsx";
import Card from "../shared/ui/Card.jsx";

export default function AIWorkspace() {
  return (
    <DashboardLayout>
      <PageHeader
        title="AI Workspace"
        subtitle="Intelligent assistant powered by your meeting data and workspace knowledge."
      />

      <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
        <div className="space-y-5">
          <AICopilotPanel />
          <Card>
            <AIHistory />
          </Card>
        </div>

        <div className="space-y-5">
          <AISummaryViewer />
          <Card>
            <PromptTemplates />
          </Card>
          <AIKnowledgeSearch />
          <AIActionItems />
        </div>
      </div>
    </DashboardLayout>
  );
}