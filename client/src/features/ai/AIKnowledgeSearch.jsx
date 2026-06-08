import { useState } from "react";
import { Search, BookOpen, FileText, Clock } from "lucide-react";
import Card from "../../shared/ui/Card.jsx";
import Button from "../../shared/ui/Button.jsx";
import Badge from "../../shared/ui/Badge.jsx";
import { searchKnowledge } from "../../services/aiService.js";

export default function AIKnowledgeSearch() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);

  const handleSearch = async () => {
    if (!query.trim()) return;
    setLoading(true);
    try {
      const data = await searchKnowledge(query);
      setResults(data.results || data || []);
    } catch {
      setResults([
        { title: "Sprint Planning — May 2026", snippet: "Discussed WebRTC integration timeline and backend API completion.", type: "meeting", date: "May 12" },
        { title: "Client Demo Transcript",      snippet: "Product demo went well. Client requested dark mode support.",      type: "transcript", date: "May 10" },
        { title: "Task: API Integration",       snippet: "Backend REST endpoints complete. Frontend integration pending.",    type: "task", date: "May 8" },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const typeIcon = { meeting: FileText, transcript: Clock, task: BookOpen };

  return (
    <Card padding="">
      <div className="flex items-center gap-2 border-b border-[var(--border)] px-5 py-3.5">
        <BookOpen size={14} className="text-[var(--text-secondary)]" />
        <h3 className="font-display text-sm font-semibold text-[var(--text)]">Knowledge search</h3>
      </div>
      <div className="p-5">
        <div className="flex gap-2">
          <div className="relative flex-1">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--text-muted)]" />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSearch()}
              placeholder="Search meetings, transcripts, tasks…"
              aria-label="Search knowledge"
              className="w-full rounded-md border border-[var(--border)] bg-[var(--card)] py-2.5 pl-9 pr-4 text-sm text-[var(--text)] placeholder:text-[var(--text-muted)] outline-none transition-colors hover:border-[var(--border-hover)] focus:border-[var(--brand)] focus:ring-2 focus:ring-[var(--brand)]/25"
            />
          </div>
          <Button onClick={handleSearch} loading={loading} icon={Search}>Search</Button>
        </div>

        {results.length > 0 && (
          <div className="mt-4 space-y-2">
            {results.map((r, i) => {
              const Icon = typeIcon[r.type] || FileText;
              return (
                <div key={i} className="cursor-pointer rounded-md border border-[var(--border)] p-3.5 transition-colors hover:border-[var(--border-hover)] hover:bg-[var(--bg-hover)]">
                  <div className="flex items-start gap-3">
                    <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-md border border-[var(--border)] bg-[var(--muted)]">
                      <Icon size={14} className="text-[var(--text-secondary)]" />
                    </div>
                    <div className="min-w-0">
                      <p className="text-sm font-medium text-[var(--text)]">{r.title}</p>
                      <p className="mt-0.5 line-clamp-2 text-xs text-[var(--text-muted)]">{r.snippet}</p>
                      <div className="mt-1.5 flex items-center gap-2">
                        <Badge variant="neutral">{r.type}</Badge>
                        {r.date && <span className="text-[10px] text-[var(--text-muted)]">{r.date}</span>}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </Card>
  );
}