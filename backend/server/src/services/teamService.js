import { User } from "../models/User.js";
import { Task } from "../models/Task.js";

const member = (u) => ({
  _id: String(u._id || u.id), id: String(u._id || u.id),
  name: u.name, email: u.email, role: u.role || "member",
  department: u.department || "", isOnline: false, avatar: u.avatar || "",
});

export const members = async () => ({ members: (await User.find({})).map(member) });

export const workload = async () => {
  const users = await User.find({});
  const tasks = await Task.find({});
  return { workload: users.map((u) => ({
    ...member(u), openTasks: tasks.filter((t) => t.assignee === u.name && t.status !== "completed").length,
  })) };
};

export const presence = async () => ({ members: (await User.find({})).map((u) => ({ ...member(u), isOnline: false })) });

export const collaboration = async () => {
  const tasks = await Task.find({});
  const groups = {};
  tasks.forEach((t) => { if (t.meetingId) { groups[t.meetingId] = groups[t.meetingId] || new Set(); groups[t.meetingId].add(t.assignee); } });
  return { nodes: [...new Set(tasks.map((t) => t.assignee).filter(Boolean))].map((n) => ({ id: n, label: n })),
           edges: Object.values(groups).flatMap((s) => { const a = [...s]; return a.length > 1 ? [{ from: a[0], to: a[1] }] : []; }) };
};
