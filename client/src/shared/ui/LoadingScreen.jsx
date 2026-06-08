import { Spinner } from "./Loader.jsx";

export default function LoadingScreen({ label = "Loading IntellMeet..." }) {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-4 bg-[var(--background)]">
      <div className="relative">
        <div
          className="flex h-14 w-14 items-center justify-center rounded-[12px] border border-[var(--border)] bg-[var(--card)] font-display text-2xl font-bold text-[var(--brand)]"
        >
          I
        </div>
        <span className="absolute -bottom-1 -right-1 h-5 w-5 animate-spin rounded-full border-2 border-[var(--border)] border-t-[var(--brand)]" />
      </div>
      <p className="text-sm text-[var(--text-secondary)]">{label}</p>
    </div>
  );
}