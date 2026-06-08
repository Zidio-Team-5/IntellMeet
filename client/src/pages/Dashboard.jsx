import DashboardLayout from "../shared/layouts/DashboardLayout.jsx";
import PageHeader from "../shared/ui/PageHeader.jsx";
import ExecutiveOverview from "../features/dashboard/ExecutiveOverview.jsx";
import RecentMeetings from "../features/dashboard/RecentMeetings.jsx";
import WorkspaceOverview from "../features/dashboard/WorkspaceOverview.jsx";
import ActivityFeed from "../features/dashboard/ActivityFeed.jsx";
import QuickActions from "../features/dashboard/QuickActions.jsx";
import ProductivityScore from "../features/dashboard/ProductivityScore.jsx";
import UpcomingMeetings from "../features/dashboard/UpcomingMeetings.jsx";
import AIInsightsWidget from "../features/dashboard/AIInsightsWidget.jsx";
import useDashboardStats from "../shared/hooks/useDashboardStats.js";
import useDashboardInsights from "../shared/hooks/useDashboardInsights.js";
import useAuthStore from "../core/store/authStore.js";

export default function Dashboard() {
  const { user } = useAuthStore();
  const { data: stats } = useDashboardStats();
  const { data: insights } = useDashboardInsights();

  return (
    <DashboardLayout>
      <PageHeader
        title={`Welcome back, ${user?.name?.split(" ")[0] || "there"}`}
        subtitle="Here's what's happening across your workspace today."
      />

      <ExecutiveOverview stats={stats?.stats ?? stats} />

      <div className="mt-6 grid grid-cols-1 gap-5 xl:grid-cols-3">
        <div className="space-y-5 xl:col-span-2">
          <RecentMeetings />
          <WorkspaceOverview />
          <ActivityFeed />
        </div>
        <div className="space-y-5">
          <QuickActions />
          <ProductivityScore />
          <UpcomingMeetings />
          <AIInsightsWidget insights={insights} />
        </div>
      </div>
    </DashboardLayout>
  );
}