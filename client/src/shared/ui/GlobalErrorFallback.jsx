import { AlertTriangle } from "lucide-react";

export default function GlobalErrorFallback({ error, resetErrorBoundary }) {
  return (
    <div className="flex min-h-screen items-center justify-center bg-[var(--background)] p-8">
      <div className="w-full max-w-md animate-scale-in rounded-[12px] border border-[var(--border)] bg-[var(--card)] p-8 text-center shadow-[var(--shadow-lg)]">
        <div className="mx-auto mb-5 flex h-12 w-12 items-center justify-center rounded-md border border-[var(--border)] bg-[var(--muted)]">
          <AlertTriangle size={22} className="text-[var(--error)]" />
        </div>
        <h1 className="font-display text-lg font-semibold text-[var(--text)]">Something went wrong</h1>
        <p className="mt-2 text-sm text-[var(--text-secondary)]">
          An unexpected error occurred. Our team has been notified.
        </p>
        {error?.message && (
          <pre className="mt-4 overflow-auto rounded-md border border-[var(--border)] bg-[var(--muted)] p-3 text-left text-xs text-[var(--text)]">
            {error.message}
          </pre>
        )}
        <button
          onClick={resetErrorBoundary}
          className="mt-6 w-full rounded-md bg-[var(--primary)] px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-[var(--primary-hover)]"
        >
          Try again
        </button>
      </div>
    </div>
  );
}