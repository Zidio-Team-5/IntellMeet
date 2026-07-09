import { useRef, useCallback, useState } from "react";
import useParticipantStore from "../../core/store/participantStore.js";
import { uploadMeetingRecording } from "../../services/meetingService.js";
import { toast } from "../../core/store/toastStore.js";

const TILE_W = 480;
const TILE_H = 270;

const colsFor = (n) => (n <= 1 ? 1 : n <= 4 ? 2 : n <= 9 ? 3 : 4);

export default function useMeetingRecording(meetingId) {
  const [isUploading, setIsUploading] = useState(false);
  const recorderRef = useRef(null);
  const chunksRef = useRef([]);
  const rafRef = useRef(null);
  const canvasRef = useRef(null);
  const audioCtxRef = useRef(null);
  const audioDestRef = useRef(null);
  const audioSourcesRef = useRef(new Map()); // streamId -> { source, stream }
  const tileVideosRef = useRef(new Map()); // participantKey -> hidden <video>

  const getAllStreams = useCallback(() => {
    const { participants, localStream } = useParticipantStore.getState();
    const remote = participants.filter((p) => p.stream).map((p) => ({ key: p.socketId || p.id, stream: p.stream, name: p.name }));
    return localStream ? [{ key: "local", stream: localStream, name: "You" }, ...remote] : remote;
  }, []);

  // Keep the audio mix graph in sync with whoever currently has a stream.
  const syncAudioGraph = useCallback((streams) => {
    const ctx = audioCtxRef.current;
    if (!ctx) return;
    const liveKeys = new Set(streams.map((s) => s.key));
    // Remove sources for participants who left.
    for (const [key, entry] of audioSourcesRef.current.entries()) {
      if (!liveKeys.has(key)) {
        try { entry.source.disconnect(); } catch { /* noop */ }
        audioSourcesRef.current.delete(key);
      }
    }
    // Add sources for new participants (or reconnect if the stream object changed).
    streams.forEach(({ key, stream }) => {
      const existing = audioSourcesRef.current.get(key);
      if (existing && existing.stream === stream) return;
      if (existing) { try { existing.source.disconnect(); } catch { /* noop */ } }
      if (!stream.getAudioTracks().length) return;
      try {
        const source = ctx.createMediaStreamSource(stream);
        source.connect(audioDestRef.current);
        audioSourcesRef.current.set(key, { source, stream });
      } catch { /* some streams (e.g. mid-renegotiation) may briefly fail - skip */ }
    });
  }, []);

  const drawFrame = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    const streams = getAllStreams();
    syncAudioGraph(streams);

    // Keep one hidden <video> element per live stream so we can draw its
    // current frame onto the canvas.
    const liveKeys = new Set(streams.map((s) => s.key));
    for (const [key, el] of tileVideosRef.current.entries()) {
      if (!liveKeys.has(key)) { el.srcObject = null; tileVideosRef.current.delete(key); }
    }
    streams.forEach(({ key, stream }) => {
      let el = tileVideosRef.current.get(key);
      if (!el) {
        el = document.createElement("video");
        el.muted = true;
        el.playsInline = true;
        tileVideosRef.current.set(key, el);
      }
      if (el.srcObject !== stream) { el.srcObject = stream; el.play().catch(() => {}); }
    });

    const cols = colsFor(streams.length || 1);
    const rows = Math.max(1, Math.ceil((streams.length || 1) / cols));
    canvas.width = cols * TILE_W;
    canvas.height = rows * TILE_H;

    ctx.fillStyle = "#111";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    if (streams.length === 0) {
      ctx.fillStyle = "#888";
      ctx.font = "20px sans-serif";
      ctx.textAlign = "center";
      ctx.fillText("Waiting for participants…", canvas.width / 2, canvas.height / 2);
    }

    streams.forEach(({ key, name }, i) => {
      const el = tileVideosRef.current.get(key);
      const x = (i % cols) * TILE_W;
      const y = Math.floor(i / cols) * TILE_H;
      if (el && el.readyState >= 2 && el.videoWidth) {
        ctx.drawImage(el, x, y, TILE_W, TILE_H);
      } else {
        ctx.fillStyle = "#2a2a2a";
        ctx.fillRect(x, y, TILE_W, TILE_H);
      }
      ctx.fillStyle = "rgba(0,0,0,0.55)";
      ctx.fillRect(x + 8, y + TILE_H - 28, Math.min(TILE_W - 16, (name?.length || 4) * 8 + 16), 20);
      ctx.fillStyle = "#fff";
      ctx.font = "13px sans-serif";
      ctx.textAlign = "left";
      ctx.fillText(name || "Participant", x + 14, y + TILE_H - 13);
    });

    rafRef.current = requestAnimationFrame(drawFrame);
  }, [getAllStreams, syncAudioGraph]);

  const start = useCallback(() => {
    if (recorderRef.current) return;
    const canvas = document.createElement("canvas");
    canvas.width = TILE_W;
    canvas.height = TILE_H;
    canvasRef.current = canvas;

    const AudioCtx = window.AudioContext || window.webkitAudioContext;
    audioCtxRef.current = new AudioCtx();
    audioDestRef.current = audioCtxRef.current.createMediaStreamDestination();

    drawFrame();

    const canvasStream = canvas.captureStream(24);
    const combined = new MediaStream([
      ...canvasStream.getVideoTracks(),
      ...audioDestRef.current.stream.getAudioTracks(),
    ]);

    const mimeType = MediaRecorder.isTypeSupported("video/webm;codecs=vp9,opus")
      ? "video/webm;codecs=vp9,opus"
      : "video/webm";
    const recorder = new MediaRecorder(combined, { mimeType });
    chunksRef.current = [];
    recorder.ondataavailable = (e) => { if (e.data.size > 0) chunksRef.current.push(e.data); };
    recorder.start(1000);
    recorderRef.current = recorder;
    toast({ type: "info", title: "Recording started", message: "This meeting is now being recorded." });
  }, [drawFrame]);

  const stop = useCallback(async () => {
    const recorder = recorderRef.current;
    if (!recorder) return;

    await new Promise((resolve) => {
      recorder.onstop = resolve;
      recorder.stop();
    });
    recorderRef.current = null;
    if (rafRef.current) cancelAnimationFrame(rafRef.current);
    rafRef.current = null;

    audioSourcesRef.current.forEach(({ source }) => { try { source.disconnect(); } catch { /* noop */ } });
    audioSourcesRef.current.clear();
    tileVideosRef.current.forEach((el) => { el.srcObject = null; });
    tileVideosRef.current.clear();
    if (audioCtxRef.current) { audioCtxRef.current.close().catch(() => {}); audioCtxRef.current = null; }

    const blob = new Blob(chunksRef.current, { type: "video/webm" });
    chunksRef.current = [];
    if (blob.size === 0) return;

    setIsUploading(true);
    try {
      await uploadMeetingRecording(meetingId, blob);
      toast({ type: "success", title: "Recording saved", message: "Uploaded to your connected Google Drive." });
    } catch (e) {
      const msg = e?.response?.data?.message || "Couldn't upload the recording.";
      toast({ type: "error", title: "Upload failed", message: msg });
    } finally {
      setIsUploading(false);
    }
  }, [meetingId]);

  return { start, stop, isUploading };
}
