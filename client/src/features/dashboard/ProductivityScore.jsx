import Card from "../../shared/ui/Card.jsx";
import useAuthStore from "../../core/store/authStore.js";

export default function ProductivityScore({ score = 82 }) {
  const { user } = useAuthStore();
  const circumference = 2 * Math.PI * 36;
  const offset = circumference - (score / 100) * circumference;

  return (
    <Card>
      <h3 className="font-display text-sm font-semibold text-[var(--text)]">Productivity score</h3>
      <div className="mt-4 flex items-center gap-5">
        <div className="relative flex-shrink-0">
          <svg width="88" height="88" viewBox="0 0 88 88">
            <circle cx="44" cy="44" r="36" fill="none" stroke="var(--muted)" strokeWidth="8" />
            <circle
              cx="44" cy="44" r="36" fill="none"
              stroke="var(--brand)" strokeWidth="8"
              strokeLinecap="round"
              strokeDasharray={circumference}
              strokeDashoffset={offset}
              transform="rotate(-90 44 44)"
              style={{ transition: "stroke-dashoffset 0.8s ease" }}
            />
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className="font-display text-xl font-semibold tabular-nums text-[var(--text)]">{score}</span>
            <span className="text-[10px] text-[var(--text-muted)]">/ 100</span>
          </div>
        </div>
        <div>
          <p className="text-sm font-semibold text-[var(--text)]">
            {user?.name?.split(" ")[0] || "Your"} score
          </p>
          <p className="mt-1 text-xs leading-relaxed text-[var(--text-muted)]">
            Based on meetings attended, tasks completed, and AI action item resolution.
          </p>
          <div className="mt-2 flex items-center gap-1">
            <span className="text-xs font-medium text-[var(--success)]">↑ 6pts</span>
            <span className="text-xs text-[var(--text-muted)]">this week</span>
          </div>
        </div>
      </div>
    </Card>
  );
}