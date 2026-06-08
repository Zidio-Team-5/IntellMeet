import { useNavigate } from "react-router-dom";
import { Plus, Users, CheckSquare, Sparkles, Search, BarChart3 } from "lucide-react";
import Card from "../../shared/ui/Card.jsx";

const ACTIONS = [
  { icon: Plus,        label: "New Meeting",  path: "/meetings" },
  { icon: Users,       label: "Join Meeting", path: "/meetings" },
  { icon: CheckSquare, label: "Create Task",  path: "/tasks" },
  { icon: Sparkles,    label: "AI Assistant", path: "/ai" },
  { icon: Search,      label: "Search",       path: "/search" },
  { icon: BarChart3,   label: "Analytics",    path: "/analytics" },
];

export default function QuickActions() {
  const navigate = useNavigate();
  return (
    <Card padding="">
      <div className="border-b border-[var(--border)] px-5 py-3.5">
        <h3 className="font-display text-sm font-semibold text-[var(--text)]">Quick actions</h3>
      </div>
      <div className="grid grid-cols-3 gap-px overflow-hidden rounded-b-[10px] bg-[var(--border)]">
        {ACTIONS.map((a) => {
          const Icon = a.icon;
          return (
            <button
              key={a.label}
              onClick={() => navigate(a.path)}
              className="group flex flex-col items-center gap-2 bg-[var(--card)] px-3 py-4 text-center transition-colors hover:bg-[var(--bg-hover)]"
            >
              <div className="flex h-9 w-9 items-center justify-center rounded-md border border-[var(--border)] bg-[var(--muted)] transition-colors group-hover:border-[var(--border-hover)]">
                <Icon size={16} className="text-[var(--text-secondary)] group-hover:text-[var(--text)]" />
              </div>
              <span className="text-xs font-medium text-[var(--text-secondary)] group-hover:text-[var(--text)]">
                {a.label}
              </span>
            </button>
          );
        })}
      </div>
    </Card>
  );
}