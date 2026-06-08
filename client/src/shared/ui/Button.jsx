export default function Button({
  children,
  variant = "primary",
  size = "md",
  className = "",
  loading = false,
  disabled = false,
  icon: Icon,
  iconRight,
  ...props
}) {
  const base =
    "inline-flex items-center justify-center gap-2 font-medium rounded-md transition duration-150 cursor-pointer select-none " +
    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--brand)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--background)] " +
    "disabled:opacity-50 disabled:cursor-not-allowed disabled:pointer-events-none";

  // Color: brand is now a subtle blue→teal gradient (reserved for the primary
  // action). Hover is intentionally restrained — slight brightness + 1% scale.
  // Everything else stays grayscale (surface / border / ghost). Red is reserved
  // strictly for destructive/danger.
  const variants = {
    primary:
      "bg-[image:var(--gradient-brand)] text-white shadow-[var(--shadow-sm)] hover:brightness-105 hover:scale-[1.01] active:scale-[1] active:brightness-95",
    accent:
      "bg-[image:var(--gradient-brand)] text-white shadow-[var(--shadow-sm)] hover:brightness-105 hover:scale-[1.01] active:scale-[1] active:brightness-95",
    secondary:
      "bg-[var(--card)] text-[var(--text)] border border-[var(--border)] hover:bg-[var(--muted)] hover:border-[var(--border-hover)]",
    outline:
      "bg-transparent text-[var(--text)] border border-[var(--border)] hover:bg-[var(--muted)] hover:border-[var(--border-hover)]",
    ghost:
      "bg-transparent text-[var(--text-secondary)] hover:bg-[var(--muted)] hover:text-[var(--text)]",
    danger:
      "bg-[var(--error)] text-white hover:opacity-90",
    success:
      "bg-[var(--success)] text-white hover:opacity-90",
  };

  const sizes = {
    xs: "px-2.5 py-1.5 text-xs",
    sm: "px-3 py-1.5 text-sm",
    md: "px-4 py-2 text-sm",
    lg: "px-5 py-2.5 text-sm",
    xl: "px-6 py-3 text-base",
    icon: "p-2",
  };

  return (
    <button
      className={`${base} ${variants[variant] || variants.primary} ${sizes[size] || sizes.md} ${className}`}
      disabled={disabled || loading}
      {...props}
    >
      {loading ? (
        <span className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
      ) : Icon ? (
        <Icon size={size === "sm" || size === "xs" ? 14 : size === "lg" || size === "xl" ? 18 : 16} />
      ) : null}
      {children}
      {iconRight && !loading ? <span className="ml-0.5">{iconRight}</span> : null}
    </button>
  );
}