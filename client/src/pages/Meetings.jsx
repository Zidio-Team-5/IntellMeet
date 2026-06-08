import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Plus } from "lucide-react";
import DashboardLayout from "../shared/layouts/DashboardLayout.jsx";
import PageHeader from "../shared/ui/PageHeader.jsx";
import Button from "../shared/ui/Button.jsx";
import MeetingStats from "../features/meetings/MeetingStats.jsx";
import MeetingFilters from "../features/meetings/MeetingFilters.jsx";
import MeetingList from "../features/meetings/MeetingList.jsx";
import CreateMeetingModal from "../features/meetings/CreateMeetingModal.jsx";
import JoinMeetingCard from "../features/meetings/JoinMeetingCard.jsx";
import { TableSkeleton } from "../shared/ui/Skeleton.jsx";
import { getMeetings } from "../services/meetingService.js";

export default function Meetings() {
  const [openCreate, setOpenCreate] = useState(false);
  const [filter, setFilter] = useState("all");
  const { data, isLoading } = useQuery({ queryKey: ["meetings"], queryFn: getMeetings });
  const meetings = data?.meetings ?? data ?? [];

  return (
    <DashboardLayout>
      <PageHeader
        title="Meetings"
        subtitle="Create, join and manage team meetings."
        actions={
          <Button icon={Plus} onClick={() => setOpenCreate(true)}>
            New meeting
          </Button>
        }
      />

      <MeetingStats />

      <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <MeetingFilters active={filter} onChange={setFilter} />
          <div className="mt-4">
            {isLoading ? <TableSkeleton rows={6} cols={5} /> : <MeetingList meetings={meetings} filter={filter} />}
          </div>
        </div>
        <div>
          <JoinMeetingCard />
        </div>
      </div>

      <CreateMeetingModal isOpen={openCreate} onClose={() => setOpenCreate(false)} />
    </DashboardLayout>
  );
}