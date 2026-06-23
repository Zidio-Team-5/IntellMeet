import { create } from "zustand";

const useRealtimeStore = create((set) => ({
  transcript: [],
  isTranscribing: false,
  liveMessages: [],

  addTranscriptEntry: (entry) =>
    set((state) => {
      // Defense-in-depth against caption duplicates: skip an entry that repeats
      // the previous one's speaker + text within a few seconds.
      const last = state.transcript[state.transcript.length - 1];
      if (last && last.speaker === entry.speaker && last.text === entry.text) {
        const dt = Math.abs(new Date(entry.timestamp || Date.now()) - new Date(last.timestamp || 0));
        if (dt < 2000) return state;
      }
      return { transcript: [...state.transcript, entry] };
    }),
  setIsTranscribing: (val) => set({ isTranscribing: val }),
  setTranscript: (transcript) => set({ transcript }),
  addLiveMessage: (msg) =>
    set((state) => ({ liveMessages: [...state.liveMessages, msg] })),
  clearTranscript: () => set({ transcript: [], liveMessages: [] }),
}));

export default useRealtimeStore;
