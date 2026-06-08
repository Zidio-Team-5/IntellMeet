export default function Card({
  children,
  className = "",
  glass = false,
  hover = false,
  padding = "p-6",
  onClick,
}) {
  // Radius tightened to --radius-lg (10px). Hierarchy via border + bg, no shadow stacking.
  const base = "rounded-[10px] border border-[var(--border)] bg-[var(--card)]";
  const bg = glass ? "bg-[var(--bg-overlay)] border-[var(--border)]" : "";

  // Interactive: NO translate/lift. Background + border shift only (subtle, fast).
  const interactive =
    hover || onClick
      ? "cursor-pointer transition-colors duration-150 hover:bg-[var(--card-hover)] hover:border-[var(--border-hover)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--brand)]/40"
      : "";

  return (
    <div
      className={`${base} ${bg} ${interactive} ${padding} ${className}`}
      onClick={onClick}
      role={onClick ? "button" : undefined}
      tabIndex={onClick ? 0 : undefined}
    >
      {children}
    </div>
  );
}