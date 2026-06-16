import NotificationCenter from "../features/notifications/NotificationCenter";
import Card from "../shared/ui/Card";

export default function Notifications() {
  return (
    <div className="space-y-6">
      <Card glass>
        <div className="p-6">
          <h1 className="text-3xl font-bold">
            Notifications
          </h1>

          <p className="mt-2 text-[var(--text-secondary)]">
            Stay updated with meetings, tasks, AI summaries,
            and team activities.
          </p>
        </div>
      </Card>

      <NotificationCenter />
    </div>
  );
}