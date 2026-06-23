import { Meeting } from "../models/Meeting.js";
import { Chat } from "../models/Chat.js";
import { User } from "../models/User.js";
import { notify } from "./notificationService.js";
import { emitToUser } from "../sockets/registry.js";

const roomId = () => {
  const c = "abcdefghijklmnopqrstuvwxyz";
  const s = () => Array.from({ length: 3 }, () => c[Math.floor(Math.random() * 26)]).join("");
  return `${s()}-${s()}-${s()}`;
};

// Generate a roomId guaranteed unique against the collection (defensive against
// the tiny but non-zero collision chance of 26^9 space).
const uniqueRoomId = async () => {
  for (let i = 0; i < 5; i += 1) {
    const candidate = roomId();
    if (!(await Meeting.exists({ roomId: candidate }))) return candidate;
  }
  return `${roomId()}-${Date.now().toString(36).slice(-3)}`;
};

// Base URL the shareable link is built from. Prefer an explicit CLIENT_URL,
// fall back to the first configured CORS origin, then localhost.
const clientBase = () => {
  const explicit = process.env.CLIENT_URL && process.env.CLIENT_URL.trim();
  if (explicit) return explicit.replace(/\/$/, "");
  const cors = (process.env.CORS_ORIGINS || "").split(",").map((s) => s.trim()).filter(Boolean);
  if (cors.length && cors[0] !== "*") return cors[0].replace(/\/$/, "");
  return "http://localhost:3000";
};

const deriveStatus = (m) => {
  if (m.status) return m.status;
  if (!m.isActive) return "completed";
  if (m.scheduledAt && new Date(m.scheduledAt).getTime() > Date.now()) return "upcoming";
  return "live";
};

// Serialize a meeting into the exact shape frontend components read, PLUS the
// new ownership/share fields. Existing keys are preserved unchanged.
export const serialize = (m) => {
  const id = String(m._id || m.id);
  const status = deriveStatus(m);
  const joinPath = `/meeting/${m.roomId}`;
  return {
    _id: id,
    id,
    meetingId: m.roomId, // explicit, shareable identifier
    roomId: m.roomId,
    title: m.title,
    description: m.description || "",
    host: m.host,
    creator: m.creator || m.host,
    status, // live | upcoming | completed | cancelled
    visibility: m.visibility || "invite",
    hasSummary: !!m.summary,
    isRecording: status === "live" && !!m.isActive,
    isActive: !!m.isActive,
    summary: m.summary || "",
    actionItems: m.actionItems || [],
    members: m.members || [],
    participants: m.participants || [],
    invitedUsers: m.invitedUsers || [],
    transcript: m.transcript || [],
    duration: m.duration || 30,
    scheduledAt: m.scheduledAt || m.createdAt,
    createdAt: m.createdAt,
    updatedAt: m.updatedAt,
    joinPath,
    shareUrl: `${clientBase()}${joinPath}`,
  };
};

const resolve = async (idOrRoom) =>
  (await Meeting.findOne({ roomId: idOrRoom })) || (await Meeting.findById(idOrRoom).catch(() => null));

const notFound = () => { const e = new Error("Meeting not found."); e.status = 404; return e; };
const forbidden = (msg = "You do not have permission for this meeting.") => { const e = new Error(msg); e.status = 403; return e; };

// Every userId that should "see" this meeting in their list / get realtime pings.
const stakeholderIds = (m) => {
  const ids = new Set();
  if (m.host) ids.add(String(m.host));
  if (m.creator) ids.add(String(m.creator));
  (m.members || []).forEach((x) => x.userId && ids.add(String(x.userId)));
  (m.participants || []).forEach((x) => x.userId && ids.add(String(x.userId)));
  (m.invitedUsers || []).forEach((x) => x.userId && ids.add(String(x.userId)));
  return [...ids];
};

