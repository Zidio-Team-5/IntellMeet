import { Camera } from "lucide-react";
import Card from "../../shared/ui/Card.jsx";
import Avatar from "../../shared/ui/Avatar.jsx";
import Badge from "../../shared/ui/Badge.jsx";
import useAuthStore from "../../core/store/authStore.js";

export default function ProfileCard() {
  const { user } = useAuthStore();

  return (
    <Card className="text-center">
      <div className="relative mx-auto mb-4 w-fit">
        <Avatar name={user?.name || "U"} size="xl" />
        <button
          aria-label="Change photo"
          className="absolute -bottom-1 -right-1 flex h-7 w-7 items-center justify-center rounded-full border-2 border-[var(--card)] bg-[var(--muted)] text-[var(--text-secondary)] transition-colors hover:bg-[var(--muted-hover)] hover:text-[var(--text)]"
        >
          <Camera size={12} />
        </button>
      </div>
      <h2 className="font-display text-lg font-semibold text-[var(--text)]">{user?.name || "User"}</h2>
      <p className="mt-1 text-sm text-[var(--text-muted)]">{user?.email}</p>
      {user?.role && (
        <div className="mt-2 flex justify-center">
          <Badge variant="neutral">{user.role}</Badge>
        </div>
      )}
      <div className="mt-5 grid grid-cols-3 gap-3 border-t border-[var(--border)] pt-5">
        {[
          { label: "Meetings", value: user?.stats?.meetings ?? 48 },
          { label: "Tasks",    value: user?.stats?.tasks ?? 124 },
          { label: "Score",    value: user?.stats?.score ?? 91 },
        ].map(({ label, value }) => (
          <div key={label}>
            <p className="font-display text-lg font-semibold tabular-nums text-[var(--text)]">{value}</p>
            <p className="text-xs text-[var(--text-muted)]">{label}</p>
          </div>
        ))}
      </div>
    </Card>
  );
}