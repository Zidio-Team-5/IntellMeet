import DashboardLayout from "../shared/layouts/DashboardLayout.jsx";
import PageHeader from "../shared/ui/PageHeader.jsx";
import GlobalSearch from "../features/search/GlobalSearch.jsx";
import CommandPalette from "../features/search/CommandPalette.jsx";
import Card from "../shared/ui/Card.jsx";

export default function SearchWorkspace() {
  return (
    <DashboardLayout>
      <PageHeader
        title="Search"
        subtitle="Search across meetings, tasks, transcripts and team members."
      />

      <GlobalSearch onSearch={(q) => console.log("Search:", q)} />

      <div className="mt-6">
        <Card>
          <p className="mb-1 text-sm font-medium text-[var(--text)]">Quick commands</p>
          <p className="mb-4 text-xs text-[var(--text-muted)]">
            Jump to any section, or press <kbd className="rounded border border-[var(--border)] bg-[var(--muted)] px-1 text-[10px]">⌘K</kbd> anywhere.
          </p>
          <CommandPalette />
        </Card>
      </div>
    </DashboardLayout>
  );
}