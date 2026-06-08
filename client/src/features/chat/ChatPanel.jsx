import { useState } from "react";
import { Send, MessageSquare } from "lucide-react";
import Card from "../../shared/ui/Card.jsx";
import useMeetingChat from "../../shared/hooks/useMeetingChat.js";

export default function ChatPanel({ meetingId }) {
  const [input, setInput] = useState("");
  const { messages, sendMessage } = useMeetingChat(meetingId);

  const handleSend = () => {
    if (!input.trim()) return;
    sendMessage(input);
    setInput("");
  };

  return (
    <Card padding="" className="flex h-full flex-col">
      <div className="flex items-center gap-2 border-b border-[var(--border)] px-4 py-3">
        <MessageSquare size={13} className="text-[var(--text-secondary)]" />
        <h3 className="font-display text-sm font-semibold text-[var(--text)]">Chat</h3>
      </div>

      <div className="flex-1 space-y-3 overflow-y-auto p-4">
        {messages.length === 0 ? (
          <p className="py-4 text-center text-xs text-[var(--text-muted)]">
            Meeting chat is active. Say hello!
          </p>
        ) : (
          messages.map((msg) => (
            <div key={msg.id} className="flex flex-col">
              <div className="flex items-center gap-1.5">
                <span className="text-[10px] font-semibold text-[var(--text-secondary)]">{msg.sender}</span>
                <span className="text-[10px] text-[var(--text-muted)]">{msg.timestamp ? new Date(msg.timestamp).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }) : ""}</span>
              </div>
              <p className="mt-0.5 text-sm text-[var(--text)]">{msg.content}</p>
            </div>
          ))
        )}
      </div>

      <div className="flex items-center gap-2 border-t border-[var(--border)] p-3">
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleSend()}
          placeholder="Type a message…"
          aria-label="Chat message"
          className="flex-1 rounded-md border border-[var(--border)] bg-[var(--muted)] px-3 py-2 text-sm text-[var(--text)] placeholder:text-[var(--text-muted)] outline-none transition-colors focus:border-[var(--brand)] focus:ring-2 focus:ring-[var(--brand)]/25"
        />
        <button
          onClick={handleSend}
          aria-label="Send message"
          className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-md bg-[var(--brand)] text-white transition-colors hover:bg-[var(--brand-hover)]"
        >
          <Send size={14} />
        </button>
      </div>
    </Card>
  );
}