import { Meeting } from "../models/Meeting.js";
import { Task } from "../models/Task.js";
import { User } from "../models/User.js";

// GlobalSearch / AIKnowledgeSearch read `results` => array.
export const global = async (query) => {
  const q = String(query || "").toLowerCase().trim();
  if (!q) return { results: [] };
  const [meetings, tasks, users] = [await Meeting.find({}), await Task.find({}), await User.find({})];
  const results = [
    ...meetings.filter((m) => `${m.title} ${m.summary}`.toLowerCase().includes(q)).map((m) => ({ _id: String(m._id), type: "meeting", title: m.title })),
    ...tasks.filter((t) => `${t.title} ${t.description}`.toLowerCase().includes(q)).map((t) => ({ _id: String(t._id), type: "task", title: t.title })),
    ...users.filter((u) => `${u.name} ${u.email}`.toLowerCase().includes(q)).map((u) => ({ _id: String(u._id), type: "user", title: u.name })),
  ];
  return { results: results.slice(0, 50) };
};

export const knowledge = async (query) => {
  const q = String(query || "").toLowerCase().trim();
  const meetings = await Meeting.find({});
  return { results: meetings.filter((m) => m.summary && m.summary.toLowerCase().includes(q))
    .map((m) => ({ _id: String(m._id), title: m.title, snippet: (m.summary || "").slice(0, 160) })) };
};
