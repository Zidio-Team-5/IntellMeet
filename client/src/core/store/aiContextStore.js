import { create } from "zustand";

// Lets "Analyze with AI" (live transcript panel, meeting transcript viewer)
// hand a transcript off to the AI Workspace as attached context, without
// wiring prop-drilling across unrelated routes.
const useAIContextStore = create((set) => ({
  attachedText: "",
  attachedLabel: "",
  setAttachedContext: (text, label = "") => set({ attachedText: text, attachedLabel: label }),
  clearAttachedContext: () => set({ attachedText: "", attachedLabel: "" }),
}));

export default useAIContextStore;
