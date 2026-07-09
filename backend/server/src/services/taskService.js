import { Task } from "../models/Task.js";
import { User } from "../models/User.js";
import { notify } from "./notificationService.js";
import { sendTaskAssignedEmail } from "./emailService.js";

const VALID = ["todo", "in_progress", "completed"];
const notFound = () => { const e = new Error("Task not found."); e.status = 404; return e; };

// Tolerate a hyphen just in case, but canonical is underscore (frontend).
const normStatus = (s) => {
  if (!s) return undefined;
  const v = s === "in-progress" ? "in_progress" : s;
  if (!VALID.includes(v)) { const e = new Error(`Invalid status. Allowed: ${VALID.join(", ")}`); e.status = 400; throw e; }
  return v;
};

// Normalize whatever shape the caller sent (single assignee/assigneeId,
// arrays of either, or both) into consistent { names, ids } arrays.
const normalizeAssignees = async (b) => {
  const ids = new Set([
    ...(Array.isArray(b.assigneeIds) ? b.assigneeIds : []),
    ...(b.assigneeId ? [b.assigneeId] : []),
  ].filter(Boolean));
  const namesFromBody = new Set([
    ...(Array.isArray(b.assignees) ? b.assignees : []),
    ...(b.assignee ? [b.assignee] : []),
  ].filter(Boolean));

  const users = ids.size ? await User.find({ _id: { $in: [...ids] } }) : [];
  const resolvedNames = users.map((u) => u.name);
  const allNames = new Set([...namesFromBody, ...resolvedNames]);

  // Best-effort: resolve any name-only assignees (legacy path) to ids too, so
  // notifications/emails still fire for them.
  if (namesFromBody.size) {
    const byName = await User.find({ name: { $in: [...namesFromBody] } });
    byName.forEach((u) => ids.add(String(u._id)));
  }

  return { names: [...allNames], ids: [...ids] };
};

// Notify every assignee (in-app + email) that a task was assigned to them.
const notifyAssignees = async (ids, title, priority) => {
  await Promise.all(ids.map(async (id) => {
    try {
      const u = await User.findById(id);
      if (!u) return;
      notify(u._id, { type: "task", message: `You were assigned: "${title}".` }).catch(() => {});
      sendTaskAssignedEmail(u.email, { name: u.name, taskTitle: title, priority }).catch(() => {});
    } catch { /* best-effort */ }
  }));
};

const serialize = (t) => {
  const assignees = t.assignees?.length ? t.assignees : (t.assignee ? [t.assignee] : []);
  return {
    _id: String(t._id || t.id), id: String(t._id || t.id),
    meetingId: t.meetingId || "", title: t.title, description: t.description || "",
    assignee: assignees[0] || "", assignees, assigneeIds: t.assigneeIds || [],
    priority: t.priority || "medium",
    status: t.status || "todo", dueDate: t.dueDate || null, createdAt: t.createdAt,
  };
};

export const list = async () => (await Task.find({})).map(serialize);

export const get = async (id) => { const t = await Task.findById(id); if (!t) throw notFound(); return serialize(t); };

export const create = async (b) => {
  if (!b.title) { const e = new Error("Title is required."); e.status = 400; throw e; }
  const { names, ids } = await normalizeAssignees(b);
  const t = await Task.create({
    meetingId: b.meetingId || "", title: b.title, description: b.description || "",
    assignee: names[0] || "", assignees: names, assigneeIds: ids,
    priority: b.priority || "medium",
    status: normStatus(b.status) || "todo", dueDate: b.dueDate,
  });
  if (ids.length) notifyAssignees(ids, t.title, t.priority);
  return serialize(t);
};

export const update = async (id, b) => {
  const updates = {};
  if (b.title) updates.title = b.title;
  if (b.description !== undefined) updates.description = b.description;
  if (b.priority) updates.priority = b.priority;
  if (b.status) updates.status = normStatus(b.status);
  if (b.dueDate !== undefined) updates.dueDate = b.dueDate;

  let newlyAddedIds = [];
  if (b.assignee !== undefined || b.assignees !== undefined || b.assigneeIds !== undefined || b.assigneeId !== undefined) {
    const existing = await Task.findById(id);
    if (!existing) throw notFound();
    const { names, ids } = await normalizeAssignees(b);
    updates.assignee = names[0] || "";
    updates.assignees = names;
    updates.assigneeIds = ids;
    newlyAddedIds = ids.filter((i) => !(existing.assigneeIds || []).includes(i));
  }

  const t = await Task.findByIdAndUpdate(id, updates, { new: true });
  if (!t) throw notFound();
  if (newlyAddedIds.length) notifyAssignees(newlyAddedIds, t.title, t.priority);
  return serialize(t);
};

// Assign (or reassign) a task to one or more people. Accepts the same
// flexible shape as create/update.
export const assign = async (id, body) => {
  const existing = await Task.findById(id);
  if (!existing) throw notFound();
  const { names, ids } = await normalizeAssignees(body);
  const t = await Task.findByIdAndUpdate(
    id,
    { assignee: names[0] || "", assignees: names, assigneeIds: ids },
    { new: true }
  );
  const newlyAddedIds = ids.filter((i) => !(existing.assigneeIds || []).includes(i));
  notifyAssignees(newlyAddedIds.length ? newlyAddedIds : ids, t.title, t.priority);
  return serialize(t);
};

export const remove = async (id) => { const t = await Task.findByIdAndDelete(id); if (!t) throw notFound(); return { _id: id, id }; };
