import DashboardLayout from "../shared/layouts/DashboardLayout.jsx";
import PageHeader from "../shared/ui/PageHeader.jsx";
import AnalyticsOverview from "../features/analytics/AnalyticsOverview.jsx";
import ProductivityMetrics from "../features/analytics/ProductivityMetrics.jsx";
import TeamPerformance from "../features/analytics/TeamPerformance.jsx";
import MeetingInsights from "../features/analytics/MeetingInsights.jsx";
import KnowledgeMetrics from "../features/analytics/KnowledgeMetrics.jsx";
import MeetingsChart from "../features/analytics/MeetingsChart.jsx";
import TaskProgressChart from "../features/analytics/TaskProgressChart.jsx";

export default function Analytics() {
  return (
    <DashboardLayout>
      <PageHeader
        title="Analytics"
        subtitle="Organization-wide productivity insights and meeting intelligence."
      />

      <AnalyticsOverview />

      <div className="mt-6">
        <KnowledgeMetrics />
      </div>

      <div className="mt-6 grid grid-cols-1 gap-5 lg:grid-cols-2">
        <ProductivityMetrics />
        <TeamPerformance />
      </div>

      <div className="mt-6 grid grid-cols-1 gap-5 lg:grid-cols-2">
        <MeetingsChart />
        <TaskProgressChart />
      </div>

      <div className="mt-6">
        <MeetingInsights />
      </div>
    </DashboardLayout>
  );
}