// Push a realtime event about this meeting to every stakeholder's user room.
// Best-effort: never throws into the request path.
export const broadcastMeeting = (m, event = "meeting:updated") => {
  try {
    const payload = serialize(m);
    stakeholderIds(m).forEach((uid) => emitToUser(uid, event, payload));
  } catch {
    /* realtime is best-effort */
  }
};

const isOwner = (m, userId) => String(m.host) === String(userId) || String(m.creator) === String(userId);
const isMember = (m, userId) =>
  isOwner(m, userId) ||
  (m.members || []).some((x) => String(x.userId) === String(userId)) ||
  (m.participants || []).some((x) => String(x.userId) === String(userId));

// Indexed query: meetings the user owns, is a member/participant of, OR is
// invited to. This is what makes a meeting visible cross-user.
export const listForUser = async (userId) => {
  const uid = String(userId);
  const user = await User.findById(uid).catch(() => null);
  const email = user?.email;
  const or = [
    { host: uid },
    { creator: uid },
    { "members.userId": uid },
    { "participants.userId": uid },
    { "invitedUsers.userId": uid },
    { visibility: "public" },
  ];
  if (email) or.push({ "invitedUsers.email": email });
  const meetings = await Meeting.find({ $or: or }).sort({ createdAt: -1 });
  return meetings.map(serialize);
};

export const history = async (userId) =>
  (await listForUser(userId)).filter((m) => m.status === "completed");

export const create = async (payload, hostId) => {
  const data = typeof payload === "string" ? { title: payload } : (payload || {});
  const title = (data.title || "").trim();
  if (!title) { const e = new Error("Title is required."); e.status = 400; throw e; }

  const host = await User.findById(hostId).catch(() => null);
  const scheduledAt = data.scheduledAt ? new Date(data.scheduledAt) : null;
  const isScheduledFuture = scheduledAt && scheduledAt.getTime() > Date.now() + 60 * 1000;
  const duration = Number(data.duration) > 0 ? Number(data.duration) : 30;
  const visibility = ["private", "invite", "public"].includes(data.visibility) ? data.visibility : "invite";

  const m = await Meeting.create({
    title,
    description: data.description || "",
    roomId: await uniqueRoomId(),
    host: String(hostId),
    creator: String(hostId),
    members: host
      ? [{ userId: String(hostId), name: host.name, email: host.email, role: "host" }]
      : [{ userId: String(hostId), role: "host" }],
    participants: [],
    invitedUsers: [],
    visibility,
    status: isScheduledFuture ? "upcoming" : "live",
    isActive: !isScheduledFuture,
    scheduledAt: scheduledAt || new Date(),
    duration,
    transcript: [],
    summary: "",
  });

  // Process any invitations supplied at creation time.
  const invites = normalizeInvites(data.invites || data.invitedUsers || data.emails);
  if (invites.length) await applyInvites(m, invites, host);

  notify(hostId, { type: "meeting", message: `Meeting "${title}" is ready. ID ${m.roomId}.` }).catch(() => {});
  broadcastMeeting(m, "meeting:created");
  return serialize(m);
};

export const details = async (idOrRoom) => {
  const m = await resolve(idOrRoom); if (!m) throw notFound();
  return serialize(m);
};

export const update = async (idOrRoom, userId, patch = {}) => {
  const m = await resolve(idOrRoom); if (!m) throw notFound();
  if (!isOwner(m, userId)) throw forbidden("Only the meeting host can edit this meeting.");
  const updates = {};
  if (patch.title !== undefined && String(patch.title).trim()) updates.title = String(patch.title).trim();
  if (patch.description !== undefined) updates.description = patch.description;
  if (patch.duration !== undefined && Number(patch.duration) > 0) updates.duration = Number(patch.duration);
  if (patch.scheduledAt !== undefined) updates.scheduledAt = new Date(patch.scheduledAt);
  if (patch.visibility !== undefined && ["private", "invite", "public"].includes(patch.visibility)) updates.visibility = patch.visibility;
  if (patch.status !== undefined && ["upcoming", "live", "completed", "cancelled"].includes(patch.status)) {
    updates.status = patch.status;
    updates.isActive = patch.status === "live";
  }
  const updated = await Meeting.findByIdAndUpdate(m._id, updates, { new: true });
  broadcastMeeting(updated, "meeting:updated");
  return serialize(updated);
};

