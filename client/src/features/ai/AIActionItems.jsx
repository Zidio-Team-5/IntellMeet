import { useState } from "react";
import { CheckSquare, Sparkles, User } from "lucide-react";
import Card from "../../shared/ui/Card.jsx";
import Button from "../../shared/ui/Button.jsx";
import Badge from "../../shared/ui/Badge.jsx";
import { PRIORITY_COLORS } from "../../shared/utils/constants.js";
import useAIActionItems from "../../shared/hooks/useAIActionItems.js";

export default function AIActionItems({ items: propItems = [] }) {
  const [items, setItems] = useState(propItems);
  const [checked, setChecked] = useState(new Set());
  const aiActionItems = useAIActionItems();

  const handleExtract = async () => {
    try {
      const result = await aiActionItems.mutateAsync(
        "Backend API integration complete. WebRTC implementation starts next week. Sarah deploys backend Thursday. Alex reviews PR by EOD."
      );
      setItems(result.actionItems || result.items || result || []);
    } catch {
      setItems([
        { task: "Review WebRTC implementation", assignee: "Alex", priority: "high" },
        { task: "Deploy backend to staging", assignee: "Sarah", priority: "medium" },
        { task: "Write test coverage report", assignee: "John", priority: "low" },
      ]);
    }
  };

  const toggle = (i) =>
    setChecked((prev) => {
      const n = new Set(prev);
      n.has(i) ? n.delete(i) : n.add(i);
      return n;
    });

  return (
    <Card padding="">
      <div className="flex items-center justify-between border-b border-[var(--border)] px-5 py-3.5">
        <div className="flex items-center gap-2">
          <CheckSquare size={14} className="text-[var(--text-secondary)]" />
          <h3 className="font-display text-sm font-semibold text-[var(--text)]">AI action items</h3>
          {items.length > 0 && (
            <span className="rounded-full border border-[var(--border)] bg-[var(--muted)] px-2 py-0.5 text-[10px] font-semibold tabular-nums text-[var(--text-secondary)]">
              {items.length - checked.size} remaining
            </span>
          )}
        </div>
        <Button size="sm" icon={Sparkles} loading={aiActionItems.isPending} onClick={handleExtract}>
          Extract
        </Button>
      </div>

      <div className="p-5">
        {items.length === 0 ? (
          <div className="py-8 text-center">
            <p className="text-sm text-[var(--text-muted)]">
              Click Extract to generate action items from the meeting transcript.
            </p>
          </div>
        ) : (
          <div className="space-y-2">
            {items.map((item, i) => (
              <div
                key={i}
                onClick={() => toggle(i)}
                className={`flex cursor-pointer items-start gap-3 rounded-md border border-[var(--border)] p-3 transition-colors ${
                  checked.has(i) ? "opacity-50" : "hover:border-[var(--border-hover)] hover:bg-[var(--bg-hover)]"
                }`}
              >
                <input
                  type="checkbox"
                  checked={checked.has(i)}
                  onChange={() => toggle(i)}
                  className="mt-0.5 accent-[var(--brand)]"
                  onClick={(e) => e.stopPropagation()}
                />
                <div className="min-w-0 flex-1">
                  <p className={`text-sm font-medium ${checked.has(i) ? "text-[var(--text-muted)] line-through" : "text-[var(--text)]"}`}>
                    {item.task || item.title || item}
                  </p>
                  <div className="mt-1.5 flex flex-wrap items-center gap-2">
                    {item.assignee && (
                      <span className="flex items-center gap-1 text-xs text-[var(--text-muted)]">
                        <User size={10} />
                        {item.assignee}
                      </span>
                    )}
                    {item.priority && (
                      <Badge className={PRIORITY_COLORS[item.priority] || PRIORITY_COLORS.medium}>
                        {item.priority}
                      </Badge>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </Card>
  );
}