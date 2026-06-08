import { Clock, Users, MessageSquare } from "lucide-react";
import Card from "../../shared/ui/Card.jsx";

export default function MeetingMetrics({ duration, attendees, messages }) {
  return (
    <Card>
      <div className="grid grid-cols-3 divide-x divide-[var(--border)]">
        {[
          { icon: Clock,          label: "Duration",   value: duration  || "0 min" },
          { icon: Users,          label: "Attendees",  value: attendees || 0 },
          { icon: MessageSquare,  label: "Messages",   value: messages  || 0 },
        ].map(({ icon: Icon, label, value }) => (
          <div key={label} className="flex flex-col items-center gap-1 px-4">
            <Icon size={16} style={{ color: "var(--text-secondary)" }} />
            <p className="font-display text-lg font-bold text-[var(--text)]">{value}</p>
            <p className="text-xs text-[var(--text-muted)]">{label}</p>
          </div>
        ))}
      </div>
    </Card>
  );
}
