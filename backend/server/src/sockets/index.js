import { Server } from "socket.io";
import { verifyToken } from "../utils/jwt.js";
import { Meeting } from "../models/Meeting.js";
import { Chat } from "../models/Chat.js";
import { logger } from "../utils/logger.js";
import { setIO } from "./registry.js";
import { broadcastMeeting } from "../services/meetingService.js";

/**
 * Socket gateway with waiting room + host moderation.
 *
 * Per-room state: roster (admitted, Map<socketId,participant>), waiting
 * (Map<socketId,participant>), hosts (Set<socketId>), moderation flags.
 *
 * Join gating:
 *  - completed meeting -> meeting:join-error (no one can join)
 *  - host             -> admitted immediately; first host join flips upcoming→live
 *  - non-host         -> placed in the WAITING ROOM; hosts are notified
 *                        (meeting:knock + meeting:waiting). Host admits/denies.
 *
 * Admission signal to a client = receiving `meeting:participants` (the roster).
 * Waiting signal = `meeting:waiting-room`.
 */
export const initSockets = (server, allowedOrigins) => {
  const io = new Server(server, {
    cors: { origin: allowedOrigins, methods: ["GET", "POST"], credentials: true },
  });
  setIO(io);

  const rooms = new Map(); // roomId -> { roster, waiting, hosts, moderation }
  const completionTimers = new Map();
  const GRACE_MS = Number(process.env.COMPLETION_GRACE_MS) || 8000;

  const getRoom = (room) => {
    if (!rooms.has(room)) {
      rooms.set(room, {
        roster: new Map(),
        waiting: new Map(),
        hosts: new Set(),
        moderation: { chatEnabled: true, screenShareLocked: false },
      });
    }
    return rooms.get(room);
  };

  io.use((socket, next) => {
    const token = socket.handshake.auth?.token;
    if (!token) return next(new Error("Authentication required."));
    try { socket.user = verifyToken(token); next(); }
    catch { next(new Error("Invalid token.")); }
  });

  const resolveRoom = async (meetingId) =>
    (await Meeting.findOne({ roomId: meetingId })) ||
    (await Meeting.findById(meetingId).catch(() => null));

  const markLive = async (roomId) => {
    try {
      const m = await Meeting.findOne({ roomId });
      if (m && m.status !== "live") {
        const fresh = await Meeting.findByIdAndUpdate(m._id, { status: "live", isActive: true }, { new: true });
        if (fresh) broadcastMeeting(fresh, "meeting:updated");
      }
    } catch (e) { logger.error(`markLive failed: ${e.message}`); }
  };

  const scheduleCompletion = (room) => {
    clearTimeout(completionTimers.get(room));
    completionTimers.set(room, setTimeout(async () => {
      completionTimers.delete(room);
      const state = rooms.get(room);
      if (state && state.roster.size > 0) return;
      try {
        const m = await Meeting.findOne({ roomId: room });
        if (m && m.status === "live") {
          const fresh = await Meeting.findByIdAndUpdate(m._id, { status: "completed", isActive: false }, { new: true });
          if (fresh) broadcastMeeting(fresh, "meeting:updated");
        }
      } catch (e) { logger.error(`auto-complete failed: ${e.message}`); }
    }, GRACE_MS));
  };

  const notifyHostsWaiting = (room) => {
    const state = getRoom(room);
    const list = [...state.waiting.values()];
    state.hosts.forEach((hsid) => io.to(hsid).emit("meeting:waiting", list));
  };

  // Register an (already-authorised) socket into the live roster.
  const admitToRoom = async (socket, participant, state, m) => {
    const room = socket.data.room;
    socket.join(room);
    clearTimeout(completionTimers.get(room));
    // De-dupe by userId (reconnect / extra tab).
    for (const [sid, p] of [...state.roster.entries()]) {
      if (p.userId === participant.userId && sid !== socket.id) {
        state.roster.delete(sid);
        socket.to(room).emit("meeting:participant-left", { id: participant.userId, socketId: sid });
      }
    }
    const existing = [...state.roster.values()].filter((p) => p.socketId !== socket.id);
    socket.emit("meeting:participants", existing);
    socket.emit("meeting:moderation", state.moderation);
    state.roster.set(socket.id, participant);
    socket.to(room).emit("meeting:participant-joined", participant);
    try {
      if (m) {
        const res = await Meeting.updateOne(
          { _id: m._id, "participants.userId": { $ne: participant.userId } },
          { $push: { participants: { userId: participant.userId, name: participant.name, email: participant.email, joinedAt: new Date() } } }
        );
        if (res.modifiedCount > 0) {
          const fresh = await Meeting.findById(m._id);
          if (fresh) broadcastMeeting(fresh, "meeting:updated");
        }
        await markLive(room);
      }
    } catch (e) { logger.error(`admit persist failed: ${e.message}`); }
  };

  io.on("connection", (socket) => {
    const { userId, name, email, role } = socket.user;
    logger.info(`Socket connected: ${email} (${socket.id})`);
    if (userId) socket.join(`user:${userId}`);

    const makeParticipant = (isHost) => ({
      id: userId, userId, name: name || email, email, socketId: socket.id,
      audioMuted: false, videoMuted: false, screenSharing: false, handRaised: false, isHost,
    });

    const leaveCurrentRoom = (broadcast = true) => {
      const room = socket.data.room;
      if (!room) return;
      const state = getRoom(room);
      const wasInRoster = state.roster.delete(socket.id);
      state.waiting.delete(socket.id);
      state.hosts.delete(socket.id);
      if (broadcast && wasInRoster) {
        socket.to(room).emit("meeting:participant-left", { id: userId, socketId: socket.id });
      }
      notifyHostsWaiting(room);
      socket.leave(room);
      socket.data.room = null;
      if (state.roster.size === 0 && state.waiting.size === 0) { rooms.delete(room); scheduleCompletion(room); }
    };

    socket.on("meeting:join", async ({ meetingId }) => {
      if (!meetingId) return;
      const m = await resolveRoom(meetingId);
      if (m && m.status === "completed") { socket.emit("meeting:join-error", { reason: "completed" }); return; }
      const room = m ? m.roomId : meetingId;
      socket.data.room = room;
      const state = getRoom(room);
      const isHost = !!(role === "admin" || (m && (String(m.host) === String(userId) || String(m.creator) === String(userId))));
      socket.data.isHost = isHost;
      const participant = makeParticipant(isHost);

      if (isHost) {
        state.hosts.add(socket.id);
        await admitToRoom(socket, participant, state, m);
        socket.emit("meeting:waiting", [...state.waiting.values()]); // any pre-existing knockers
      } else {
        // Waiting room — host must admit.
        state.waiting.set(socket.id, participant);
        socket.emit("meeting:waiting-room", { title: m?.title || "Meeting" });
        state.hosts.forEach((hsid) => io.to(hsid).emit("meeting:knock", participant));
        notifyHostsWaiting(room);
      }
    });

    const requireHost = () => socket.data.isHost && socket.data.room;

    socket.on("meeting:admit", async ({ socketId }) => {
      if (!requireHost()) return;
      const room = socket.data.room;
      const state = getRoom(room);
      const participant = state.waiting.get(socketId);
      if (!participant) return;
      state.waiting.delete(socketId);
      const target = io.sockets.sockets.get(socketId);
      if (target) {
        target.data.room = room;
        const m = await resolveRoom(room);
        await admitToRoom(target, participant, state, m);
        target.emit("meeting:admitted");
      }
      notifyHostsWaiting(room);
    });

    socket.on("meeting:deny", ({ socketId }) => {
      if (!requireHost()) return;
      const state = getRoom(socket.data.room);
      if (state.waiting.delete(socketId)) io.to(socketId).emit("meeting:denied");
      notifyHostsWaiting(socket.data.room);
    });

    // Host moderation: mute / video-off / request-video / remove, per target or "all".
    socket.on("meeting:host-command", ({ type, target }) => {
      if (!requireHost()) return;
      const room = socket.data.room;
      const state = getRoom(room);
      const send = (sid) => io.to(sid).emit("meeting:command", { type, by: name || email });
      if (target === "all") {
        state.roster.forEach((p, sid) => { if (sid !== socket.id) send(sid); });
        io.to(room).emit("meeting:notice", { message: noticeFor(type, name || email, true), type: "info" });
      } else {
        if (type === "remove") {
          io.to(target).emit("meeting:removed");
          state.roster.delete(target);
          const sock = io.sockets.sockets.get(target);
          if (sock) sock.leave(room);
          io.to(room).emit("meeting:participant-left", { socketId: target });
        } else {
          send(target);
        }
      }
    });

    socket.on("meeting:set-moderation", (patch = {}) => {
      if (!requireHost()) return;
      const state = getRoom(socket.data.room);
      if (patch.chatEnabled !== undefined) state.moderation.chatEnabled = !!patch.chatEnabled;
      if (patch.screenShareLocked !== undefined) state.moderation.screenShareLocked = !!patch.screenShareLocked;
      io.to(socket.data.room).emit("meeting:moderation", state.moderation);
      const msg = patch.chatEnabled !== undefined
        ? (state.moderation.chatEnabled ? "Chat enabled by host." : "Chat disabled by host.")
        : (state.moderation.screenShareLocked ? "Screen sharing locked by host." : "Screen sharing unlocked by host.");
      io.to(socket.data.room).emit("meeting:notice", { message: msg, type: "info" });
    });

    socket.on("meeting:end-all", async () => {
      if (!requireHost()) return;
      const room = socket.data.room;
      io.to(room).emit("meeting:ended");
      try {
        const m = await Meeting.findOne({ roomId: room });
        if (m) {
          const fresh = await Meeting.findByIdAndUpdate(m._id, { status: "completed", isActive: false }, { new: true });
          if (fresh) broadcastMeeting(fresh, "meeting:updated");
        }
      } catch (e) { logger.error(`end-all failed: ${e.message}`); }
      rooms.delete(room);
    });

    socket.on("meeting:media-state", ({ audioMuted, videoMuted, screenSharing, handRaised }) => {
      const room = socket.data.room;
      if (!room) return;
      const p = getRoom(room).roster.get(socket.id);
      if (!p) return;
      if (audioMuted !== undefined) p.audioMuted = audioMuted;
      if (videoMuted !== undefined) p.videoMuted = videoMuted;
      if (screenSharing !== undefined) p.screenSharing = screenSharing;
      if (handRaised !== undefined) p.handRaised = handRaised;
      socket.to(room).emit("meeting:participant-updated", p);
    });

    socket.on("webrtc:offer", ({ to, offer }) => { if (to) io.to(to).emit("webrtc:offer", { from: socket.id, offer }); });
    socket.on("webrtc:answer", ({ to, answer }) => { if (to) io.to(to).emit("webrtc:answer", { from: socket.id, answer }); });
    socket.on("webrtc:ice", ({ to, candidate }) => { if (to) io.to(to).emit("webrtc:ice", { from: socket.id, candidate }); });

    const persistTranscript = async (room, senderName, message) => {
      try {
        const m = await Meeting.findOne({ roomId: room });
        if (m) await Meeting.updateOne({ _id: m._id }, { $push: { transcript: { senderName, message, timestamp: new Date() } } });
      } catch (e) { logger.error(`transcript persist failed: ${e.message}`); }
    };

    socket.on("meeting:chat", async ({ meetingId, content }) => {
      if (!content) return;
      const room = socket.data.room || (await resolveRoom(meetingId))?.roomId || meetingId;
      const state = getRoom(room);
      if (!state.moderation.chatEnabled && !socket.data.isHost) {
        socket.emit("meeting:notice", { message: "Chat is disabled by the host.", type: "warning" });
        return;
      }
      io.to(room).emit("meeting:transcript", {
        id: `${Date.now()}-${socket.id}`, meetingId: room,
        sender: name || email, speaker: name || email, content, text: content,
        kind: "chat", timestamp: new Date().toISOString(),
      });
      try {
        const m = await Meeting.findOne({ roomId: room });
        if (m) await Chat.create({ roomId: m.roomId, sender: { userId, name: name || email }, message: content, timestamp: new Date() });
      } catch (e) { logger.error(`chat persist failed: ${e.message}`); }
      await persistTranscript(room, name || email, content);
    });

    socket.on("meeting:caption", async ({ meetingId, text }) => {
      if (!text || !text.trim()) return;
      const room = socket.data.room || (await resolveRoom(meetingId))?.roomId || meetingId;
      io.to(room).emit("meeting:transcript", {
        id: `cap-${Date.now()}-${socket.id}`, meetingId: room,
        sender: name || email, speaker: name || email, content: text, text,
        kind: "caption", timestamp: new Date().toISOString(),
      });
      await persistTranscript(room, name || email, text);
    });

    socket.on("meeting:leave", () => leaveCurrentRoom(true));
    socket.on("disconnect", () => { leaveCurrentRoom(true); logger.info(`Socket disconnected: ${socket.id}`); });
  });

  return io;
};

const noticeFor = (type, by, all) => {
  const who = all ? "everyone" : "you";
  if (type === "mute") return `${by} muted ${who}.`;
  if (type === "video-off") return `${by} turned off ${who === "everyone" ? "everyone's" : "your"} video.`;
  if (type === "request-video") return `${by} asked ${who} to turn on video.`;
  return `${by} updated ${who}.`;
};