export const remove = async (idOrRoom, userId) => {
  const m = await resolve(idOrRoom); if (!m) throw notFound();
  if (!isOwner(m, userId)) throw forbidden("Only the meeting host can delete this meeting.");
  const snapshot = m.toObject ? m.toObject() : m;
  await Meeting.findByIdAndDelete(m._id);
  broadcastMeeting(snapshot, "meeting:deleted");
  return { _id: String(m._id), deleted: true };
};

const normalizeInvites = (raw) => {
  if (!raw) return [];
  let list = raw;
  if (typeof raw === "string") list = raw.split(/[,\s;]+/);
  if (!Array.isArray(list)) list = [list];
  return list
    .map((x) => (typeof x === "string" ? { email: x } : x))
    .map((x) => ({
      email: (x.email || "").trim().toLowerCase(),
      userId: x.userId ? String(x.userId) : undefined,
      name: x.name,
    }))
    .filter((x) => x.email || x.userId);
};

// Resolve invites against existing users, append (de-duped) to the meeting,
// notify each invitee, and push a realtime list update to them.
const applyInvites = async (m, invites, inviter) => {
  const existing = new Set((m.invitedUsers || []).map((i) => (i.email || i.userId || "").toLowerCase()));
  const toAdd = [];
  for (const inv of invites) {
    const key = (inv.email || inv.userId || "").toLowerCase();
    if (!key || existing.has(key)) continue;
    let { userId, name, email } = inv;
    if (!userId && email) {
      const u = await User.findOne({ email }).catch(() => null);
      if (u) { userId = String(u._id); name = name || u.name; email = u.email; }
    }
    toAdd.push({ userId, email, name, status: "pending", invitedAt: new Date() });
    existing.add(key);
  }
  if (!toAdd.length) return m;
  const updated = await Meeting.findByIdAndUpdate(
    m._id,
    { $push: { invitedUsers: { $each: toAdd } } },
    { new: true }
  );
  // Notify resolved invitees so their dashboard updates instantly.
  for (const inv of toAdd) {
    if (inv.userId) {
      notify(inv.userId, {
        type: "meeting",
        message: `${inviter?.name || "Someone"} invited you to "${updated.title}".`,
      }).catch(() => {});
      emitToUser(inv.userId, "meeting:created", serialize(updated));
    }
  }
  // Mutate caller's reference so subsequent broadcasts include the invitees.
  m.invitedUsers = updated.invitedUsers;
  return updated;
};

export const invite = async (idOrRoom, userId, rawInvites) => {
  const m = await resolve(idOrRoom); if (!m) throw notFound();
  if (!isMember(m, userId)) throw forbidden("Only meeting members can invite others.");
  const invites = normalizeInvites(rawInvites);
  if (!invites.length) { const e = new Error("Provide at least one email to invite."); e.status = 400; throw e; }
  const inviter = await User.findById(userId).catch(() => null);
  const updated = await applyInvites(m, invites, inviter) || m;
  broadcastMeeting(updated, "meeting:updated");
  return serialize(updated);
};

