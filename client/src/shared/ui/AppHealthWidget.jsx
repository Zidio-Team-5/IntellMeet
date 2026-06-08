import { useEffect, useState } from "react";
import { Activity } from "lucide-react";
import Card from "./Card.jsx";

export default function AppHealthWidget() {
  const [status, setStatus] = useState("Healthy");
  const [uptime] = useState("99.9%");

  useEffect(() => {
    const interval = setInterval(() => {
      setStatus("Healthy");
    }, 30000);
    return () => clearInterval(interval);
  }, []);

  return (
    <Card padding="p-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Activity size={14} className="text-[var(--text-secondary)]" />
          <span className="text-xs font-medium text-[var(--text-secondary)]">System health</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="live-badge h-2 w-2 rounded-full bg-[var(--success)]" />
          <span className="text-xs font-semibold text-[var(--success)]">{status}</span>
        </div>
      </div>
      <p className="mt-1 text-right text-xs text-[var(--text-muted)] tabular-nums">Uptime {uptime}</p>
    </Card>
  );
}