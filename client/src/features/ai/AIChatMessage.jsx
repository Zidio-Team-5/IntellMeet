export default function AIChatMessage({ message }) {
  const isAI = message.role === "assistant";
  return (
    <div className={`flex gap-3 ${isAI ? "" : "flex-row-reverse"}`}>
      <div
        className={`max-w-[80%] rounded-lg px-3.5 py-2.5 text-sm leading-relaxed ${
          isAI ? "bg-[var(--muted)] text-[var(--text)]" : "bg-[var(--primary)] text-white"
        }`}
      >
        <strong className="mb-1 block text-xs opacity-60">
          {isAI ? "AI Assistant" : "You"}
        </strong>
        {message.content}
      </div>
    </div>
  );
}