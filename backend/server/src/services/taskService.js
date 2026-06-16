import { Task } from "../models/Task.js";
import { User } from "../models/User.js";
import { notify } from "./notificationService.js";

const VALID = ["todo", "in_progress", "completed"];
const notFound = () => { const e = new Error("Task not found."); e.status = 404; return e; };

// Tolerate a hyphen just in case, but canonical is underscore (frontend).
const normStatus = (s) => {
  if (!s) return undefined;
  const v = s === "in-progress" ? "in_progress" : s;
  if (!VALID.includes(v)) { const e = new Error(`Invalid status. Allowed: ${VALID.join(", ")}`); e.status = 400; throw e; }
  return v;
};


// Notify the assignee (matched by name) that a task was assigned to them.
const notifyAssignee = async (assignee, title) => {
  if (!assignee) return;
  try {
    const u = await User.findOne({ name: assignee });
    if (u) notify(u._id, { type: "task", message: `You were assigned: "${title}".` }).catch(() => {});
  } catch { /* best-effort */ }
};

const serialize = (t) => ({
  _id: String(t._id || t.id), id: String(t._id || t.id),
  meetingId: t.meetingId || "", title: t.title, description: t.description || "",
  assignee: t.assignee || "", priority: t.priority || "medium",
  status: t.status || "todo", dueDate: t.dueDate || null, createdAt: t.createdAt,
});

export const list = async () => (await Task.find({})).map(serialize);

export const get = async (id) => { const t = await Task.findById(id); if (!t) throw notFound(); return serialize(t); };

export const create = async (b) => {
  if (!b.title) { const e = new Error("Title is required."); e.status = 400; throw e; }
  const t = await Task.create({
    meetingId: b.meetingId || "", title: b.title, description: b.description || "",
    assignee: b.assignee || "", priority: b.priority || "medium",
    status: normStatus(b.status) || "todo", dueDate: b.dueDate,
  });
  if (t.assignee) notifyAssignee(t.assignee, t.title);
  return serialize(t);
};

export const update = async (id, b) => {
  const updates = {};
  if (b.title) updates.title = b.title;
  if (b.description !== undefined) updates.description = b.description;
  if (b.assignee !== undefined) updates.assignee = b.assignee;
  if (b.priority) updates.priority = b.priority;
  if (b.status) updates.status = normStatus(b.status);
  if (b.dueDate !== undefined) updates.dueDate = b.dueDate;
  const t = await Task.findByIdAndUpdate(id, updates, { new: true });
  if (!t) throw notFound();
  return serialize(t);
};

export const assign = async (id, assignee) => {
  const t = await Task.findByIdAndUpdate(id, { assignee }, { new: true });
  if (!t) throw notFound();
  notifyAssignee(assignee, t.title);
  return serialize(t);
};

export const remove = async (id) => { const t = await Task.findByIdAndDelete(id); if (!t) throw notFound(); return { _id: id, id }; };
