import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Mail, User } from "lucide-react";
import Modal from "../../shared/ui/Modal.jsx";
import Input from "../../shared/ui/Input.jsx";
import Button from "../../shared/ui/Button.jsx";
import { addTeamMember } from "../../services/teamService.js";
import { toast } from "../../core/store/toastStore.js";

export default function AddMemberModal({ isOpen, onClose }) {
  const [form, setForm] = useState({ name: "", email: "", role: "member" });
  const [error, setError] = useState("");
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: addTeamMember,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["team"] });
      toast({ type: "success", title: "Invite sent", message: `${form.name} will receive an email to finish setup.` });
      setForm({ name: "", email: "", role: "member" });
      onClose();
    },
    onError: (e) => setError(e?.response?.data?.message || "Couldn't add member."),
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    setError("");
    if (!form.name.trim() || !form.email.trim()) { setError("Name and email are required."); return; }
    mutation.mutate(form);
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Add team member" size="sm">
      {error && (
        <div className="mb-4 rounded-md border border-[var(--border)] bg-[var(--brand-subtle)] px-3 py-2.5 text-sm text-[var(--error)]">
          {error}
        </div>
      )}
      <form onSubmit={handleSubmit} className="space-y-4">
        <Input
          label="Full name" icon={User} value={form.name}
          onChange={(e) => setForm((p) => ({ ...p, name: e.target.value }))}
          placeholder="Jane Smith"
        />
        <Input
          label="Email" type="email" icon={Mail} value={form.email}
          onChange={(e) => setForm((p) => ({ ...p, email: e.target.value }))}
          placeholder="jane@company.com"
        />
        <div className="flex flex-col gap-1.5">
          <label className="text-sm font-medium text-[var(--text)]">Role</label>
          <select
            value={form.role}
            onChange={(e) => setForm((p) => ({ ...p, role: e.target.value }))}
            className="h-10 w-full rounded-md border border-[var(--border)] bg-[var(--card)] px-3 text-sm text-[var(--text)] outline-none transition-colors hover:border-[var(--border-hover)] focus:border-[var(--brand)] focus:ring-2 focus:ring-[var(--brand)]/25"
          >
            <option value="member">Member</option>
            <option value="admin">Admin</option>
          </select>
        </div>
        <p className="text-xs text-[var(--text-muted)]">
          They'll get an email with a verification code to finish setting up their account.
        </p>
        <Button type="submit" className="w-full" loading={mutation.isPending}>
          Send invite
        </Button>
      </form>
    </Modal>
  );
}
