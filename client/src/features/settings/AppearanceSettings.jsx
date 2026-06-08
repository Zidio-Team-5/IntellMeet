import { Sun, Moon, Monitor } from "lucide-react";
import Card from "../../shared/ui/Card.jsx";
import { useTheme } from "../../theme/ThemeContext.jsx";

const THEMES = [
  { value: "light",  label: "Light",  icon: Sun },
  { value: "dark",   label: "Dark",   icon: Moon },
  { value: "system", label: "System", icon: Monitor },
];

const ACCENT_COLORS = ["#e63946", "#457b9d", "#2a9d8f", "#6d6875", "#e9c46a", "#f4a261"];

export default function AppearanceSettings() {
  const { theme, setTheme } = useTheme();

  return (
    <Card>
      <h3 className="mb-5 font-display text-base font-semibold text-[var(--text)]">Appearance</h3>

      <div className="mb-6">
        <p className="mb-3 text-sm font-medium text-[var(--text)]">Theme</p>
        <div className="grid grid-cols-3 gap-3">
          {THEMES.map(({ value, label, icon: Icon }) => {
            const active = theme === value;
            return (
              <button
                key={value}
                onClick={() => value !== "system" && setTheme(value)}
                className={`flex flex-col items-center gap-2 rounded-md border p-4 transition-colors ${
                  active
                    ? "border-[var(--brand)] bg-[var(--brand-subtle)]"
                    : "border-[var(--border)] hover:border-[var(--border-hover)] hover:bg-[var(--muted)]"
                }`}
              >
                <Icon size={18} className={active ? "text-[var(--brand)]" : "text-[var(--text-secondary)]"} />
                <span className="text-xs font-medium text-[var(--text)]">{label}</span>
              </button>
            );
          })}
        </div>
      </div>

      <div>
        <p className="mb-3 text-sm font-medium text-[var(--text)]">Accent color</p>
        <div className="flex flex-wrap gap-2">
          {ACCENT_COLORS.map((color) => (
            <button
              key={color}
              className="h-7 w-7 rounded-full border-2 border-[var(--card)] outline-none transition-shadow focus-visible:outline-2 focus-visible:outline-offset-2 hover:ring-2 hover:ring-[var(--border-hover)]"
              style={{ background: color, outlineColor: color }}
              title={color}
              aria-label={`Accent ${color}`}
            />
          ))}
        </div>
      </div>
    </Card>
  );
}