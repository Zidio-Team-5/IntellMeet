import { Video } from "lucide-react";
import EmptyState from "../../shared/ui/EmptyState.jsx";

export default function MeetingEmptyState() {
  return (
    <div className="rounded-[10px] border border-[var(--border)] py-2">
      <EmptyState
        icon={Video}
        title="No meetings found"
        description="Create a new meeting or adjust your filter."
      />
    </div>
  );
}