import { initials, avatarColor } from "../utils/formatters.js";

const SIZES = {
  xs: "h-6 w-6 text-[10px]",
  sm: "h-7 w-7 text-[11px]",
  md: "h-9 w-9 text-xs",
  lg: "h-12 w-12 text-sm",
  xl: "h-16 w-16 text-base",
};

const DOT = {
  xs: "h-2 w-2",
  sm: "h-2 w-2",
  md: "h-2.5 w-2.5",
  lg: "h-3 w-3",
  xl: "h-3.5 w-3.5",
};

/**
 * Presentational avatar. Reuses the existing initials/avatarColor helpers so
 * identity coloring is consistent with the rest of the app.
 */
export default function Avatar({
  name = "User",
  src,
  size = "md",
  showStatus = false,
  online = false,
  className = "",
}) {
  const sizeCls = SIZES[size] || SIZES.md;

  return (
    <span className={`relative inline-flex flex-shrink-0 ${className}`}>
      {src ? (
        <img
          src={src}
          alt={name}
          className={`${sizeCls} rounded-md object-cover`}
        />
      ) : (
        <span
          className={`${sizeCls} flex items-center justify-center rounded-md font-bold text-white`}
          style={{ background: avatarColor(name) }}
          aria-hidden="true"
        >
          {initials(name)}
        </span>
      )}
      {showStatus && (
        <span
          className={`absolute -bottom-0.5 -right-0.5 rounded-full border-2 border-[var(--bg-base)] ${DOT[size] || DOT.md}`}
          style={{ background: online ? "var(--success)" : "var(--text-muted)" }}
          aria-label={online ? "Online" : "Offline"}
        />
      )}
    </span>
  );
}