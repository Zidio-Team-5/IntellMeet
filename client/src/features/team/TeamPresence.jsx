import { useQuery } from "@tanstack/react-query";
import { initials, avatarColor } from "../../shared/utils/formatters.js";
import Card from "../../shared/ui/Card.jsx";
import { getTeamPresence } from "../../services/teamService.js";

const ONLINE = [
  { name: "Alex Chen" }, { name: "Sarah Park" }, { name: "Ananya Singh" }, { name: "Priya Patel" },
];

export default function TeamPresence() {
  const { data } = useQuery({ queryKey: ["team-presence"], queryFn: getTeamPresence });
  const online = data?.members ?? ONLINE;

  return (
    <Card>
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-display text-sm font-semibold text-[var(--text)]">Online Now</h3>
        <span className="flex items-center gap-1.5">
          <span className="h-2 w-2 rounded-full bg-green-500" />
          <span className="text-xs text-[var(--text-muted)]">{online.length} active</span>
        </span>
      </div>
      <div className="flex flex-wrap gap-2">
        {online.map((m) => (
          <div key={m.name} title={m.name} className="relative">
            <div
              className="flex h-9 w-9 items-center justify-center rounded-xl text-xs font-bold text-white"
              style={{ background: avatarColor(m.name) }}
            >
              {initials(m.name)}
            </div>
            <span className="absolute -bottom-0.5 -right-0.5 h-2.5 w-2.5 rounded-full border-2 border-[var(--card)] bg-green-500" />
          </div>
        ))}
      </div>
    </Card>
  );
}