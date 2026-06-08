import { motion } from "framer-motion";
import { Sparkles, Video, CheckSquare, BarChart3 } from "lucide-react";

const features = [
  { icon: Video,       label: "Real-time video meetings with live transcription", color: "var(--brand)" },
  { icon: Sparkles,    label: "AI-powered summaries and action item extraction",  color: "var(--violet)" },
  { icon: CheckSquare, label: "Smart task management synced from meetings",        color: "var(--teal)" },
  { icon: BarChart3,   label: "Team productivity analytics and insights",          color: "var(--success)" },
];

export default function AuthHero() {
  return (
    <div className="w-full max-w-md space-y-10">
      <div>
        <div className="relative mb-6 inline-flex">
          <div
            className="absolute -inset-2 rounded-xl opacity-30 blur-xl"
            style={{ background: "var(--gradient-brand)" }}
            aria-hidden="true"
          />
          <div
            className="relative flex h-12 w-12 items-center justify-center rounded-md font-display text-xl font-bold text-white"
            style={{ background: "var(--gradient-brand)" }}
          >
            I
          </div>
        </div>
        <h1 className="font-display text-3xl font-semibold leading-tight tracking-tight text-[var(--text)]">
          Where teams meet smarter.
        </h1>
        <p className="mt-4 text-base leading-relaxed text-[var(--text-secondary)]">
          IntellMeet transforms every meeting into actionable intelligence — transcripts,
          summaries, and tasks, automatically.
        </p>
      </div>

      <div className="space-y-4">
        {features.map((f, i) => {
          const Icon = f.icon;
          return (
            <motion.div
              key={f.label}
              initial={{ opacity: 0, x: -12 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.05 * i, duration: 0.25, ease: "easeOut" }}
              className="flex items-start gap-3"
            >
              <div className="mt-0.5 flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-md border border-[var(--border)] bg-[var(--muted)]">
                <Icon size={15} style={{ color: f.color }} />
              </div>
              <p className="text-sm leading-relaxed text-[var(--text-secondary)]">{f.label}</p>
            </motion.div>
          );
        })}
      </div>

      <div
        className="grid grid-cols-3 gap-4 rounded-lg border border-[var(--border)] p-4"
        style={{ background: "var(--gradient-wash), var(--card)" }}
      >
        {[
          { value: "50K+", label: "Meetings" },
          { value: "98%", label: "Accuracy" },
          { value: "4.9★", label: "Rating" },
        ].map((s) => (
          <div key={s.label} className="text-center">
            <p className="font-display text-lg font-semibold tabular-nums text-[var(--text)]">{s.value}</p>
            <p className="text-xs text-[var(--text-muted)]">{s.label}</p>
          </div>
        ))}
      </div>
    </div>
  );
}