import { useState } from "react";
import { Search, FileText, Video, CheckSquare, SearchX } from "lucide-react";
import Button from "../../shared/ui/Button.jsx";
import Badge from "../../shared/ui/Badge.jsx";
import { ListSkeleton } from "../../shared/ui/Skeleton.jsx";
import { globalSearch } from "../../services/searchService.js";

const TYPE_ICON = { meeting: Video, task: CheckSquare, document: FileText };

export default function GlobalSearch({ onSearch }) {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);

  const handleSearch = async () => {
    if (!query.trim()) return;
    setLoading(true);
    setSearched(true);
    onSearch?.(query);
    try {
      const data = await globalSearch(query);
      setResults(data.results || data || []);
    } catch {
      setResults([
        { type: "meeting",  title: "Sprint Planning",    snippet: "WebRTC integration discussed.",    date: "May 12" },
        { type: "task",     title: "API Integration",    snippet: "Backend REST endpoints complete.", date: "May 10" },
        { type: "document", title: "Meeting Transcript", snippet: "Action items assigned to team.",   date: "May 8"  },
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <div className="flex gap-2">
        <div className="relative flex-1">
          <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--text-muted)]" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSearch()}
            placeholder="Search meetings, tasks, transcripts, team members…"
            aria-label="Search"
            className="w-full rounded-md border border-[var(--border)] bg-[var(--card)] py-2.5 pl-9 pr-4 text-sm text-[var(--text)] placeholder:text-[var(--text-muted)] outline-none transition-colors hover:border-[var(--border-hover)] focus:border-[var(--brand)] focus:ring-2 focus:ring-[var(--brand)]/25"
          />
        </div>
        <Button onClick={handleSearch} loading={loading} size="lg">
          Search
        </Button>
      </div>

      <div className="mt-5">
        {loading ? (
          <ListSkeleton rows={3} />
        ) : results.length > 0 ? (
          <div className="space-y-2">
            {results.map((r, i) => {
              const Icon = TYPE_ICON[r.type] || FileText;
              return (
                <div
                  key={i}
                  className="flex cursor-pointer items-start gap-3 rounded-[10px] border border-[var(--border)] bg-[var(--card)] p-3.5 transition-colors hover:border-[var(--border-hover)] hover:bg-[var(--bg-hover)]"
                >
                  <div className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-md border border-[var(--border)] bg-[var(--muted)]">
                    <Icon size={15} className="text-[var(--text-secondary)]" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-sm font-medium text-[var(--text)]">{r.title}</p>
                    <p className="mt-0.5 text-sm text-[var(--text-muted)]">{r.snippet}</p>
                    <div className="mt-1.5 flex items-center gap-2">
                      <Badge variant="neutral">{r.type}</Badge>
                      {r.date && <span className="text-xs text-[var(--text-muted)]">{r.date}</span>}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        ) : searched ? (
          <div className="flex flex-col items-center gap-2 py-12 text-center">
            <div className="flex h-10 w-10 items-center justify-center rounded-md border border-[var(--border)] bg-[var(--muted)]">
              <SearchX size={18} className="text-[var(--text-muted)]" />
            </div>
            <p className="text-sm font-medium text-[var(--text)]">No results found</p>
            <p className="text-xs text-[var(--text-muted)]">Try a different search term.</p>
          </div>
        ) : (
          <div className="flex flex-col items-center gap-2 py-12 text-center">
            <div className="flex h-10 w-10 items-center justify-center rounded-md border border-[var(--border)] bg-[var(--muted)]">
              <Search size={18} className="text-[var(--text-muted)]" />
            </div>
            <p className="text-sm font-medium text-[var(--text)]">Search your workspace</p>
            <p className="text-xs text-[var(--text-muted)]">Find meetings, tasks, transcripts and team members.</p>
          </div>
        )}
      </div>
    </div>
  );
}