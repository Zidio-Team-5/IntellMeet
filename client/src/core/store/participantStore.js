import { create } from "zustand";

// Match a participant by any of its identifiers (socketId is the most reliable
// in a call since one user could in theory have multiple tabs).
const sameParticipant = (a, b) =>
  (a.socketId && a.socketId === b.socketId) ||
  (a.id && a.id === b.id) ||
  (a.userId && a.userId === b.userId);

const useParticipantStore = create((set) => ({
  participants: [],
  localStream: null,
  screenStream: null,
  pinnedId: null,          // socketId/id of a participant pinned to the stage
  hiddenVideoIds: [],      // ids whose incoming video the local user has turned off

  // Pin/unpin a participant to the spotlight (local-only view preference).
  togglePin: (id) => set((s) => ({ pinnedId: s.pinnedId === id ? null : id })),
  // Locally turn a remote participant's incoming video on/off.
  toggleHiddenVideo: (id) =>
    set((s) => ({
      hiddenVideoIds: s.hiddenVideoIds.includes(id)
        ? s.hiddenVideoIds.filter((x) => x !== id)
        : [...s.hiddenVideoIds, id],
    })),

  // Replace the whole roster (used when the server sends the current snapshot).
  setParticipants: (participants) => set({ participants: participants || [] }),

  // Insert or merge — never produces duplicates.
  addParticipant: (participant) =>
    set((state) => {
      if (!participant) return state;
      const idx = state.participants.findIndex((p) => sameParticipant(p, participant));
      if (idx === -1) return { participants: [...state.participants, participant] };
      const next = state.participants.slice();
      next[idx] = { ...next[idx], ...participant };
      return { participants: next };
    }),

  removeParticipant: (id) =>
    set((state) => ({
      participants: state.participants.filter(
        (p) => p._id !== id && p.id !== id && p.socketId !== id && p.userId !== id
      ),
    })),

  updateParticipant: (id, updates) =>
    set((state) => ({
      participants: state.participants.map((p) =>
        p._id === id || p.id === id || p.socketId === id || p.userId === id
          ? { ...p, ...updates }
          : p
      ),
    })),

  // Attach a remote MediaStream to a participant (keyed by socketId).
  setParticipantStream: (socketId, stream) =>
    set((state) => ({
      participants: state.participants.map((p) =>
        p.socketId === socketId ? { ...p, stream } : p
      ),
    })),

  setLocalStream: (stream) => set({ localStream: stream }),
  setScreenStream: (stream) => set({ screenStream: stream }),
  clearParticipants: () =>
    set({ participants: [], localStream: null, screenStream: null, pinnedId: null, hiddenVideoIds: [] }),
}));

export default useParticipantStore;
