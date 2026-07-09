import { initials, avatarColor } from "../../shared/utils/formatters.js";
import { Mail, ExternalLink } from "lucide-react";

export default function TeamMemberCard({ member, onClick }) {
  const isOnline = member.isOnline || member.status === "online";

  return (
    <div
      onClick={onClick}
      role={onClick ? "button" : undefined}
      className="flex items-center gap-4 rounded-2xl border border-[var(--border)] bg-[var(--card)] p-4 hover:border-[var(--border-hover)] hover:shadow-[var(--shadow-sm)] transition-all cursor-pointer"
    >
      <div className="relative flex-shrink-0">
        <div
          className="flex h-12 w-12 items-center justify-center rounded-2xl text-sm font-bold text-white"
          style={{ background: avatarColor(member.name || "U") }}
        >
          {initials(member.name || "U")}
        </div>
        <span
          className="absolute -bottom-0.5 -right-0.5 h-3 w-3 rounded-full border-2 border-[var(--card)]"
          style={{ background: isOnline ? "#2a9d8f" : "var(--text-muted)" }}
        />
      </div>
      <div className="flex-1 min-w-0">
        <p className="font-semibold text-sm text-[var(--text)] truncate">{member.name}</p>
        <p className="text-xs text-[var(--text-muted)] truncate">{member.role || member.department}</p>
        <p className="text-xs mt-0.5" style={{ color: isOnline ? "#2a9d8f" : "var(--text-muted)" }}>
          {isOnline ? "● Online" : "Offline"}
        </p>
      </div>
      <div className="flex items-center gap-1">
        {member.email && (
          <a
            href={`mailto:${member.email}`}
            onClick={(e) => e.stopPropagation()}
            className="rounded-lg p-1.5 text-[var(--text-muted)] hover:bg-[var(--muted)] hover:text-[var(--text)] transition-colors"
          >
            <Mail size={14} />
          </a>
        )}
      </div>
    </div>
  );
}
