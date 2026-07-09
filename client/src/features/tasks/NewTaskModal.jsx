import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import Modal from "../../shared/ui/Modal.jsx";
import Input from "../../shared/ui/Input.jsx";
import Button from "../../shared/ui/Button.jsx";
import { createTask } from "../../services/taskService.js";
import { getTeamMembers } from "../../services/teamService.js";
import { toast } from "../../core/store/toastStore.js";

export default function NewTaskModal({ isOpen, onClose }) {
  const [form, setForm] = useState({ title: "", description: "", assigneeId: "", priority: "medium", dueDate: "" });
  const [error, setError] = useState("");
  const queryClient = useQueryClient();

  const { data } = useQuery({ queryKey: ["team"], queryFn: getTeamMembers, enabled: isOpen });
  const members = data?.members ?? data ?? [];

  const mutation = useMutation({
    mutationFn: (payload) => createTask(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tasks"] });
      toast({ type: "success", title: "Task created", message: form.assigneeId ? "Assignee has been notified by email." : "" });
      setForm({ title: "", description: "", assigneeId: "", priority: "medium", dueDate: "" });
      onClose();
    },
    onError: (e) => setError(e?.response?.data?.message || "Couldn't create task."),
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    setError("");
    if (!form.title.trim()) { setError("Title is required."); return; }
    const assignee = members.find((m) => (m._id || m.id) === form.assigneeId);
    mutation.mutate({
      title: form.title,
      description: form.description,
      assignee: assignee?.name || "",
      assigneeId: form.assigneeId || undefined,
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

        <div className="grid grid-cols-2 gap-3">
          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-medium text-[var(--text)]">Assignee</label>
            <select
              value={form.assigneeId}
              onChange={(e) => setForm((p) => ({ ...p, assigneeId: e.target.value }))}
              className="h-10 w-full rounded-md border border-[var(--border)] bg-[var(--card)] px-3 text-sm text-[var(--text)] outline-none transition-colors hover:border-[var(--border-hover)] focus:border-[var(--brand)] focus:ring-2 focus:ring-[var(--brand)]/25"
            >
              <option value="">Unassigned</option>
              {members.map((m) => (
                <option key={m._id || m.id} value={m._id || m.id}>{m.name}</option>
              ))}
            </select>
          </div>

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
        </div>

        <Input
          label="Due date" type="date" value={form.dueDate}
          onChange={(e) => setForm((p) => ({ ...p, dueDate: e.target.value }))}
        />

        <Button type="submit" className="w-full" loading={mutation.isPending}>
          Create task
        </Button>
      </form>
    </Modal>
  );
}
