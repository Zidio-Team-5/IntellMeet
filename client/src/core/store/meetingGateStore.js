import { create } from "zustand";

// Tracks the local user's admission state and host-side moderation/waiting data.
// gate: "joining" | "waiting" | "admitted" | "denied" | "blocked" | "removed" | "ended"
const useMeetingGateStore = create((set) => ({
  gate: "joining",
  blockedReason: null,
  waitingList: [],
  moderation: { chatEnabled: true, screenShareLocked: false },

  setGate: (gate, blockedReason = null) => set({ gate, blockedReason }),
  setWaitingList: (waitingList) => set({ waitingList: waitingList || [] }),
  setModeration: (moderation) => set({ moderation: { chatEnabled: true, screenShareLocked: false, ...moderation } }),
  reset: () => set({ gate: "joining", blockedReason: null, waitingList: [], moderation: { chatEnabled: true, screenShareLocked: false } }),
}));

export default useMeetingGateStore;
