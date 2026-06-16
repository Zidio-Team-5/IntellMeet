import { useEffect, useState } from "react";
import { X, Bell, CheckCircle2, AlertTriangle, Info, Sparkles } from "lucide-react";
import useToastStore from "../../core/store/toastStore.js";

const ICON = { info: Info, success: CheckCircle2, warning: AlertTriangle, meeting: Bell, task: Bell, ai: Sparkles };
const ACCENT = {
  info: "var(--brand)", success: "var(--success)", warning: "var(--warning)",
  meeting: "var(--brand)", task: "var(--teal)", ai: "var(--violet)",
};

function ToastItem({ t, onDismiss }) {
  const [shown, setShown] = useState(false);
  useEffect(() => { const r = requestAnimationFrame(() => setShown(true)); return () => cancelAnimationFrame(r); }, []);
  const Icon = ICON[t.type] || Info;
  return (
    <div
      role="status"
      className={`glass-thin pointer-events-auto flex w-80 items-start gap-3 rounded-[12px] p-3.5 transition-all duration-200 ${
        shown ? "translate-x-0 opacity-100" : "translate-x-3 opacity-0"
      }`}
    >
      <div className="flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-md" style={{ background: "var(--muted)", color: ACCENT[t.type] || "var(--brand)" }}>
        <Icon size={15} />
      </div>
      <div className="min-w-0 flex-1">
        {t.title && <p className="text-sm font-semibold text-[var(--text)]">{t.title}</p>}
        {t.message && <p className="mt-0.5 text-xs text-[var(--text-secondary)]">{t.message}</p>}
      </div>
      <button onClick={() => onDismiss(t.id)} aria-label="Dismiss" className="rounded-md p-1 text-[var(--text-muted)] transition-colors hover:bg-[var(--muted)] hover:text-[var(--text)]">
        <X size={13} />
      </button>
    </div>
  );
}

export default function Toaster() {
  const { toasts, dismiss } = useToastStore();
  if (!toasts.length) return null;
  return (
    <div className="pointer-events-none fixed right-4 top-4 z-[100] flex flex-col gap-2.5">
      {toasts.map((t) => <ToastItem key={t.id} t={t} onDismiss={dismiss} />)}
    </div>
  );
}
