import { useState, useRef, useEffect } from "react";
import { Send, Sparkles, User, FileText, X } from "lucide-react";
import Button from "../../shared/ui/Button.jsx";
import useAIChat from "../../shared/hooks/useAIChat.js";
import useAIContextStore from "../../core/store/aiContextStore.js";

function Message({ msg }) {
  const isAI = msg.role === "assistant";
  return (
    <div className={`flex gap-3 ${isAI ? "" : "flex-row-reverse"}`}>
      <div
        className={`flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-md ${
          isAI ? "bg-[var(--brand-subtle)]" : "border border-[var(--border)] bg-[var(--muted)]"
        }`}
      >
        {isAI ? <Sparkles size={13} className="text-[var(--brand)]" /> : <User size={13} className="text-[var(--text-secondary)]" />}
      </div>
      <div
        className={`max-w-[80%] rounded-lg px-3.5 py-2.5 text-sm leading-relaxed ${
          isAI ? "bg-[var(--muted)] text-[var(--text)]" : "bg-[var(--primary)] text-white"
        }`}
      >
        {msg.content}
      </div>
    </div>
  );
}

export default function AIChat() {
  const [prompt, setPrompt] = useState("");
  const [messages, setMessages] = useState([
    { role: "assistant", content: "Hi! I'm IntellMeet's AI assistant. Ask me to summarize meetings, extract action items, or answer questions about your workspace." },
  ]);
  const bottomRef = useRef(null);
  const aiChat = useAIChat();
  const { attachedText, attachedLabel, clearAttachedContext } = useAIContextStore();

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Surface a system note in the thread once when a transcript gets attached,
  // so it's clear the AI now has that context for follow-up questions.
  useEffect(() => {
    if (attachedText) {
      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: `Transcript attached${attachedLabel ? ` from "${attachedLabel}"` : ""}. Ask me to summarize it, extract action items, or anything else about it.` },
      ]);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [attachedText]);

  const handleSend = async () => {
    if (!prompt.trim() || aiChat.isPending) return;
    const userMsg = { role: "user", content: prompt };
    setMessages((prev) => [...prev, userMsg]);
    setPrompt("");
    try {
      const result = await aiChat.mutateAsync({ message: prompt, context: attachedText || undefined });
      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: result.response || result.message || "Sorry, I couldn't process that." },
      ]);
    } catch {
      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: "An error occurred. Please try again." },
      ]);
    }
  };

  return (
    <div className="flex h-full flex-col">
      {attachedText && (
        <div className="mb-3 flex items-center gap-2 rounded-md border border-[var(--border)] bg-[var(--muted)] px-3 py-2 text-xs text-[var(--text-secondary)]">
          <FileText size={12} className="flex-shrink-0 text-[var(--brand)]" />
          <span className="flex-1 truncate">
            Transcript attached{attachedLabel ? `: ${attachedLabel}` : ""}
          </span>
          <button
            onClick={clearAttachedContext}
            aria-label="Remove attached transcript"
            className="flex-shrink-0 rounded p-0.5 text-[var(--text-muted)] hover:bg-[var(--bg-hover)] hover:text-[var(--text)]"
          >
            <X size={12} />
          </button>
        </div>
      )}
      <div className="flex-1 space-y-4 overflow-y-auto pb-4">
        {messages.map((msg, i) => <Message key={i} msg={msg} />)}
        <div ref={bottomRef} />
      </div>
      <div className="flex gap-2 border-t border-[var(--border)] pt-4">
        <input
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && !e.shiftKey && handleSend()}
          placeholder="Ask AI anything…"
          aria-label="Ask AI"
          className="flex-1 rounded-md border border-[var(--border)] bg-[var(--card)] px-3 py-2.5 text-sm text-[var(--text)] placeholder:text-[var(--text-muted)] outline-none transition-colors hover:border-[var(--border-hover)] focus:border-[var(--brand)] focus:ring-2 focus:ring-[var(--brand)]/25"
        />
        <Button onClick={handleSend} loading={aiChat.isPending} icon={Send} size="md">
          Send
        </Button>
      </div>
    </div>
  );
}
