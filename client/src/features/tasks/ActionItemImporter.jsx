import { useState } from "react";
import { Sparkles, ArrowDown } from "lucide-react";
import Card from "../../shared/ui/Card.jsx";
import Button from "../../shared/ui/Button.jsx";
import useAIActionItems from "../../shared/hooks/useAIActionItems.js";
import useCreateTask from "../../shared/hooks/useCreateTask.js";

export default function ActionItemImporter() {
  const [transcript, setTranscript] = useState("");
  const [extracted, setExtracted] = useState([]);
  const [importing, setImporting] = useState(false);
  const aiActionItems = useAIActionItems();
  const createTask = useCreateTask();

  const handleExtract = async () => {
    if (!transcript.trim()) return;
    try {
      const result = await aiActionItems.mutateAsync(transcript);
      setExtracted(result.actionItems || result.items || []);
    } catch {
      setExtracted([]);
    }
  };

  const handleImport = async () => {
    setImporting(true);
    for (const item of extracted) {
      await createTask.mutateAsync({
        title: item.task || item.title,
        assignee: item.assignee,
        priority: item.priority || "medium",
        status: "todo",
      }).catch(() => {});
    }
    setExtracted([]);
    setTranscript("");
    setImporting(false);
  };

  return (
    <Card>
      <div className="mb-1 flex items-center gap-2">
        <Sparkles size={15} className="text-[var(--brand)]" />
        <h3 className="font-display text-sm font-semibold text-[var(--text)]">
          Import from meeting
        </h3>
      </div>
      <p className="mb-3 text-xs text-[var(--text-muted)]">
        Paste a transcript to extract action items into tasks.
      </p>
      <textarea
        value={transcript}
        onChange={(e) => setTranscript(e.target.value)}
        placeholder="Paste meeting transcript…"
        rows={4}
        className="w-full resize-none rounded-md border border-[var(--border)] bg-[var(--muted)] px-3 py-2.5 text-sm text-[var(--text)] placeholder:text-[var(--text-muted)] outline-none transition-colors focus:border-[var(--brand)] focus:ring-2 focus:ring-[var(--brand)]/25"
      />
      <div className="mt-3 flex gap-2">
        <Button icon={Sparkles} loading={aiActionItems.isPending} onClick={handleExtract}>
          Extract items
        </Button>
        {extracted.length > 0 && (
          <Button variant="success" icon={ArrowDown} loading={importing} onClick={handleImport}>
            Import {extracted.length} to board
          </Button>
        )}
      </div>
    </Card>
  );
}