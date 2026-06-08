export const USER_ROLES = {
  ADMIN: "admin",
  MEMBER: "member",
};

export const TASK_STATUS = {
  TODO: "todo",
  IN_PROGRESS: "in_progress",
  COMPLETED: "completed",
};

export const MEETING_STATUS = {
  UPCOMING: "upcoming",
  LIVE: "live",
  COMPLETED: "completed",
  CANCELLED: "cancelled",
};

export const NOTIFICATION_TYPES = {
  INFO: "info",
  SUCCESS: "success",
  WARNING: "warning",
  ERROR: "error",
  MEETING: "meeting",
  TASK: "task",
  AI: "ai",
};

export const STORAGE_KEYS = {
  TOKEN: "token",
  USER: "intellmeet-auth",
  THEME: "intellmeet-theme",
};

export const PRIORITY = {
  LOW: "low",
  MEDIUM: "medium",
  HIGH: "high",
  URGENT: "urgent",
};

// Status/priority chip styles. Dark-aware (subtle tinted fills on dark),
// minimal color usage. Brand red is reserved for urgent / live states.
export const PRIORITY_COLORS = {
  low: "text-slate-600 bg-slate-100 dark:text-slate-300 dark:bg-slate-700/30",
  medium: "text-amber-700 bg-amber-100 dark:text-amber-300 dark:bg-amber-500/15",
  high: "text-orange-700 bg-orange-100 dark:text-orange-300 dark:bg-orange-500/15",
  urgent: "text-red-700 bg-red-100 dark:text-red-300 dark:bg-red-500/15",
};

export const STATUS_COLORS = {
  upcoming: "text-slate-600 bg-slate-100 dark:text-slate-300 dark:bg-slate-700/30",
  live: "text-red-700 bg-red-100 dark:text-red-300 dark:bg-red-500/15",
  completed: "text-emerald-700 bg-emerald-100 dark:text-emerald-300 dark:bg-emerald-500/15",
  cancelled: "text-slate-500 bg-slate-100 dark:text-slate-400 dark:bg-slate-700/30",
};