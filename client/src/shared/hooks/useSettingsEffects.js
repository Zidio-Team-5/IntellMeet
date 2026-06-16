import { useEffect } from "react";
import useSettingsStore from "../../core/store/settingsStore.js";

/**
 * Applies user preferences to the document so settings have REAL effect,
 * without touching any component markup or layout:
 *  - accent  -> overrides the --brand/--primary/--highlight CSS variables
 *  - reducedMotion / highContrast / largeText -> toggles <html> classes
 *    that the design system (index.css) already understands.
 */
export default function useSettingsEffects() {
  const accent = useSettingsStore((s) => s.appearance.accent);
  const { reducedMotion, highContrast, largeText } = useSettingsStore(
    (s) => s.accessibility
  );

  useEffect(() => {
    const root = document.documentElement;
    if (accent) {
      root.style.setProperty("--brand", accent);
      root.style.setProperty("--primary", accent);
      root.style.setProperty("--highlight", accent);
      // Recompute the subtle tint used by active states.
      root.style.setProperty("--brand-subtle", hexToRgba(accent, 0.14));
      root.style.setProperty(
        "--gradient-brand",
        `linear-gradient(135deg, ${accent} 0%, var(--accent) 100%)`
      );
    }
  }, [accent]);

  useEffect(() => {
    const root = document.documentElement;
    root.classList.toggle("reduce-motion", !!reducedMotion);
    root.classList.toggle("high-contrast", !!highContrast);
    root.classList.toggle("large-text", !!largeText);
  }, [reducedMotion, highContrast, largeText]);
}

function hexToRgba(hex, alpha) {
  const h = hex.replace("#", "");
  const n = parseInt(h.length === 3 ? h.replace(/(.)/g, "$1$1") : h, 16);
  const r = (n >> 16) & 255, g = (n >> 8) & 255, b = n & 255;
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}