export const join = async (idOrRoom, participant) => {
  const m = await resolve(idOrRoom); if (!m) throw notFound();
  if (m.status === "completed") throw forbidden("This meeting has ended.");
  // Visibility gate: private meetings require ownership/membership/invitation.
  if (m.visibility === "private" && !isMember(m, participant.userId) &&
      !(m.invitedUsers || []).some((i) => String(i.userId) === String(participant.userId) || i.email === participant.email)) {
    throw forbidden("This meeting is private.");
  }

  const updates = {};
  if (!(m.participants || []).some((p) => String(p.userId) === String(participant.userId))) {
    updates.$push = { participants: { ...participant, joinedAt: new Date() } };
  }
  if (!(m.members || []).some((x) => String(x.userId) === String(participant.userId))) {
    updates.$push = {
      ...(updates.$push || {}),
      members: { userId: String(participant.userId), name: participant.name, email: participant.email, role: "member" },
    };
  }
  // Mark a pending invite for this user as accepted.
  let didAcceptInvite = false;
  (m.invitedUsers || []).forEach((i) => {
    if ((String(i.userId) === String(participant.userId) || i.email === participant.email) && i.status === "pending") {
      didAcceptInvite = true;
    }
  });

  let updated = m;
  if (Object.keys(updates).length) {
    updated = await Meeting.findByIdAndUpdate(m._id, updates, { new: true });
  }
  if (didAcceptInvite) {
    await Meeting.updateOne(
      { _id: m._id },
      { $set: { "invitedUsers.$[el].status": "accepted" } },
      { arrayFilters: [{ $or: [{ "el.userId": String(participant.userId) }, { "el.email": participant.email }] }] }
    );
    updated = await Meeting.findById(m._id);
  }
  broadcastMeeting(updated, "meeting:updated");
  return serialize(updated);
};

export const leave = async (idOrRoom, userId) => {
  const m = await resolve(idOrRoom); if (!m) throw notFound();
  // NOTE: `participants` is the attendance record — everyone who ever joined —
  // so the meetings list can show "people who joined", not just who's currently
  // connected. Live presence is tracked separately by the socket roster, so we
  // deliberately do NOT remove the user here. We still broadcast so any view
  // that derives state from the meeting can refresh.
  void userId;
  broadcastMeeting(m, "meeting:updated");
  return serialize(m);
};

export const end = async (idOrRoom, userId) => {
  const m = await resolve(idOrRoom); if (!m) throw notFound();
  if (userId && !isOwner(m, userId)) throw forbidden("Only the meeting host can end this meeting.");
  const ended = await Meeting.findByIdAndUpdate(
    m._id,
    { isActive: false, status: "completed" },
    { new: true }
  );
  if (ended?.summary) notify(ended.host, { type: "ai", message: `AI summary ready for "${ended.title}".` }).catch(() => {});
  broadcastMeeting(ended, "meeting:updated");
  return serialize(ended);
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

// Build a plain-text transcript from persisted transcript entries (+ chat
// fallback) for feeding the AI summarizer.
const transcriptText = async (m) => {
  let entries = m.transcript || [];
  if (!entries.length) {
    const chats = await Chat.find({ roomId: m.roomId });
    entries = chats.map((c) => ({ senderName: c.sender?.name, message: c.message }));
  }
  return entries.map((e) => `${e.senderName || e.sender || "Speaker"}: ${e.message || e.text || ""}`).join("\n");
};

// Generate AI meeting notes/minutes (summary + action items), persist them on
// the meeting, and broadcast the update so every participant's view refreshes.
export const generateNotes = async (idOrRoom, userId) => {
  const m = await resolve(idOrRoom); if (!m) throw notFound();
  if (userId && !isMember(m, userId)) throw forbidden("Only meeting members can generate notes.");
  const text = await transcriptText(m);
  const { summarize } = await import("./aiService.js");
  const result = await summarize(text);
  const updated = await Meeting.findByIdAndUpdate(
    m._id,
    { summary: result.summary || "", actionItems: result.actionItems || [] },
    { new: true }
  );
  notify(updated.host, { type: "ai", message: `AI notes ready for "${updated.title}".` }).catch(() => {});
  broadcastMeeting(updated, "meeting:updated");
  return { summary: updated.summary, actionItems: updated.actionItems, meeting: serialize(updated) };
};
