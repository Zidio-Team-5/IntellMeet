import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Link as LinkIcon, Copy, Check, ArrowRight } from "lucide-react";
import { useNavigate } from "react-router-dom";
import Button from "../../shared/ui/Button.jsx";
import Input from "../../shared/ui/Input.jsx";
import Modal from "../../shared/ui/Modal.jsx";
import { createMeeting, updateMeeting } from "../../services/meetingService.js";
import { toast } from "../../core/store/toastStore.js";

const EMPTY = { title: "", description: "", date: "", time: "", duration: 60, invites: "" };

const buildShareUrl = (meeting) => {
  const id = meeting?.meetingId || meeting?.roomId || meeting?._id || meeting?.id;
  if (typeof window !== "undefined" && id) return `${window.location.origin}/meeting/${id}`;
  return meeting?.shareUrl || "";
};

// Split an ISO datetime into the date + time fields the form uses.
const splitDateTime = (iso) => {
  if (!iso) return { date: "", time: "" };
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return { date: "", time: "" };
  const pad = (n) => String(n).padStart(2, "0");
  return {
    date: `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`,
    time: `${pad(d.getHours())}:${pad(d.getMinutes())}`,
  };
};

/**
 * Create OR edit a meeting. Pass an `meeting` prop to enter edit mode (used for
 * upcoming meetings by their host). Create mode shows the post-create share
 * panel; edit mode simply saves and closes.
 */
export default function CreateMeetingModal({ isOpen, onClose, meeting: editMeeting = null }) {
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const isEdit = !!editMeeting;

  // Lazy initial state — prefilled from the meeting in edit mode. The parent
  // gives this component a `key` per meeting so it remounts (and re-initializes)
  // when a different meeting is edited; no setState-in-effect needed.
  const initialForm = () => {
    if (editMeeting) {
      const { date, time } = splitDateTime(editMeeting.scheduledAt || editMeeting.date);
      return {
        title: editMeeting.title || "",
        description: editMeeting.description || "",
        date, time,
        duration: editMeeting.duration || 60,
        invites: "",
      };
    }
    return EMPTY;
  };

  const [form, setForm] = useState(initialForm);
  const [created, setCreated] = useState(null);
  const [copied, setCopied] = useState(false);

  const reset = () => { setForm(EMPTY); setCreated(null); setCopied(false); };
  const handleClose = () => { reset(); onClose(); };

  const invalidate = () => {
    queryClient.invalidateQueries({ queryKey: ["meetings"] });
    queryClient.invalidateQueries({ queryKey: ["upcoming-meetings"] });
    queryClient.invalidateQueries({ queryKey: ["dashboard-stats"] });
    if (editMeeting?._id || editMeeting?.id) {
      queryClient.invalidateQueries({ queryKey: ["meeting", editMeeting._id || editMeeting.id] });
    }
  };

  const mutation = useMutation({
    mutationFn: (payload) =>
      isEdit ? updateMeeting(editMeeting._id || editMeeting.id, payload) : createMeeting(payload),
    onSuccess: (data) => {
      invalidate();
      if (isEdit) {
        toast({ type: "success", title: "Meeting updated", message: "Your changes were saved." });
        handleClose();
      } else {
        setCreated(data?.meeting ?? data);
      }
    },
    onError: (e) =>
      toast({ type: "error", title: isEdit ? "Update failed" : "Create failed", message: e?.response?.data?.message || "Something went wrong." }),
  });

  const handleChange = (e) => setForm((p) => ({ ...p, [e.target.name]: e.target.value }));

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.title.trim()) return;
    const scheduledAt = form.date && form.time
      ? new Date(`${form.date}T${form.time}`).toISOString()
      : new Date().toISOString();
    if (isEdit) {
      mutation.mutate({ title: form.title, description: form.description, scheduledAt, duration: Number(form.duration) });
    } else {
      const invites = form.invites ? form.invites.split(/[,\s;]+/).map((s) => s.trim()).filter(Boolean) : [];
      mutation.mutate({ ...form, scheduledAt, invites });
    }
  };

  const shareUrl = created ? buildShareUrl(created) : "";
  const meetingId = created?.meetingId || created?.roomId || "";

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      toast({ type: "success", title: "Link copied", message: "Invite link copied to clipboard." });
      setTimeout(() => setCopied(false), 2000);
    } catch {
      toast({ type: "error", title: "Copy failed", message: "Select and copy the link manually." });
    }
  };

  const handleOpen = () => {
    const oid = meetingId || created?._id;
    handleClose();
    if (oid) navigate(`/meeting/${oid}`);
  };

  const titleText = created ? "Meeting ready" : isEdit ? "Edit meeting" : "Create meeting";

  return (
    <Modal isOpen={isOpen} onClose={handleClose} title={titleText} size="md">
      {created ? (
        <div className="space-y-4">
          <p className="text-sm text-[var(--text-secondary)]">
            <span className="font-medium text-[var(--text)]">{created.title}</span> is ready. Share the link or ID below to invite people.
          </p>
          <div>
            <label className="mb-1.5 block text-sm font-medium text-[var(--text)]">Meeting ID</label>
            <div className="rounded-md border border-[var(--border)] bg-[var(--muted)] px-3 py-2 font-mono text-sm tracking-wide text-[var(--text)]">
              {meetingId}
            </div>
          </div>
          <div>
            <label className="mb-1.5 block text-sm font-medium text-[var(--text)]">Shareable link</label>
            <div className="flex items-center gap-2">
              <div className="flex min-w-0 flex-1 items-center gap-2 rounded-md border border-[var(--border)] bg-[var(--card)] px-3 py-2">
                <LinkIcon size={13} className="flex-shrink-0 text-[var(--text-muted)]" />
                <span className="truncate text-sm text-[var(--text-secondary)]">{shareUrl}</span>
              </div>
              <Button type="button" variant="outline" icon={copied ? Check : Copy} onClick={handleCopy}>
                {copied ? "Copied" : "Copy"}
              </Button>
            </div>
          </div>
          <div className="flex justify-end gap-2 pt-2">
            <Button variant="outline" type="button" onClick={handleClose}>Done</Button>
            <Button type="button" icon={ArrowRight} onClick={handleOpen}>Open meeting</Button>
          </div>
        </div>
      ) : (
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
          {!isEdit && (
            <Input label="Invite (emails, optional)" name="invites" value={form.invites}
              placeholder="bob@team.com, carol@team.com" onChange={handleChange} />
          )}
          <div className="flex justify-end gap-2 pt-2">
            <Button variant="outline" type="button" onClick={handleClose}>Cancel</Button>
            <Button type="submit" loading={mutation.isPending}>{isEdit ? "Save changes" : "Create meeting"}</Button>
          </div>
        </form>
      )}
    </Modal>
  );
}
