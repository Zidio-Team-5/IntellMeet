import DashboardLayout from "../shared/layouts/DashboardLayout.jsx";
import PageHeader from "../shared/ui/PageHeader.jsx";
import ProfileCard from "../features/profile/ProfileCard.jsx";
import ProfileStats from "../features/profile/ProfileStats.jsx";
import AccountSettings from "../features/profile/AccountSettings.jsx";

export default function Profile() {
  return (
    <DashboardLayout>
      <PageHeader
        title="Profile"
        subtitle="Manage your account information and preferences."
      />

      <div className="grid grid-cols-1 gap-5 lg:grid-cols-3">
        <div className="space-y-5">
          <ProfileCard />
        </div>
        <div className="space-y-5 lg:col-span-2">
          <ProfileStats />
          <AccountSettings />
        </div>
      </div>
    </DashboardLayout>
  );
}