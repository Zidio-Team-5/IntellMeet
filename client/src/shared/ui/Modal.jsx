import { useEffect, useRef } from "react";
import { X } from "lucide-react";

const SIZES = {
  sm: "max-w-sm",
  md: "max-w-lg",
  lg: "max-w-2xl",
  xl: "max-w-3xl",
};

/**
 * Standardized modal/dialog shell. Provides the overlay, panel, header with
 * close button, body, and optional footer. Consumers supply their own content
 * (forms, etc.) as children — this component owns presentation only.
 */
export default function Modal({
  isOpen,
  onClose,
  title,
  children,
  footer,
  size = "md",
  className = "",
}) {
  const panelRef = useRef(null);
  const onCloseRef = useRef(onClose);
  useEffect(() => { onCloseRef.current = onClose; }, [onClose]);

  // Focus the panel ONCE when it opens and lock body scroll. Crucially this
  // effect depends only on `isOpen` (not `onClose`) — otherwise a parent that
  // passes a fresh onClose on every render would re-run this on each keystroke
  // and yank focus out of inputs. Escape uses the ref so it's always current.
  useEffect(() => {
    if (!isOpen) return;
    const onKey = (e) => {
      if (e.key === "Escape") onCloseRef.current?.();
    };
    document.addEventListener("keydown", onKey);
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    panelRef.current?.focus();
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = prevOverflow;
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      role="dialog"
      aria-modal="true"
      aria-label={typeof title === "string" ? title : undefined}
    >
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-[6px]"
        onClick={onClose}
      />
      {/* Panel */}
      <div
        ref={panelRef}
        tabIndex={-1}
        className={`glass-panel relative w-full ${SIZES[size] || SIZES.md} animate-scale-in !rounded-[14px] outline-none ${className}`}
      >
        {title && (
          <div className="flex items-center justify-between border-b border-[var(--border)] px-5 py-3.5">
            <h2 className="font-display text-base font-semibold text-[var(--text)]">
              {title}
            </h2>
            <button
              onClick={onClose}
              aria-label="Close"
              className="rounded-md p-1.5 text-[var(--text-muted)] transition-colors hover:bg-[var(--muted)] hover:text-[var(--text)]"
            >
              <X size={16} />
            </button>
          </div>
        )}
        <div className="px-5 py-4">{children}</div>
        {footer && (
          <div className="flex justify-end gap-2 border-t border-[var(--border)] px-5 py-3.5">
            {footer}
          </div>
        )}
      </div>
    </div>
  );
}