import { Server } from "socket.io";
import { verifyToken } from "../utils/jwt.js";
import { Meeting } from "../models/Meeting.js";
import { Chat } from "../models/Chat.js";
import { logger } from "../utils/logger.js";
import { setIO } from "./registry.js";

/**
 * Socket gateway adapted to the LOCKED frontend event vocabulary:
 *   client emits:  meeting:join {meetingId} | meeting:leave {meetingId} | meeting:chat {meetingId, content}
 *   server emits:  meeting:participant-joined (participant)
 *                  meeting:participant-left  ({ id })
 *                  meeting:transcript        (entry)
 * Handshake: io(url, { auth: { token } })  ->  verified here.
 */
export const initSockets = (server, allowedOrigins) => {
  const io = new Server(server, {
    cors: { origin: allowedOrigins, methods: ["GET", "POST"], credentials: true },
  });

  // JWT handshake — reject any socket without a valid token.
  setIO(io);

  io.use((socket, next) => {
    const token = socket.handshake.auth?.token;
    if (!token) return next(new Error("Authentication required."));
    try {
      socket.user = verifyToken(token);
      next();
    } catch {
      next(new Error("Invalid token."));
    }
  });

  io.on("connection", (socket) => {
    const { userId, name, email } = socket.user;
    logger.info(`Socket connected: ${email} (${socket.id})`);
    if (userId) socket.join(`user:${userId}`); // enables targeted notifications

    const resolveRoom = async (meetingId) =>
      (await Meeting.findOne({ roomId: meetingId })) ||
      (await Meeting.findById(meetingId).catch(() => null));

    socket.on("meeting:join", async ({ meetingId }) => {
      if (!meetingId) return;
      socket.join(meetingId);
      const participant = { id: userId, userId, name: name || email, email, socketId: socket.id };
      // Notify others in the room (frontend listens for meeting:participant-joined).
      socket.to(meetingId).emit("meeting:participant-joined", participant);
      try {
        const m = await resolveRoom(meetingId);
        if (m && !(m.participants || []).some((p) => p.userId === userId)) {
          await Meeting.updateOne(
            { _id: m._id },
            { $push: { participants: { userId, name: name || email, email, joinedAt: new Date() } } }
          );
        }
      } catch (e) {
        logger.error(`join persist failed: ${e.message}`);
      }
    });

    socket.on("meeting:chat", async ({ meetingId, content }) => {
      if (!meetingId || !content) return;
      const entry = {
        id: `${Date.now()}-${socket.id}`,
        meetingId,
        sender: name || email,
        content,
        text: content,
        timestamp: new Date().toISOString(),
      };
      // Broadcast to everyone in the room (frontend listens for meeting:transcript).
      io.to(meetingId).emit("meeting:transcript", entry);
      try {
        const m = await resolveRoom(meetingId);
        if (m) {
          await Chat.create({
            roomId: m.roomId,
            sender: { userId, name: name || email },
            message: content,
            timestamp: new Date(),
          });
          await Meeting.updateOne(
            { _id: m._id },
            { $push: { transcript: { senderName: name || email, message: content, timestamp: new Date() } } }
          );
        }
      } catch (e) {
        logger.error(`chat persist failed: ${e.message}`);
      }
    });

    socket.on("meeting:leave", ({ meetingId }) => {
      if (!meetingId) return;
      socket.leave(meetingId);
      socket.to(meetingId).emit("meeting:participant-left", { id: userId });
    });

    socket.on("disconnect", () => {
      for (const room of socket.rooms) {
        if (room !== socket.id) socket.to(room).emit("meeting:participant-left", { id: userId });
      }
      logger.info(`Socket disconnected: ${socket.id}`);
    });
  });

  return io;
};