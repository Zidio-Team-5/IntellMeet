import { create } from "zustand";

const useRealtimeStore = create((set) => ({
  transcript: [],
  isTranscribing: false,
  liveMessages: [],

  addTranscriptEntry: (entry) =>
    set((state) => ({ transcript: [...state.transcript, entry] })),
  setIsTranscribing: (val) => set({ isTranscribing: val }),
  setTranscript: (transcript) => set({ transcript }),
  addLiveMessage: (msg) =>
    set((state) => ({ liveMessages: [...state.liveMessages, msg] })),
  clearTranscript: () => set({ transcript: [], liveMessages: [] }),
}));

export default useRealtimeStore;
