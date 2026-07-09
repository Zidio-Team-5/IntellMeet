import { useState } from "react";
import { Save } from "lucide-react";
import Card from "../../shared/ui/Card.jsx";
import Button from "../../shared/ui/Button.jsx";
import Input from "../../shared/ui/Input.jsx";
import useAuthStore from "../../core/store/authStore.js";
import useUpdateProfile from "../../shared/hooks/useUpdateProfile.js";

export default function AccountSettings() {
  const { user } = useAuthStore();
  const updateProfile = useUpdateProfile();
  const [form, setForm] = useState({
    name: user?.name || "",
    jobTitle: user?.jobTitle || "",
    department: user?.department || "",
    phone: user?.phone || "",
    location: user?.location || "",
    timezone: user?.timezone || "UTC",
    bio: user?.bio || "",
    skills: (user?.skills || []).join(", "),
    linkedin: user?.socialLinks?.linkedin || "",
    github: user?.socialLinks?.github || "",
    twitter: user?.socialLinks?.twitter || "",
    website: user?.socialLinks?.website || "",
  });

  const handleChange = (e) =>
    setForm((p) => ({ ...p, [e.target.name]: e.target.value }));

  const handleSave = (e) => {
    e.preventDefault();
    const { linkedin, github, twitter, website, skills, ...rest } = form;
    const payload = {
      ...rest,
      skills: skills.split(",").map((s) => s.trim()).filter(Boolean),
      socialLinks: { linkedin, github, twitter, website },
    };
    updateProfile.mutate(payload);
  };

  return (
    <Card>
      <h3 className="mb-5 font-display text-base font-semibold text-[var(--text)]">Account information</h3>
      <form onSubmit={handleSave} className="space-y-4">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <Input label="Full Name" name="name" value={form.name} onChange={handleChange} />
          <Input label="Job title" name="jobTitle" value={form.jobTitle} onChange={handleChange} placeholder="e.g. Senior Engineer" />
          <Input label="Department" name="department" value={form.department} onChange={handleChange} placeholder="e.g. Engineering" />
          <Input label="Phone" name="phone" value={form.phone} onChange={handleChange} placeholder="+1 555 123 4567" />
          <Input label="Location" name="location" value={form.location} onChange={handleChange} placeholder="e.g. Bengaluru, India" />
          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-medium text-[var(--text)]">Timezone</label>
            <select
              name="timezone" value={form.timezone} onChange={handleChange}
              className="w-full rounded-md border border-[var(--border)] bg-[var(--card)] px-3 py-2 text-sm text-[var(--text)] outline-none transition-colors hover:border-[var(--border-hover)] focus:border-[var(--brand)] focus:ring-2 focus:ring-[var(--brand)]/25"
            >
              <option value="UTC">UTC</option>
              <option value="Asia/Kolkata">Asia/Kolkata (IST)</option>
              <option value="America/New_York">America/New_York (EST)</option>
              <option value="America/Los_Angeles">America/Los_Angeles (PST)</option>
              <option value="Europe/London">Europe/London (GMT)</option>
              <option value="Europe/Berlin">Europe/Berlin (CET)</option>
            </select>
          </div>
        </div>

        <div className="flex flex-col gap-1.5">
          <label className="text-sm font-medium text-[var(--text)]">Bio</label>
          <textarea
            name="bio" value={form.bio} onChange={handleChange} rows={3}
            placeholder="A short bio your teammates will see…"
            className="w-full resize-none rounded-md border border-[var(--border)] bg-[var(--card)] px-3 py-2 text-sm text-[var(--text)] placeholder:text-[var(--text-muted)] outline-none transition-colors hover:border-[var(--border-hover)] focus:border-[var(--brand)] focus:ring-2 focus:ring-[var(--brand)]/25"
          />
        </div>

        <Input label="Skills" name="skills" value={form.skills} onChange={handleChange} placeholder="React, Node.js, Figma (comma-separated)" />

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <Input label="LinkedIn" name="linkedin" value={form.linkedin} onChange={handleChange} placeholder="https://linkedin.com/in/…" />
          <Input label="GitHub" name="github" value={form.github} onChange={handleChange} placeholder="https://github.com/…" />
          <Input label="Twitter / X" name="twitter" value={form.twitter} onChange={handleChange} placeholder="https://x.com/…" />
          <Input label="Website" name="website" value={form.website} onChange={handleChange} placeholder="https://…" />
        </div>

        {updateProfile.isSuccess && (
          <p className="text-sm text-[var(--success)]">Profile updated successfully.</p>
        )}
        {updateProfile.isError && (
          <p className="text-sm text-[var(--error)]">Failed to update profile.</p>
        )}

        <div className="flex justify-end pt-2">
          <Button type="submit" icon={Save} loading={updateProfile.isPending}>Save changes</Button>
        </div>
      </form>
    </Card>
  );
}
