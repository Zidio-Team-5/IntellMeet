import { NavLink, useNavigate } from "react-router-dom";
import { LogOut } from "lucide-react";
import Logo from "./Logo.jsx";
import { NAV_LINKS } from "../../config/navigation.config.js";
import useAuthStore from "../../core/store/authStore.js";
import { initials, avatarColor } from "../utils/formatters.js";

// Presentational grouping of the existing NAV_LINKS (routing/config unchanged).
// Any link not matched falls into a trailing "More" group so nothing is lost.
const SECTIONS = [
  { label: "Workspace", paths: ["/dashboard", "/meetings", "/history", "/tasks"] },
  { label: "Intelligence", paths: ["/ai", "/analytics", "/search"] },
  { label: "Organization", paths: ["/team"] },
  { label: "Account", paths: ["/profile", "/settings"] },
];

function buildGroups(links) {
  const used = new Set();
  const groups = SECTIONS.map((s) => ({
    label: s.label,
    items: s.paths
      .map((p) => links.find((l) => l.path === p))
      .filter(Boolean)
      .map((l) => (used.add(l.path), l)),
  })).filter((g) => g.items.length);

  const leftovers = links.filter((l) => !used.has(l.path));
  if (leftovers.length) groups.push({ label: "More", items: leftovers });
  return groups;
}

export default function Sidebar({ onNavigate }) {
  const { user, logout } = useAuthStore();
  const navigate = useNavigate();
  const groups = buildGroups(NAV_LINKS);

  const handleLogout = () => {
    logout();
    navigate("/");
    onNavigate?.();
  };

  return (
    <div className="glass-strong flex h-full w-60 flex-col border-r border-[var(--border)]">
      {/* Brand */}
      <div className="flex h-12 items-center px-4">
        <Logo />
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto px-2 pb-4">
        {groups.map((group) => (
          <div key={group.label} className="mb-1">
            <p className="px-2.5 pb-1 pt-4 text-[11px] font-medium uppercase tracking-wider text-[var(--text-muted)]">
              {group.label}
            </p>
            <div className="space-y-0.5">
              {group.items.map((item) => {
                const Icon = item.icon;
                return (
                  <NavLink
                    key={item.path}
                    to={item.path}
                    onClick={() => onNavigate?.()}
                    className={({ isActive }) =>
                      `group relative flex items-center gap-2.5 rounded-md px-2.5 py-1.5 text-sm transition-colors duration-150 ${
                        isActive
                          ? "bg-[var(--brand-subtle)] font-medium text-[var(--text)]"
                          : "text-[var(--text-secondary)] hover:bg-[var(--muted)] hover:text-[var(--text)]"
                      }`
                    }
                  >
                    {({ isActive }) => (
                      <>
                        {isActive && (
                          <span className="absolute left-0 top-1/2 h-4 w-0.5 -translate-y-1/2 rounded-full bg-[var(--brand)]" />
                        )}
                        <Icon
                          size={16}
                          className={`flex-shrink-0 ${
                            isActive ? "text-[var(--brand)]" : "text-[var(--text-muted)] group-hover:text-[var(--text)]"
                          }`}
                        />
                        <span className="truncate">{item.label}</span>
                      </>
                    )}
                  </NavLink>
                );
              })}
            </div>
          </div>
        ))}
      </nav>

      {/* User footer */}
      <div className="border-t border-[var(--border)] p-2">
        <div className="flex items-center gap-2.5 rounded-md px-2 py-1.5">
          <div
            className="flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-md text-[11px] font-bold text-white"
            style={{ background: avatarColor(user?.name || "U") }}
          >
            {initials(user?.name || "User")}
          </div>
          <div className="min-w-0 flex-1">
            <p className="truncate text-xs font-medium text-[var(--text)]">
              {user?.name || "User"}
            </p>
            <p className="truncate text-[11px] text-[var(--text-muted)]">
              {user?.email || ""}
            </p>
          </div>
          <button
            onClick={handleLogout}
            title="Sign out"
            aria-label="Sign out"
            className="rounded-md p-1.5 text-[var(--text-muted)] transition-colors hover:bg-[var(--muted)] hover:text-[var(--text)]"
          >
            <LogOut size={14} />
          </button>
        </div>
      </div>
    </div>
  );
}