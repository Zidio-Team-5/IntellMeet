import SegmentedControl from "../../shared/ui/SegmentedControl.jsx";

const FILTERS = [
  { label: "All", value: "all" },
  { label: "Live", value: "live" },
  { label: "Upcoming", value: "upcoming" },
  { label: "Completed", value: "completed" },
];

export default function MeetingFilters({ active = "all", onChange }) {
  return (
    <SegmentedControl
      options={FILTERS}
      value={active}
      onChange={onChange}
      ariaLabel="Filter meetings by status"
    />
  );
}