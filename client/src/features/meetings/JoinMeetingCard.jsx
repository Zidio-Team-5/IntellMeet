import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Card from "../../shared/ui/Card.jsx";
import Button from "../../shared/ui/Button.jsx";
import { joinMeeting } from "../../services/meetingService.js";
import { toast } from "../../core/store/toastStore.js";
import { extractMeetingId } from "../../shared/utils/meeting.js";

export default function JoinMeetingCard() {
  const [meetingId, setMeetingId] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleJoin = async () => {
    const id = extractMeetingId(meetingId);
    if (!id) {
      toast({ type: "warning", title: "Enter a meeting", message: "Paste a meeting ID or invite link." });
      return;
    }
    setLoading(true);
    try {
      await joinMeeting(id);
      navigate(`/meeting/${id}`);
    } catch (err) {
      const message = err?.response?.data?.message || "Could not join that meeting. Check the ID or link.";
      toast({ type: "error", title: "Unable to join", message });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card>
      <h3 className="mb-1 font-display text-sm font-semibold text-[var(--text)]">Join a meeting</h3>
      <p className="mb-4 text-xs text-[var(--text-muted)]">Enter a meeting ID or paste an invite link.</p>
      <input
        value={meetingId}
        onChange={(e) => setMeetingId(e.target.value)}
        onKeyDown={(e) => e.key === "Enter" && handleJoin()}
        placeholder="Meeting ID or link"
        aria-label="Meeting ID or link"
        className="mb-3 w-full rounded-md border border-[var(--border)] bg-[var(--card)] px-3 py-2 text-sm text-[var(--text)] placeholder:text-[var(--text-muted)] outline-none transition-colors hover:border-[var(--border-hover)] focus:border-[var(--brand)] focus:ring-2 focus:ring-[var(--brand)]/25"
      />
      <Button className="w-full" onClick={handleJoin} loading={loading}>
        Join now
      </Button>
    </Card>
  );
}
