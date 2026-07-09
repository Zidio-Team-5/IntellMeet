import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Check } from "lucide-react";
import Modal from "../../shared/ui/Modal.jsx";
import Input from "../../shared/ui/Input.jsx";
import Button from "../../shared/ui/Button.jsx";
import Avatar from "../../shared/ui/Avatar.jsx";
import { createTask } from "../../services/taskService.js";
import { getTeamMembers } from "../../services/teamService.js";
import { toast } from "../../core/store/toastStore.js";

export default function NewTaskModal({ isOpen, onClose }) {
  const [form, setForm] = useState({ title: "", description: "", assigneeIds: [], priority: "medium", dueDate: "" });
  const [error, setError] = useState("");
  const queryClient = useQueryClient();

  const { data } = useQuery({ queryKey: ["team"], queryFn: getTeamMembers, enabled: isOpen });
  const members = data?.members ?? data ?? [];

  const toggleAssignee = (id) =>
    setForm((p) => ({
      ...p,
      assigneeIds: p.assigneeIds.includes(id) ? p.assigneeIds.filter((x) => x !== id) : [...p.assigneeIds, id],
    }));

  const mutation = useMutation({
    mutationFn: (payload) => createTask(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tasks"] });
      toast({ type: "success", title: "Task created", message: form.assigneeIds.length ? `${form.assigneeIds.length} assignee(s) notified by email.` : "" });
      setForm({ title: "", description: "", assigneeIds: [], priority: "medium", dueDate: "" });
      onClose();
    },
    onError: (e) => setError(e?.response?.data?.message || "Couldn't create task."),
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    setError("");
    if (!form.title.trim()) { setError("Title is required."); return; }
    mutation.mutate({
      title: form.title,
      description: form.description,
      assigneeIds: form.assigneeIds,
      priority: form.priority,
      dueDate: form.dueDate || undefined,
    });
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="New task" size="md">
      {error && (
        <div className="mb-4 rounded-md border border-[var(--border)] bg-[var(--brand-subtle)] px-3 py-2.5 text-sm text-[var(--error)]">
          {error}
        </div>
      )}
      <form onSubmit={handleSubmit} className="space-y-4">
        <Input
          label="Title" value={form.title}
          onChange={(e) => setForm((p) => ({ ...p, title: e.target.value }))}
          placeholder="Draft the Q3 roadmap doc"
        />
        <div className="flex flex-col gap-1.5">
          <label className="text-sm font-medium text-[var(--text)]">Description</label>
          <textarea
            value={form.description}
            onChange={(e) => setForm((p) => ({ ...p, description: e.target.value }))}
            rows={3}
            placeholder="Optional details…"
            className="w-full resize-none rounded-md border border-[var(--border)] bg-[var(--card)] px-3 py-2 text-sm text-[var(--text)] placeholder:text-[var(--text-muted)] outline-none transition-colors hover:border-[var(--border-hover)] focus:border-[var(--brand)] focus:ring-2 focus:ring-[var(--brand)]/25"
          />
        </div>

        <div className="flex flex-col gap-1.5">
          <label className="text-sm font-medium text-[var(--text)]">
            Assignees {form.assigneeIds.length > 0 && <span className="text-[var(--text-muted)]">({form.assigneeIds.length} selected)</span>}
          </label>
          <div className="max-h-40 space-y-1 overflow-y-auto rounded-md border border-[var(--border)] p-2">
            {members.length === 0 ? (
              <p className="px-1 py-2 text-xs text-[var(--text-muted)]">No team members yet.</p>
            ) : (
              members.map((m) => {
                const id = m._id || m.id;
                const selected = form.assigneeIds.includes(id);
                return (
                  <button
                    type="button"
                    key={id}
                    onClick={() => toggleAssignee(id)}
                    className={`flex w-full items-center gap-2.5 rounded-md px-2 py-1.5 text-left text-sm transition-colors ${selected ? "bg-[var(--brand-subtle)] text-[var(--brand)]" : "text-[var(--text)] hover:bg-[var(--muted)]"}`}
                  >
                    <Avatar name={m.name} size="xs" />
                    <span className="flex-1 truncate">{m.name}</span>
                    {selected && <Check size={14} />}
                  </button>
                );
              })
            )}
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-medium text-[var(--text)]">Priority</label>
            <select
              value={form.priority}
              onChange={(e) => setForm((p) => ({ ...p, priority: e.target.value }))}
              className="h-10 w-full rounded-md border border-[var(--border)] bg-[var(--card)] px-3 text-sm text-[var(--text)] outline-none transition-colors hover:border-[var(--border-hover)] focus:border-[var(--brand)] focus:ring-2 focus:ring-[var(--brand)]/25"
            >
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
              <option value="urgent">Urgent</option>
            </select>
          </div>

          <Input
            label="Due date" type="date" value={form.dueDate}
            onChange={(e) => setForm((p) => ({ ...p, dueDate: e.target.value }))}
          />
        </div>

        <Button type="submit" className="w-full" loading={mutation.isPending}>
          Create task
        </Button>
      </form>
    </Modal>
  );
}
