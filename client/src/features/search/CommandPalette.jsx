import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { Command, ArrowRight, Video, CheckSquare, Sparkles, BarChart3, Users, Settings } from "lucide-react";

const COMMANDS = [
  { label: "Go to Dashboard", path: "/dashboard", icon: Command },
  { label: "New Meeting",     path: "/meetings",  icon: Video },
  { label: "View Tasks",      path: "/tasks",     icon: CheckSquare },
  { label: "AI Workspace",    path: "/ai",        icon: Sparkles },
  { label: "Analytics",       path: "/analytics", icon: BarChart3 },
  { label: "Team Directory",  path: "/team",      icon: Users },
  { label: "Settings",        path: "/settings",  icon: Settings },
];

export default function CommandPalette() {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const navigate = useNavigate();
  const inputRef = useRef(null);

  useEffect(() => {
    const handler = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        setOpen((v) => !v);
      }
      if (e.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, []);

  useEffect(() => {
    if (open) setTimeout(() => inputRef.current?.focus(), 50);
  }, [open]);

  const filtered = COMMANDS.filter((c) =>
    c.label.toLowerCase().includes(query.toLowerCase())
  );

  const run = (cmd) => {
    navigate(cmd.path);
    setOpen(false);
    setQuery("");
  };

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="flex items-center gap-2 rounded-md border border-[var(--border)] bg-[var(--card)] px-3 py-2 text-sm text-[var(--text-secondary)] transition-colors hover:border-[var(--border-hover)] hover:text-[var(--text)]"
      >
        <Command size={14} />
        <span>Open command palette</span>
        <kbd className="ml-2 flex items-center gap-0.5 rounded border border-[var(--border)] bg-[var(--muted)] px-1.5 py-0.5 text-[10px] text-[var(--text-muted)]">
          ⌘K
        </kbd>
      </button>

      {open && (
        <div className="fixed inset-0 z-50 flex items-start justify-center bg-black/60 pt-[15vh] backdrop-blur-[2px]" onClick={() => setOpen(false)}>
          <div
            className="w-full max-w-lg animate-scale-in overflow-hidden rounded-[12px] border border-[var(--border)] bg-[var(--card)] shadow-[var(--shadow-xl)]"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center gap-3 border-b border-[var(--border)] px-4 py-3">
              <Command size={15} className="text-[var(--text-muted)]" />
              <input
                ref={inputRef}
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Type a command or search…"
                aria-label="Command palette"
                className="flex-1 bg-transparent text-sm text-[var(--text)] outline-none placeholder:text-[var(--text-muted)]"
              />
              <kbd className="rounded border border-[var(--border)] bg-[var(--muted)] px-1.5 py-0.5 text-[10px] text-[var(--text-muted)]">
                ESC
              </kbd>
            </div>
            <div className="max-h-72 overflow-y-auto py-1.5">
              {filtered.map((cmd) => {
                const Icon = cmd.icon;
                return (
                  <button
                    key={cmd.path}
                    onClick={() => run(cmd)}
                    className="group flex w-full items-center gap-3 px-3 py-2 text-sm text-[var(--text)] transition-colors hover:bg-[var(--muted)]"
                  >
                    <div className="flex h-7 w-7 items-center justify-center rounded-md border border-[var(--border)] bg-[var(--muted)]">
                      <Icon size={13} className="text-[var(--text-secondary)]" />
                    </div>
                    {cmd.label}
                    <ArrowRight size={13} className="ml-auto text-[var(--text-muted)] opacity-0 transition-opacity group-hover:opacity-100" />
                  </button>
                );
              })}
              {filtered.length === 0 && (
                <p className="py-8 text-center text-sm text-[var(--text-muted)]">No commands found</p>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}