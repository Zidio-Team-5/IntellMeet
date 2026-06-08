export default function Input({
  label,
  error,
  hint,
  className = "",
  icon: Icon,
  rightElement,
  ...props
}) {
  // Padding is set explicitly (no conflicting px-* utility) so the icon/right
  // control never collides with the text or placeholder.
  const padLeft = Icon ? "pl-9" : "pl-3";
  const padRight = rightElement ? "pr-10" : "pr-3";

  return (
    <div className="flex flex-col gap-1.5">
      {label && (
        <label className="text-sm font-medium text-[var(--text)]">
          {label}
        </label>
      )}

      <div className="relative">
        {/* Left icon: full-height flex container = always vertically centered */}
        {Icon && (
          <span className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-[var(--text-muted)]">
            <Icon size={16} />
          </span>
        )}

        <input
          className={`
            h-10 w-full rounded-md border border-[var(--border)] bg-[var(--card)]
            ${padLeft} ${padRight}
            text-sm text-[var(--text)] placeholder:text-[var(--text-muted)]
            outline-none transition-colors duration-150
            hover:border-[var(--border-hover)]
            focus:border-[var(--brand)] focus:ring-2 focus:ring-[var(--brand)]/25
            disabled:cursor-not-allowed disabled:opacity-50
            ${error ? "border-[var(--error)] focus:border-[var(--error)] focus:ring-[var(--error)]/25" : ""}
            ${className}
          `}
          {...props}
        />

        {/* Right control (e.g. password visibility): full-height flex = centered */}
        {rightElement && (
          <span className="absolute inset-y-0 right-0 flex items-center pr-3">
            {rightElement}
          </span>
        )}
      </div>

      {error && <span className="text-xs text-[var(--error)]">{error}</span>}
      {hint && !error && (
        <span className="text-xs text-[var(--text-muted)]">{hint}</span>
      )}
    </div>
  );
}