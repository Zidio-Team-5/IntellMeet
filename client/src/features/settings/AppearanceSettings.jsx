import { Sun, Moon, Monitor, Check } from "lucide-react";
import Card from "../../shared/ui/Card.jsx";
import { useTheme } from "../../theme/ThemeContext.jsx";
import useSettingsStore, { ACCENTS } from "../../core/store/settingsStore.js";

const THEMES = [
  { value: "light",  label: "Light",  icon: Sun },
  { value: "dark",   label: "Dark",   icon: Moon },
  { value: "system", label: "System", icon: Monitor },
];

export default function AppearanceSettings() {
  const { mode, setMode } = useTheme();
  const accent = useSettingsStore((s) => s.appearance.accent);
  const setAccent = useSettingsStore((s) => s.setAccent);

  return (
    <Card>
      <h3 className="mb-5 font-display text-base font-semibold text-[var(--text)]">Appearance</h3>

      <div className="mb-6">
        <p className="mb-3 text-sm font-medium text-[var(--text)]">Theme</p>
        <div className="grid grid-cols-3 gap-3">
          {THEMES.map(({ value, label, icon: Icon }) => {
            const active = mode === value;
            return (
              <button
                key={value}
                onClick={() => setMode(value)}
                aria-pressed={active}
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
          {ACCENTS.map(({ value, name }) => {
            const active = accent === value;
            return (
              <button
                key={value}
                onClick={() => setAccent(value)}
                className="flex h-7 w-7 items-center justify-center rounded-full border-2 border-[var(--card)] outline-none transition-shadow focus-visible:outline-2 focus-visible:outline-offset-2 hover:ring-2 hover:ring-[var(--border-hover)]"
                style={{ background: value, outlineColor: value, boxShadow: active ? `0 0 0 2px var(--card), 0 0 0 4px ${value}` : undefined }}
                title={name}
                aria-label={`Accent ${name}`}
                aria-pressed={active}
              >
                {active && <Check size={13} className="text-white" />}
              </button>
            );
          })}
        </div>
      </div>
    </Card>
  );
}
