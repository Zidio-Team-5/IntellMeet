import { create } from "zustand";
import { persist } from "zustand/middleware";

/**
 * Single source of truth for user preferences that actually take effect.
 * Persisted locally; notification prefs are also synced to the backend
 * (user.settings) by the Settings screen so they survive across devices.
 */
const DEFAULTS = {
  appearance: {
    accent: "#3b82f6", // brand blue (matches design system); see ACCENTS below
  },
  notifications: {
    meetingReminders: true,
    taskAssignments: true,
    aiSummaries: true,
    teamActivity: false,
    emailDigest: true,
    pushNotifications: false,
  },
  accessibility: {
    reducedMotion: false,
    highContrast: false,
    largeText: false,
  },
};

const useSettingsStore = create(
  persist(
    (set) => ({
      ...DEFAULTS,
      setAccent: (accent) =>
        set((s) => ({ appearance: { ...s.appearance, accent } })),
      setNotification: (key, value) =>
        set((s) => ({ notifications: { ...s.notifications, [key]: value } })),
      setNotifications: (next) =>
        set((s) => ({ notifications: { ...s.notifications, ...next } })),
      setAccessibility: (key, value) =>
        set((s) => ({ accessibility: { ...s.accessibility, [key]: value } })),
    }),
    { name: "intellmeet-settings" }
  )
);

// Brand-aligned accent palette (replaces the old red-centric swatches).
export const ACCENTS = [
  { value: "#3b82f6", name: "Blue" },
  { value: "#14b8a6", name: "Teal" },
  { value: "#8b5cf6", name: "Violet" },
  { value: "#6366f1", name: "Indigo" },
  { value: "#f59e0b", name: "Amber" },
  { value: "#ec4899", name: "Pink" },
];

export default useSettingsStore;
