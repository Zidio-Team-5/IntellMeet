import { useState } from "react";
import { Bell, Save } from "lucide-react";
import Card from "../../shared/ui/Card.jsx";
import Button from "../../shared/ui/Button.jsx";

function Toggle({ label, description, checked, onChange }) {
  return (
    <div className="flex items-center justify-between gap-4 border-b border-[var(--border-subtle)] py-3 last:border-0">
      <div className="min-w-0">
        <p className="text-sm font-medium text-[var(--text)]">{label}</p>
        {description && <p className="mt-0.5 text-xs text-[var(--text-muted)]">{description}</p>}
      </div>
      <button
        onClick={() => onChange(!checked)}
        className="relative h-5 w-9 flex-shrink-0 rounded-full transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--brand)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--card)]"
        style={{ background: checked ? "var(--brand)" : "var(--muted)" }}
        aria-checked={checked}
        role="switch"
        aria-label={label}
      >
        <span
          className="absolute top-0.5 h-4 w-4 rounded-full bg-white shadow-sm transition-all"
          style={{ left: checked ? "calc(100% - 1.125rem)" : "0.125rem" }}
        />
      </button>
    </div>
  );
}

export default function NotificationSettings() {
  const [settings, setSettings] = useState({
    meetingReminders: true,
    taskAssignments: true,
    aiSummaries: true,
    teamActivity: false,
    emailDigest: true,
    pushNotifications: false,
  });

  const toggle = (key) => (val) => setSettings((p) => ({ ...p, [key]: val }));

  return (
    <Card>
      <div className="mb-4 flex items-center gap-2">
        <Bell size={15} className="text-[var(--text-secondary)]" />
        <h3 className="font-display text-base font-semibold text-[var(--text)]">Notification preferences</h3>
      </div>
      <Toggle label="Meeting Reminders"  description="Get notified 15 minutes before meetings" checked={settings.meetingReminders}  onChange={toggle("meetingReminders")} />
      <Toggle label="Task Assignments"   description="Notify when tasks are assigned to you"   checked={settings.taskAssignments}   onChange={toggle("taskAssignments")} />
      <Toggle label="AI Summaries"       description="Notify when meeting summaries are ready" checked={settings.aiSummaries}       onChange={toggle("aiSummaries")} />
      <Toggle label="Team Activity"      description="Updates on team member activity"         checked={settings.teamActivity}      onChange={toggle("teamActivity")} />
      <Toggle label="Email Digest"       description="Daily summary via email"                 checked={settings.emailDigest}       onChange={toggle("emailDigest")} />
      <Toggle label="Push Notifications" description="Browser push notifications"              checked={settings.pushNotifications} onChange={toggle("pushNotifications")} />
      <div className="mt-5 flex justify-end">
        <Button icon={Save}>Save preferences</Button>
      </div>
    </Card>
  );
}