import DashboardLayout from "../shared/layouts/DashboardLayout.jsx";
import PageHeader from "../shared/ui/PageHeader.jsx";
import NotificationSettings from "../features/settings/NotificationSettings.jsx";
import AppearanceSettings from "../features/settings/AppearanceSettings.jsx";
import AccessibilitySettings from "../features/settings/AccessibilitySettings.jsx";
import IntegrationsSettings from "../features/settings/IntegrationsSettings.jsx";

export default function Settings() {
  return (
    <DashboardLayout>
      <PageHeader
        title="Settings"
        subtitle="Manage your preferences, notifications and appearance."
      />

      <div className="mx-auto max-w-3xl space-y-5">
        <AppearanceSettings />
        <NotificationSettings />
        <AccessibilitySettings />
        <IntegrationsSettings />
      </div>
    </DashboardLayout>
  );
}