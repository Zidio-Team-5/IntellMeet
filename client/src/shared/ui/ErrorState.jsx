import { AlertTriangle } from "lucide-react";
import Button from "./Button.jsx";

export default function ErrorState({ message, onRetry }) {
  return (
    <div className="flex flex-col items-center rounded-[10px] border border-[var(--border)] bg-[var(--card)] px-6 py-10 text-center">
      <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-md border border-[var(--border)] bg-[var(--muted)]">
        <AlertTriangle size={18} className="text-[var(--error)]" />
      </div>
      <p className="text-sm font-semibold text-[var(--text)]">Something went wrong</p>
      {message && <p className="mt-1 max-w-sm text-xs text-[var(--text-muted)]">{message}</p>}
      {onRetry && (
        <Button variant="outline" size="sm" className="mt-4" onClick={onRetry}>
          Retry
        </Button>
      )}
    </div>
  );
}