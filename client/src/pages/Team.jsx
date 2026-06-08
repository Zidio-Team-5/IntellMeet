import DashboardLayout from "../shared/layouts/DashboardLayout.jsx";
import PageHeader from "../shared/ui/PageHeader.jsx";
import TeamStats from "../features/team/TeamStats.jsx";
import TeamDirectory from "../features/team/TeamDirectory.jsx";
import TeamPresence from "../features/team/TeamPresence.jsx";
import TeamWorkload from "../features/team/TeamWorkload.jsx";
import CollaborationGraph from "../features/team/components/CollaborationGraph.jsx";
import WorkloadHeatmap from "../features/team/components/WorkloadHeatmap.jsx";

export default function Team() {
  return (
    <DashboardLayout>
      <PageHeader
        title="Team"
        subtitle="Directory, presence, workload and collaboration insights."
      />

      <TeamStats />

      <div className="mt-6 grid grid-cols-1 gap-5 lg:grid-cols-3">
        <div className="space-y-5 lg:col-span-2">
          <TeamDirectory />
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
            <CollaborationGraph />
            <WorkloadHeatmap />
          </div>
        </div>
        <div className="space-y-5">
          <TeamPresence />
          <TeamWorkload />
        </div>
      </div>
    </DashboardLayout>
  );
}