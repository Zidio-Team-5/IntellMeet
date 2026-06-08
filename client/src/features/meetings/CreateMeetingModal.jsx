import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import Button from "../../shared/ui/Button.jsx";
import Input from "../../shared/ui/Input.jsx";
import Modal from "../../shared/ui/Modal.jsx";
import { createMeeting } from "../../services/meetingService.js";

export default function CreateMeetingModal({ isOpen, onClose }) {
  const queryClient = useQueryClient();
  const [form, setForm] = useState({ title: "", description: "", date: "", time: "", duration: 60 });

  const mutation = useMutation({
    mutationFn: createMeeting,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["meetings"] });
      onClose();
      setForm({ title: "", description: "", date: "", time: "", duration: 60 });
    },
  });

  const handleChange = (e) =>
    setForm((p) => ({ ...p, [e.target.name]: e.target.value }));

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.title.trim()) return;
    const scheduledAt = form.date && form.time
      ? new Date(`${form.date}T${form.time}`).toISOString()
      : new Date().toISOString();
    mutation.mutate({ ...form, scheduledAt });
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Create meeting" size="md">
      <form onSubmit={handleSubmit} className="space-y-4">
        <Input label="Meeting Title" name="title" value={form.title}
          placeholder="e.g. Sprint Planning Q3" required onChange={handleChange} />
        <div>
          <label className="mb-1.5 block text-sm font-medium text-[var(--text)]">Description</label>
          <textarea
            name="description" value={form.description} onChange={handleChange}
            placeholder="What's this meeting about?"
            rows={3}
            className="w-full resize-none rounded-md border border-[var(--border)] bg-[var(--card)] px-3 py-2 text-sm text-[var(--text)] placeholder:text-[var(--text-muted)] outline-none transition-colors hover:border-[var(--border-hover)] focus:border-[var(--brand)] focus:ring-2 focus:ring-[var(--brand)]/25"
          />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <Input label="Date" name="date" type="date" value={form.date} onChange={handleChange} />
          <Input label="Time" name="time" type="time" value={form.time} onChange={handleChange} />
        </div>
        <Input label="Duration (minutes)" name="duration" type="number"
          value={form.duration} min={15} max={480} step={15} onChange={handleChange} />

        {mutation.isError && (
          <p className="text-sm text-[var(--error)]">
            {mutation.error?.response?.data?.message || "Failed to create meeting."}
          </p>
        )}

        <div className="flex justify-end gap-2 pt-2">
          <Button variant="outline" type="button" onClick={onClose}>Cancel</Button>
          <Button type="submit" loading={mutation.isPending}>Create meeting</Button>
        </div>
      </form>
    </Modal>
  );
}