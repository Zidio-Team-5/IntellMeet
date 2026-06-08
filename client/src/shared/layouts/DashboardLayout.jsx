import { useEffect, useState } from "react";
import Sidebar from "../ui/Sidebar.jsx";
import Navbar from "../ui/Navbar.jsx";
import ErrorBoundary from "../ui/ErrorBoundary.jsx";
import ErrorState from "../ui/ErrorState.jsx";

export default function DashboardLayout({ children }) {
  // Local, presentational state for the mobile navigation drawer only.
  const [drawerOpen, setDrawerOpen] = useState(false);
  const closeDrawer = () => setDrawerOpen(false);

  // Accessible dialog behavior for the drawer: Esc closes, body scroll locks.
  useEffect(() => {
    if (!drawerOpen) return;
    const onKey = (e) => {
      if (e.key === "Escape") setDrawerOpen(false);
    };
    document.addEventListener("keydown", onKey);
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = prevOverflow;
    };
  }, [drawerOpen]);

  return (
    <div className="flex min-h-screen bg-[var(--background)] text-[var(--text)]">
      {/* Desktop sidebar */}
      <aside className="sticky top-0 hidden h-screen flex-shrink-0 lg:flex">
        <Sidebar />
      </aside>

      {/* Mobile drawer (below lg) */}
      <div className="lg:hidden" role="dialog" aria-modal="true" aria-label="Navigation" aria-hidden={!drawerOpen}>
        {/* Backdrop */}
        <div
          onClick={closeDrawer}
          className={`fixed inset-0 z-40 bg-black/50 transition-opacity duration-200 ${
            drawerOpen ? "opacity-100" : "pointer-events-none opacity-0"
          }`}
        />
        {/* Panel */}
        <div
          className={`fixed inset-y-0 left-0 z-50 h-full transition-transform duration-200 ease-out ${
            drawerOpen ? "translate-x-0" : "-translate-x-full"
          }`}
        >
          <Sidebar onNavigate={closeDrawer} />
        </div>
      </div>

      {/* Main column */}
      <div className="flex min-w-0 flex-1 flex-col">
        <Navbar onMenuClick={() => setDrawerOpen(true)} />
        <main className="flex-1 overflow-auto p-4 sm:p-5 lg:p-6">
          <ErrorBoundary
            FallbackComponent={({ error, resetErrorBoundary }) => (
              <ErrorState message={error?.message} onRetry={resetErrorBoundary} />
            )}
          >
            {children}
          </ErrorBoundary>
        </main>
      </div>
    </div>
  );
}