import { create } from "zustand";

const useMediaStore = create((set) => ({
  audioEnabled: true,
  videoEnabled: true,
  screenSharing: false,
  isRecording: false,
  localStream: null,

  setAudioEnabled: (val) => set({ audioEnabled: val }),
  setVideoEnabled: (val) => set({ videoEnabled: val }),
  setScreenSharing: (val) => set({ screenSharing: val }),
  setIsRecording: (val) => set({ isRecording: val }),
  setLocalStream: (stream) => set({ localStream: stream }),
  toggleAudio: () => set((state) => ({ audioEnabled: !state.audioEnabled })),
  toggleVideo: () => set((state) => ({ videoEnabled: !state.videoEnabled })),
  toggleScreenShare: () =>
    set((state) => ({ screenSharing: !state.screenSharing })),
  reset: () =>
    set({
      audioEnabled: true,
      videoEnabled: true,
      screenSharing: false,
      isRecording: false,
      localStream: null,
    }),
}));

export default useMediaStore;
