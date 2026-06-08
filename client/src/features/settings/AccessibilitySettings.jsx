import { useState } from "react";
import Card from "../../shared/ui/Card.jsx";
import Button from "../../shared/ui/Button.jsx";

export default function AccessibilitySettings() {
  const [settings, setSettings] = useState({
    reducedMotion: false,
    highContrast: false,
    largeText: false,
    screenReader: false,
    keyboardNav: true,
  });

  const toggle = (key) => setSettings((p) => ({ ...p, [key]: !p[key] }));

  return (
    <Card>
      <h3 className="mb-4 font-display text-base font-semibold text-[var(--text)]">Accessibility</h3>
      {[
        { key: "reducedMotion", label: "Reduce Motion",         desc: "Minimize animations and transitions" },
        { key: "highContrast",  label: "High Contrast Mode",    desc: "Increase color contrast ratios" },
        { key: "largeText",     label: "Large Text",            desc: "Increase font sizes throughout the app" },
        { key: "keyboardNav",   label: "Enhanced Keyboard Nav", desc: "Visible focus indicators for keyboard users" },
      ].map(({ key, label, desc }) => (
        <div key={key} className="flex items-center justify-between gap-4 border-b border-[var(--border-subtle)] py-3 last:border-0">
          <div className="min-w-0">
            <p className="text-sm font-medium text-[var(--text)]">{label}</p>
            <p className="mt-0.5 text-xs text-[var(--text-muted)]">{desc}</p>
          </div>
          <button
            onClick={() => toggle(key)}
            className="relative h-5 w-9 flex-shrink-0 rounded-full transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--brand)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--card)]"
            style={{ background: settings[key] ? "var(--brand)" : "var(--muted)" }}
            aria-checked={settings[key]}
            role="switch"
            aria-label={label}
          >
            <span
              className="absolute top-0.5 h-4 w-4 rounded-full bg-white shadow-sm transition-all"
              style={{ left: settings[key] ? "calc(100% - 1.125rem)" : "0.125rem" }}
            />
          </button>
        </div>
      ))}
      <div className="mt-5 flex justify-end">
        <Button>Apply settings</Button>
      </div>
    </Card>
  );
}