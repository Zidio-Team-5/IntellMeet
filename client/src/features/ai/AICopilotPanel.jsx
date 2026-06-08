import { Sparkles } from "lucide-react";
import Card from "../../shared/ui/Card.jsx";
import Badge from "../../shared/ui/Badge.jsx";
import AIChat from "./AIChat.jsx";

export default function AICopilotPanel() {
  return (
    <Card padding="" className="flex flex-col" style={{ minHeight: "520px" }}>
      <div className="flex items-center gap-2 border-b border-[var(--border)] px-5 py-3.5">
        <div className="flex h-7 w-7 items-center justify-center rounded-md bg-[var(--brand-subtle)]">
          <Sparkles size={14} className="text-[var(--brand)]" />
        </div>
        <h3 className="font-display text-sm font-semibold text-[var(--text)]">AI Copilot</h3>
        <Badge variant="neutral" className="ml-auto rounded-full border border-[var(--border)] bg-[var(--muted)] px-2 py-0.5 text-[10px] font-medium text-[var(--text-secondary)]">
          GPT-4
        </Badge>
      </div>
      <div className="flex min-h-0 flex-1 flex-col p-5">
        <AIChat />
      </div>
    </Card>
  );
}