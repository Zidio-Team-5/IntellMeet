export default function Logo({ compact = false }) {
  return (
    <div className="flex items-center gap-2.5">
      <div
        className="flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-md font-display text-sm font-bold text-white"
        style={{ background: "var(--gradient-brand)" }}
        aria-hidden="true"
      >
        I
      </div>
      {!compact && (
        <div className="leading-none">
          <p className="font-display text-sm font-semibold leading-none text-[var(--text)]">
            IntellMeet
          </p>
          <p className="mt-1 text-[11px] leading-none text-[var(--text-muted)]">
            AI Collaboration
          </p>
        </div>
      )}
    </div>
  );
}