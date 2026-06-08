export default function EmptyState({ title, description, icon: Icon, action, iconBg }) {
  return (
    <div className="flex flex-col items-center justify-center px-6 py-16 text-center">
      {Icon && (
        <div
          className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-md border border-[var(--border)]"
          style={{ background: iconBg || "var(--muted)" }}
        >
          <Icon size={20} style={{ color: "var(--text-secondary)" }} />
        </div>
      )}
      <h3 className="font-display text-sm font-semibold text-[var(--text)]">{title}</h3>
      {description && (
        <p className="mt-1.5 max-w-sm text-sm text-[var(--text-muted)]">{description}</p>
      )}
      {action && <div className="mt-5">{action}</div>}
    </div>
  );
}