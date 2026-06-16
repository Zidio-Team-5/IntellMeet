export default function Card({
  children,
  className = "",
  glass = false,
  hover = false,
  padding = "p-6",
  onClick,
}) {
  // Solid surface (default) vs. frosted glass panel. Radius/hierarchy unchanged.
  const base = glass
    ? "glass-panel"
    : "rounded-[10px] border border-[var(--border)] bg-[var(--card)]";

  // Interactive: subtle. Glass cards get a gentle lift; solid cards keep the
  // original border/background shift (no layout change either way).
  const interactiveGlass =
    "cursor-pointer glass-hover focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--brand)]/40";
  const interactiveSolid =
    "cursor-pointer transition-colors duration-150 hover:bg-[var(--card-hover)] hover:border-[var(--border-hover)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--brand)]/40";
  const interactive =
    hover || onClick ? (glass ? interactiveGlass : interactiveSolid) : "";

  return (
    <div
      className={`${base} ${interactive} ${padding} ${className}`}
      onClick={onClick}
      role={onClick ? "button" : undefined}
      tabIndex={onClick ? 0 : undefined}
    >
      {children}
    </div>
  );
}
