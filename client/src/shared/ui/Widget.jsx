export default function Widget({ title, subtitle, children, actions, className = "" }) {
  return (
    <div className={`rounded-[10px] border border-[var(--border)] bg-[var(--card)] ${className}`}>
      {(title || actions) && (
        <div className="flex items-center justify-between border-b border-[var(--border)] px-5 py-3.5">
          <div>
            <h3 className="font-display text-sm font-semibold text-[var(--text)]">{title}</h3>
            {subtitle && (
              <p className="mt-0.5 text-xs text-[var(--text-muted)]">{subtitle}</p>
            )}
          </div>
          {actions && <div className="flex items-center gap-2">{actions}</div>}
        </div>
      )}
      <div className="p-5">{children}</div>
    </div>
  );
}