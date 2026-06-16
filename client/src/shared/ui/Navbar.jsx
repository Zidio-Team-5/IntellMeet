import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Bell, Search, Command, Menu } from "lucide-react";
import ThemeToggle from "./ThemeToggle.jsx";
import Logo from "./Logo.jsx";
import useAuthStore from "../../core/store/authStore.js";
import { initials, avatarColor } from "../utils/formatters.js";
import useNotifications from "../../shared/hooks/useNotifications.js";
import NotificationCenter from "../../features/notifications/NotificationCenter.jsx";


export default function Navbar({ onMenuClick }) {
  const { user } = useAuthStore();
  const navigate = useNavigate();
  const [searchValue, setSearchValue] = useState("");
  const [showNotifications, setShowNotifications] = useState(false);
  const notificationRef = useRef(null);

  // Live unread count (polled + invalidated by the realtime notification event).
  const { data: notifData } = useNotifications();
  const notifications = notifData?.notifications ?? notifData ?? [];
  const unreadCount = notifications.filter((n) => !n.read).length;

  // Existing behavior preserved: Enter submits to the search route.
  const handleSearch = (e) => {
    if (e.key === "Enter" && searchValue.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchValue)}`);
    }
  };
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        notificationRef.current &&
        !notificationRef.current.contains(event.target)
      ) {
        setShowNotifications(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <header className="glass-strong sticky top-0 z-30 flex h-12 flex-shrink-0 items-center gap-3 border-b border-[var(--border)] px-3 sm:px-4">
      {/* Mobile: menu + compact logo (sidebar is hidden below lg) */}
      <button
        onClick={onMenuClick}
        aria-label="Open navigation menu"
        className="flex h-8 w-8 items-center justify-center rounded-md text-[var(--text-secondary)] transition-colors hover:bg-[var(--muted)] hover:text-[var(--text)] lg:hidden"
      >
        <Menu size={18} />
      </button>
      <div className="lg:hidden">
        <Logo compact />
      </div>

      {/* Search (desktop) — preserves existing search submit */}
      <div className="relative hidden w-full max-w-sm sm:block">
        <Search
          size={14}
          className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--text-muted)]"
        />
        <input
          value={searchValue}
          onChange={(e) => setSearchValue(e.target.value)}
          onKeyDown={handleSearch}
          placeholder="Search…"
          aria-label="Search"
          className="w-full rounded-md border border-[var(--border)] bg-[var(--card)] py-1.5 pl-9 pr-12 text-sm text-[var(--text)] placeholder:text-[var(--text-muted)] outline-none transition-colors hover:border-[var(--border-hover)] focus:border-[var(--brand)] focus:ring-2 focus:ring-[var(--brand)]/25"
        />
        <kbd className="pointer-events-none absolute right-2.5 top-1/2 hidden -translate-y-1/2 items-center gap-0.5 rounded border border-[var(--border)] bg-[var(--muted)] px-1.5 py-0.5 text-[10px] text-[var(--text-muted)] sm:flex">
          <Command size={9} /> K
        </kbd>
      </div>

      <div className="ml-auto flex items-center gap-1.5">

        <div className="relative" ref={notificationRef}>
          <button
            onClick={() => setShowNotifications((prev) => !prev)}
            className="relative flex h-8 w-8 items-center justify-center rounded-md border border-[var(--border)] bg-[var(--card)] text-[var(--text-secondary)] transition-colors hover:bg-[var(--muted)] hover:text-[var(--text)]"
            aria-label="Notifications"
          >
            <Bell size={15} />

            {unreadCount > 0 && (
              <span className="absolute -right-1 -top-1 flex h-4 min-w-4 items-center justify-center rounded-full bg-[var(--brand)] px-1 text-[10px] font-bold leading-none text-white">
                {unreadCount > 9 ? "9+" : unreadCount}
              </span>
            )}
          </button>

          {showNotifications && (
            <div
              className="
          absolute
          right-0
          top-full
          mt-2
          z-50
          w-[420px]
          max-h-[500px]
          overflow-y-auto
          rounded-2xl
          border
          border-[var(--border)]
          bg-[var(--card)]
          shadow-2xl
        "
            >
              <NotificationCenter />
            </div>
          )}
        </div>

        <ThemeToggle />

        <button
          onClick={() => navigate("/profile")}
          className="flex h-8 w-8 items-center justify-center rounded-md text-[11px] font-bold text-white transition-opacity hover:opacity-90"
          style={{ background: avatarColor(user?.name || "U") }}
          aria-label="Profile"
        >
          {initials(user?.name || "U")}
        </button>

      </div>
    </header >
  );
}