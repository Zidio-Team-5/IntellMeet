import { useEffect, useRef } from "react";
import { connectSocket, getSocket } from "../../services/socketService.js";
import useAuthStore from "../../core/store/authStore.js";
import useMediaStore from "../../core/store/mediaStore.js";
import useParticipantStore from "../../core/store/participantStore.js";
import useRealtimeStore from "../../core/store/realtimeStore.js";
import useMeetingGateStore from "../../core/store/meetingGateStore.js";
import webrtc from "../../services/webrtcService.js";

/**
 * Real audio/video for a meeting room: acquires local media, builds a WebRTC
 * mesh with every other participant (signaling relayed over the shared socket),
 * supports screen-share, mute/unmute, and emits live captions via the browser
 * SpeechRecognition API. Everything degrades gracefully — if the browser blocks
 * the camera/mic or lacks an API, the room still works (avatars + chat).
 *
 * Signaling model: the JOINER offers to everyone already in the room (received
 * via meeting:participants); existing peers answer. This avoids offer glare.
 */
export default function useMeetingMedia(meetingId) {
  const { token, user } = useAuthStore();
  const {
    audioEnabled, videoEnabled, screenSharing, handRaised,
    setLocalStream, setScreenSharing,
  } = useMediaStore();
  const { setParticipantStream, setLocalStream: setStoreLocalStream, localStream } = useParticipantStore();
  const gate = useMeetingGateStore((st) => st.gate);
  const admitted = gate === "admitted";

  const localStreamRef = useRef(null);
  const cameraTrackRef = useRef(null);
  const activeVideoTrackRef = useRef(null); // whichever track is CURRENTLY going out: camera or screen
  const videoEnabledRef = useRef(videoEnabled); // read inside the PIP draw loop without retriggering screen-share start/stop
  const pendingPeersRef = useRef([]); // peers to offer once media is ready
  const recognitionRef = useRef(null);

  // ---- 1) Acquire local media + set up signaling, once per room ----
  useEffect(() => {
    if (!meetingId || !token || !admitted) return;
    const socket = connectSocket(token);
    let cancelled = false;

    const sendIce = (to, candidate) => socket.emit("webrtc:ice", { to, candidate });
    const onRemoteTrack = (to, stream) => setParticipantStream(to, stream);

    const ensurePeer = (peerSocketId) => {
      let pc = webrtc.getConnection(peerSocketId);
      if (!pc) {
        pc = webrtc.createPeerConnection(peerSocketId, sendIce, onRemoteTrack);
        if (localStreamRef.current) webrtc.addLocalStream(peerSocketId, localStreamRef.current);
        // If screen sharing is already in progress when this peer connects,
        // the line above just added the camera track — swap it for the
        // active screen track so late joiners see the share too.
        if (activeVideoTrackRef.current && activeVideoTrackRef.current !== cameraTrackRef.current) {
          const sender = pc.getSenders().find((s) => s.track && s.track.kind === "video");
          if (sender) sender.replaceTrack(activeVideoTrackRef.current).catch(() => {});
        }
      }
      return pc;
    };

    const offerTo = async (peerSocketId) => {
      try {
        ensurePeer(peerSocketId);
        const offer = await webrtc.createOffer(peerSocketId);
        socket.emit("webrtc:offer", { to: peerSocketId, offer });
      } catch (e) { /* peer may have left */ }
    };

    const startMedia = async () => {
      // Noise suppression + echo cancellation + auto gain make voices clearer
      // and prevent feedback howl when two tabs share one machine.
      const audioConstraints = {
        echoCancellation: true,
        noiseSuppression: true,
        autoGainControl: true,
      };
      let stream = null;
      try {
        stream = await navigator.mediaDevices.getUserMedia({
          video: { width: { ideal: 1280 }, height: { ideal: 720 } },
          audio: audioConstraints,
        });
      } catch {
        // Camera may be busy (e.g. another tab on the same machine holds it).
        // Fall back to audio-only so the user still has a clear mic + controls.
        try { stream = await navigator.mediaDevices.getUserMedia({ video: false, audio: audioConstraints }); }
        catch { stream = null; }
      }
      if (!stream) return; // no permission at all — avatars + chat still work
      if (cancelled) { stream.getTracks().forEach((t) => t.stop()); return; }
      localStreamRef.current = stream;
      cameraTrackRef.current = stream.getVideoTracks()[0] || null;
      activeVideoTrackRef.current = cameraTrackRef.current;
      stream.getAudioTracks().forEach((t) => (t.enabled = audioEnabled));
      stream.getVideoTracks().forEach((t) => (t.enabled = videoEnabled));
      setLocalStream(stream);
      setStoreLocalStream(stream);
      const pending = pendingPeersRef.current.splice(0);
      pending.forEach((sid) => offerTo(sid));
    };

    // Roster snapshot → offer to everyone already here.
    const onRoster = (list) => {
      (list || []).forEach((p) => {
        if (!p.socketId) return;
        if (localStreamRef.current) offerTo(p.socketId);
        else pendingPeersRef.current.push(p.socketId);
      });
    };

    const onOffer = async ({ from, offer }) => {
      try {
        ensurePeer(from);
        await webrtc.setRemoteDescription(from, offer);
        const answer = await webrtc.createAnswer(from);
        socket.emit("webrtc:answer", { to: from, answer });
      } catch (e) { /* ignore */ }
    };
    const onAnswer = async ({ from, answer }) => {
      try { await webrtc.setRemoteDescription(from, answer); } catch (e) { /* ignore */ }
    };
    const onIce = async ({ from, candidate }) => {
      try { await webrtc.addIceCandidate(from, candidate); } catch (e) { /* ignore */ }
    };
    const onLeft = ({ socketId }) => { if (socketId) webrtc.closeConnection(socketId); };

    socket.on("meeting:participants", onRoster);
    socket.on("webrtc:offer", onOffer);
    socket.on("webrtc:answer", onAnswer);
    socket.on("webrtc:ice", onIce);
    socket.on("meeting:participant-left", onLeft);

    startMedia();

    return () => {
      cancelled = true;
      socket.off("meeting:participants", onRoster);
      socket.off("webrtc:offer", onOffer);
      socket.off("webrtc:answer", onAnswer);
      socket.off("webrtc:ice", onIce);
      socket.off("meeting:participant-left", onLeft);
      webrtc.closeAll();
      if (recognitionRef.current) { try { recognitionRef.current.stop(); } catch { /* noop */ } recognitionRef.current = null; }
      if (localStreamRef.current) localStreamRef.current.getTracks().forEach((t) => t.stop());
      localStreamRef.current = null;
      setLocalStream(null);
      setStoreLocalStream(null);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [meetingId, token, admitted]);

  // ---- 2) React to mute/unmute toggles: flip track.enabled + tell others ----
  useEffect(() => {
    videoEnabledRef.current = videoEnabled;
    const stream = localStreamRef.current;
    if (stream) {
      stream.getAudioTracks().forEach((t) => (t.enabled = audioEnabled));
      stream.getVideoTracks().forEach((t) => (t.enabled = videoEnabled));
    }
    const socket = getSocket();
    if (socket && meetingId) {
      socket.emit("meeting:media-state", {
        meetingId, audioMuted: !audioEnabled, videoMuted: !videoEnabled, screenSharing, handRaised,
      });
    }
  }, [audioEnabled, videoEnabled, screenSharing, handRaised, meetingId]);

  // ---- 3) Screen share: composite camera as a small PIP square over the
  // shared screen (via canvas), then swap the outgoing video track on every
  // peer to the composited stream. If the camera is off, just the screen
  // goes out. videoEnabledRef is read (not a dependency) so toggling the
  // camera mid-share doesn't restart the screen capture.
  useEffect(() => {
    let displayStream = null;
    let rafId = null;
    let canvas = null;
    let ctx = null;
    let screenVideoEl = null;
    let camVideoEl = null;

    const replaceVideoTrack = (track) => {
      webrtc.peerConnections.forEach((pc) => {
        const sender = pc.getSenders().find((s) => s.track && s.track.kind === "video");
        if (sender) sender.replaceTrack(track).catch(() => {});
      });
    };

    const drawFrame = () => {
      if (!ctx || !canvas) return;
      const w = canvas.width, h = canvas.height;
      ctx.drawImage(screenVideoEl, 0, 0, w, h);
      if (videoEnabledRef.current && camVideoEl && camVideoEl.readyState >= 2) {
        const pipW = Math.round(w * 0.2);
        const pipH = Math.round(pipW * 9 / 16);
        const pad = Math.round(w * 0.015);
        const x = w - pipW - pad;
        const y = h - pipH - pad;
        ctx.save();
        ctx.shadowColor = "rgba(0,0,0,0.4)";
        ctx.shadowBlur = 12;
        ctx.drawImage(camVideoEl, x, y, pipW, pipH);
        ctx.shadowBlur = 0;
        ctx.strokeStyle = "rgba(255,255,255,0.9)";
        ctx.lineWidth = Math.max(2, Math.round(w * 0.002));
        ctx.strokeRect(x, y, pipW, pipH);
        ctx.restore();
      }
      rafId = requestAnimationFrame(drawFrame);
    };

    const start = async () => {
      try {
        displayStream = await navigator.mediaDevices.getDisplayMedia({ video: true });
        const screenTrack = displayStream.getVideoTracks()[0];

        screenVideoEl = document.createElement("video");
        screenVideoEl.muted = true;
        screenVideoEl.playsInline = true;
        screenVideoEl.srcObject = new MediaStream([screenTrack]);
        await screenVideoEl.play().catch(() => {});

        if (cameraTrackRef.current) {
          camVideoEl = document.createElement("video");
          camVideoEl.muted = true;
          camVideoEl.playsInline = true;
          camVideoEl.srcObject = new MediaStream([cameraTrackRef.current]);
          await camVideoEl.play().catch(() => {});
        }

        canvas = document.createElement("canvas");
        canvas.width = screenVideoEl.videoWidth || 1280;
        canvas.height = screenVideoEl.videoHeight || 720;
        ctx = canvas.getContext("2d");

        const canvasStream = canvas.captureStream(30);
        const canvasTrack = canvasStream.getVideoTracks()[0];
        activeVideoTrackRef.current = canvasTrack;
        replaceVideoTrack(canvasTrack);
        drawFrame();

        if (localStreamRef.current) {
          const composed = new MediaStream([canvasTrack, ...localStreamRef.current.getAudioTracks()]);
          setStoreLocalStream(composed);
        }

        // When the user stops sharing from the browser UI, revert.
        screenTrack.onended = () => setScreenSharing(false);
      } catch {
        setScreenSharing(false); // user cancelled the picker
      }
    };

    const stop = () => {
      const cam = cameraTrackRef.current;
      activeVideoTrackRef.current = cam;
      if (cam) replaceVideoTrack(cam);
      if (localStreamRef.current) setStoreLocalStream(localStreamRef.current);
    };

    if (screenSharing) start(); else if (localStreamRef.current) stop();

    return () => {
      if (rafId) cancelAnimationFrame(rafId);
      if (displayStream) displayStream.getTracks().forEach((t) => t.stop());
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [screenSharing]);

  // ---- 4) Live captions via SpeechRecognition (best-effort) ----
  useEffect(() => {
    if (!meetingId || !token || !admitted) return;
    const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SR) return;
    const socket = getSocket();
    const { setIsTranscribing } = useRealtimeStore.getState();
    const recog = new SR();
    recog.continuous = true;
    recog.interimResults = true; // gives a live "transcribing" signal as you speak
    recog.lang = "en-US";
    let stopped = false;

    recog.onstart = () => setIsTranscribing(true);

    // Broadcast only FINAL segments (each once) so the shared transcript never
    // floods; interim results just keep the live "Transcribing…" indicator on.
    recog.onresult = (e) => {
      for (let i = e.resultIndex; i < e.results.length; i += 1) {
        const r = e.results[i];
        const text = r[0]?.transcript?.trim();
        if (text && r.isFinal && socket) socket.emit("meeting:caption", { meetingId, text });
      }
    };

    // Restart on transient errors; only give up on hard permission failures.
    recog.onerror = (e) => {
      if (["not-allowed", "service-not-allowed"].includes(e.error)) { stopped = true; setIsTranscribing(false); }
    };
    recog.onend = () => {
      if (stopped || recognitionRef.current !== recog) { setIsTranscribing(false); return; }
      // Auto-restart (Chrome ends the session after silence). Small delay avoids
      // a tight loop if the service is briefly unavailable.
      setTimeout(() => { if (!stopped && recognitionRef.current === recog) { try { recog.start(); } catch { /* noop */ } } }, 400);
    };

    try { recog.start(); recognitionRef.current = recog; } catch { /* noop */ }

    return () => {
      stopped = true;
      recognitionRef.current = null;
      setIsTranscribing(false);
      try { recog.stop(); } catch { /* noop */ }
    };
  }, [meetingId, token, admitted]);

  // Local participant descriptor for the video grid.
  return {
    localParticipant: {
      id: "local",
      name: user?.name || "You",
      stream: localStream,
      audioMuted: !audioEnabled,
      videoMuted: !videoEnabled,
      screenSharing,
      handRaised,
    },
  };
}
