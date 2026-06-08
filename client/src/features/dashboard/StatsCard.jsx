import Card from "../../shared/ui/Card.jsx";
import { TrendingUp, TrendingDown } from "lucide-react";

// Subtle AI-inspired accent rotation (blue → teal → violet → green).
// Derived from the existing `index` so every stat row picks up restrained
// color automatically; `color` still overrides when a caller needs a specific
// accent. Visual only — no layout/logic change.
const ACCENTS = ["var(--brand)", "var(--teal)", "var(--violet)", "var(--success)"];

export default function StatsCard({ title, value, change, icon: Icon, color, index = 0 }) {
  const isPositive = change && !change.startsWith("-");
  const stagger = Math.min(index + 1, 5);
  const accent = color || ACCENTS[index % ACCENTS.length];

  return (
    <Card padding="p-4" className={`animate-fade-in animate-stagger-${stagger}`}>
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="text-[11px] font-medium uppercase tracking-wider text-[var(--text-muted)]">
            {title}
          </p>
          <p className="mt-2 font-display text-2xl font-semibold tabular-nums text-[var(--text)]">
            {value ?? "—"}
          </p>
          {change && (
            <div className="mt-1.5 flex items-center gap-1">
              {isPositive ? (
                <TrendingUp size={12} className="text-[var(--success)]" />
              ) : (
                <TrendingDown size={12} className="text-[var(--error)]" />
              )}
              <span
                className="text-xs font-medium tabular-nums"
                style={{ color: isPositive ? "var(--success)" : "var(--error)" }}
              >
                {change}
              </span>
              <span className="text-xs text-[var(--text-muted)]">vs last month</span>
            </div>
          )}
        </div>
        {Icon && (
          <div
            className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-md border border-[var(--border)]"
            style={{
              background: `color-mix(in srgb, ${accent} 12%, transparent)`,
              borderColor: `color-mix(in srgb, ${accent} 28%, var(--border))`,
            }}
          >
            <Icon size={16} style={{ color: accent }} />
          </div>
        )}
      </div>
    </Card>
  );
}