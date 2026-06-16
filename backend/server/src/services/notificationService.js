import { Notification } from "../models/Notification.js";

const serialize = (n) => ({
  _id: String(n._id || n.id), id: String(n._id || n.id),
  type: n.type || "info", message: n.message, read: !!n.read, createdAt: n.createdAt,
});
const notFound = () => { const e = new Error("Notification not found."); e.status = 404; return e; };

export const list = async (userId) => {
  const items = await Notification.find({ userId });
  return { notifications: items.map(serialize).sort((a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0)) };
};
export const create = (userId, { type, message }) => Notification.create({ userId, type: type || "info", message, read: false });
export const markRead = async (userId, id) => {
  const n = await Notification.findById(id); if (!n || n.userId !== userId) throw notFound();
  return serialize(await Notification.findByIdAndUpdate(id, { read: true }, { new: true }));
};
export const markAllRead = async (userId) => {
  const items = await Notification.find({ userId, read: false });
  await Promise.all(items.map((n) => Notification.findByIdAndUpdate(n._id, { read: true })));
  return { updated: items.length };
};
export const remove = async (userId, id) => {
  const n = await Notification.findById(id); if (!n || n.userId !== userId) throw notFound();
  await Notification.findByIdAndDelete(id); return { _id: id };
};
