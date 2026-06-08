const VARIANTS = {
  neutral:
    "border border-[var(--border)] bg-[var(--muted)] text-[var(--text-secondary)]",
  brand: "bg-[var(--brand-subtle)] text-[var(--brand)]",
  success:
    "bg-emerald-100 text-emerald-700 dark:bg-emerald-500/15 dark:text-emerald-300",
  warning:
    "bg-amber-100 text-amber-700 dark:bg-amber-500/15 dark:text-amber-300",
  danger: "bg-red-100 text-red-700 dark:bg-red-500/15 dark:text-red-300",
  info: "bg-slate-100 text-slate-600 dark:bg-slate-700/30 dark:text-slate-300",
  outline: "border border-[var(--border)] text-[var(--text-secondary)]",
};

const DOT_COLOR = {
  brand: "var(--brand)",
  success: "var(--success)",
  warning: "var(--warning)",
  danger: "var(--error)",
  info: "var(--text-muted)",
  neutral: "var(--text-muted)",
  outline: "var(--text-muted)",
};

/**
 * Status / priority chip. Pass a `variant` for presets, or a `className`
 * (e.g. STATUS_COLORS[status] from constants) to override entirely.
 */
export default function Badge({
  children,
  variant = "neutral",
  dot = false,
  className,
  ...props
}) {
  const base =
    "inline-flex items-center gap-1.5 rounded-full px-2 py-0.5 text-[11px] font-medium capitalize whitespace-nowrap";
  const variantCls = className ?? VARIANTS[variant] ?? VARIANTS.neutral;

  return (
    <span className={`${base} ${variantCls}`} {...props}>
      {dot && (
        <span
          className="h-1.5 w-1.5 flex-shrink-0 rounded-full"
          style={{ background: DOT_COLOR[variant] || "currentColor" }}
        />
      )}
      {children}
    </span>
  );
}