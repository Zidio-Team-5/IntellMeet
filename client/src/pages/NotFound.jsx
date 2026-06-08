import { Link } from "react-router-dom";
import { Home, ArrowLeft } from "lucide-react";

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-[var(--background)] px-6 text-center">
      <span className="font-display text-7xl font-semibold leading-none tracking-tight text-[var(--text-muted)] tabular-nums">
        404
      </span>

      <h1 className="mt-6 font-display text-xl font-semibold text-[var(--text)]">Page not found</h1>
      <p className="mt-2 max-w-md text-sm text-[var(--text-secondary)]">
        The page you&apos;re looking for doesn&apos;t exist or has been moved.
      </p>

      <div className="mt-7 flex gap-2">
        <button
          onClick={() => window.history.back()}
          className="flex items-center gap-2 rounded-md border border-[var(--border)] bg-[var(--card)] px-4 py-2 text-sm font-medium text-[var(--text)] transition-colors hover:bg-[var(--muted)] hover:border-[var(--border-hover)]"
        >
          <ArrowLeft size={15} />
          Go back
        </button>
        <Link
          to="/dashboard"
          className="flex items-center gap-2 rounded-md bg-[var(--primary)] px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-[var(--primary-hover)]"
        >
          <Home size={15} />
          Dashboard
        </Link>
      </div>
    </div>
  );
}