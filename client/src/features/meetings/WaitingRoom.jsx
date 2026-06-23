import { useNavigate } from "react-router-dom";
import { Loader2, ShieldX, DoorClosed, Clock } from "lucide-react";
import Button from "../../shared/ui/Button.jsx";

// Full-screen gate shown to a participant until the host admits them, or when
// entry is blocked (meeting completed, denied, removed, or ended).
export default function WaitingRoom({ gate, title }) {
  const navigate = useNavigate();

  const config = {
    joining: { icon: Loader2, spin: true, heading: "Joining…", body: "Connecting you to the meeting.", showBack: false },
    waiting: { icon: Clock, spin: false, heading: "Waiting for the host", body: `You're in the waiting room for "${title || "this meeting"}". The host will let you in shortly.`, showBack: true },
    denied: { icon: ShieldX, spin: false, heading: "Not admitted", body: "The host declined your request to join.", showBack: true },
    blocked: { icon: DoorClosed, spin: false, heading: "Meeting unavailable", body: "This meeting has ended and can no longer be joined.", showBack: true },
    removed: { icon: ShieldX, spin: false, heading: "Removed", body: "You were removed from the meeting by the host.", showBack: true },
    ended: { icon: DoorClosed, spin: false, heading: "Meeting ended", body: "The host has ended this meeting.", showBack: true },
  }[gate] || {};

  const Icon = config.icon || Loader2;

  return (
    <div className="flex h-screen flex-col items-center justify-center bg-[var(--background)] px-6 text-center text-[var(--text)]">
      <div className="flex max-w-md flex-col items-center gap-4">
        <div className="flex h-16 w-16 items-center justify-center rounded-full border border-[var(--border)] bg-[var(--card)]">
          <Icon size={28} className={`text-[var(--brand)] ${config.spin ? "animate-spin" : ""}`} />
        </div>
        <h1 className="font-display text-xl font-semibold">{config.heading}</h1>
        <p className="text-sm text-[var(--text-secondary)]">{config.body}</p>
        {config.showBack && (
          <Button variant="outline" onClick={() => navigate("/meetings")}>Back to meetings</Button>
        )}
      </div>
    </div>
  );
}
