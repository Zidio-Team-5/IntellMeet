import AnalyticsOverview from "../AnalyticsOverview.jsx";
import ProductivityMetrics from "../ProductivityMetrics.jsx";
import TeamPerformance from "../TeamPerformance.jsx";
import MeetingsChart from "../MeetingsChart.jsx";
import TaskProgressChart from "../TaskProgressChart.jsx";

export default function ExecutiveDashboard() {
  return (
    <div className="space-y-6">
      <AnalyticsOverview />
      <div className="grid gap-6 lg:grid-cols-2">
        <ProductivityMetrics />
        <TeamPerformance />
      </div>
      <div className="grid gap-6 lg:grid-cols-2">
        <MeetingsChart />
        <TaskProgressChart />
      </div>
    </div>
  );
}
