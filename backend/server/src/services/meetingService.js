import { Meeting } from "../models/Meeting.js";
import { Chat } from "../models/Chat.js";

const roomId = () => {
  const c = "abcdefghijklmnopqrstuvwxyz";
  const s = () => Array.from({ length: 3 }, () => c[Math.floor(Math.random() * 26)]).join("");
  return `${s()}-${s()}-${s()}`;
};

// Serialize a meeting into the exact shape frontend components read:
// _id, title, status(live|upcoming|completed), hasSummary, isRecording,
// createdAt, scheduledAt, duration, participants, transcript, summary, roomId.
export const serialize = (m) => ({
  _id: String(m._id || m.id),
  id: String(m._id || m.id),
  title: m.title,
  roomId: m.roomId,
  host: m.host,
  status: m.isActive ? "live" : "completed",
  hasSummary: !!m.summary,
  isRecording: !!m.isActive,
  summary: m.summary || "",
  participants: m.participants || [],
  transcript: m.transcript || [],
  duration: m.duration || 30,
  scheduledAt: m.scheduledAt || m.createdAt,
  createdAt: m.createdAt,
});

const resolve = async (idOrRoom) =>
  (await Meeting.findOne({ roomId: idOrRoom })) || (await Meeting.findById(idOrRoom).catch(() => null));

const notFound = () => { const e = new Error("Meeting not found."); e.status = 404; return e; };

// Indexed query: meetings the user hosts OR participates in. Uses the
// { host } and { "participants.userId" } indexes defined on the model.
export const listForUser = async (userId) => {
  const meetings = await Meeting.find({
    $or: [{ host: String(userId) }, { "participants.userId": String(userId) }],
  }).sort({ createdAt: -1 });
  return meetings.map(serialize);
};

export const history = async (userId) =>
  (await listForUser(userId)).filter((m) => m.status === "completed");

export const create = async (title, hostId) => {
  if (!title) { const e = new Error("Title is required."); e.status = 400; throw e; }
  const m = await Meeting.create({
    title, roomId: roomId(), host: String(hostId),
    participants: [], transcript: [], isActive: true, summary: "",
  });
  return serialize(m);
};

export const details = async (idOrRoom) => {
  const m = await resolve(idOrRoom); if (!m) throw notFound();
  return serialize(m);
};

export const join = async (idOrRoom, participant) => {
  const m = await resolve(idOrRoom); if (!m) throw notFound();
  if (!(m.participants || []).some((p) => p.userId === participant.userId)) {
    const updated = await Meeting.findByIdAndUpdate(
      m._id,
      { $push: { participants: { ...participant, joinedAt: new Date() } } },
      { new: true }
    );
    return serialize(updated);
  }
  return serialize(m);
};

export const leave = async (idOrRoom, userId) => {
  const m = await resolve(idOrRoom); if (!m) throw notFound();
  const updated = await Meeting.findByIdAndUpdate(
    m._id,
    { $pull: { participants: { userId: String(userId) } } },
    { new: true }
  );
  return serialize(updated);
};

export const end = async (idOrRoom) => {
  const m = await resolve(idOrRoom); if (!m) throw notFound();
  return serialize(await Meeting.findByIdAndUpdate(m._id, { isActive: false }, { new: true }));
};

export const transcript = async (idOrRoom) => {
  const m = await resolve(idOrRoom); if (!m) throw notFound();
  let entries = m.transcript || [];
  if (entries.length === 0) {
    const chats = await Chat.find({ roomId: m.roomId });
    entries = chats.map((c) => ({ sender: c.sender?.name, text: c.message, timestamp: c.timestamp }));
  }
  return entries;
};