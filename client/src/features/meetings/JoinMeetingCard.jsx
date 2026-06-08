import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Card from "../../shared/ui/Card.jsx";
import Button from "../../shared/ui/Button.jsx";
import { joinMeeting } from "../../services/meetingService.js";

export default function JoinMeetingCard() {
  const [meetingId, setMeetingId] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleJoin = async () => {
    if (!meetingId.trim()) return;
    setLoading(true);
    try {
      await joinMeeting(meetingId.trim());
      navigate(`/meeting/${meetingId.trim()}`);
    } catch (err) {
      console.error(err);
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