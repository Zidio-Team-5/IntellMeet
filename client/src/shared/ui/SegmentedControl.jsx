/**
 * Controlled segmented control. Replaces ad-hoc filter "pills".
 *
 * options: array of { label, value } or plain strings
 * value:   currently selected value
 * onChange(value)
 */
const SIZES = {
  sm: "text-xs px-2.5 py-1",
  md: "text-sm px-3 py-1.5",
};

export default function SegmentedControl({
  options = [],
  value,
  onChange,
  size = "md",
  className = "",
  ariaLabel = "View",
}) {
  const items = options.map((o) =>
    typeof o === "string" ? { label: o, value: o } : o
  );
  const sizeCls = SIZES[size] || SIZES.md;

  return (
    <div
      role="group"
      aria-label={ariaLabel}
      className={`inline-flex items-center gap-0.5 rounded-md border border-[var(--border)] bg-[var(--muted)] p-0.5 ${className}`}
    >
      {items.map((item) => {
        const active = item.value === value;
        return (
          <button
            key={item.value}
            type="button"
            aria-pressed={active}
            onClick={() => onChange?.(item.value)}
            className={`rounded-[6px] font-medium transition-colors duration-150 ${sizeCls} ${
              active
                ? "bg-[var(--card)] text-[var(--text)] shadow-[var(--shadow-sm)]"
                : "text-[var(--text-secondary)] hover:text-[var(--text)]"
            }`}
          >
            {item.label}
          </button>
        );
      })}
    </div>
  );
}