import { Meeting } from "../models/Meeting.js";
import { Task } from "../models/Task.js";
import { User } from "../models/User.js";

const mine = (m, uid) => m.host === uid || (m.participants || []).some((p) => p.userId === uid);

export const stats = async (uid) => {
  const meetings = (await Meeting.find({})).filter((m) => mine(m, uid));
  const tasks = await Task.find({});
  const members = await User.countDocuments({});
  // Keys read by ExecutiveOverview: meetings, tasks, members, summaries
  return { stats: {
    meetings: meetings.length,
    tasks: tasks.filter((t) => t.status !== "completed").length,
    members,
    summaries: meetings.filter((m) => m.summary).length,
  } };
};

export const activity = async (uid) => {
  const meetings = (await Meeting.find({})).filter((m) => mine(m, uid))
    .sort((a, b) => new Date(b.updatedAt || b.createdAt || 0) - new Date(a.updatedAt || a.createdAt || 0))
    .slice(0, 8);
  // Keys read by ActivityFeed: id, type, text, createdAt
  return { activities: meetings.map((m, i) => ({
    id: String(m._id || i), type: "meeting",
    text: `${m.title} — ${m.isActive ? "in progress" : "completed"}`,
    createdAt: m.updatedAt || m.createdAt,
  })) };
};

export const insights = async (uid) => {
  const meetings = (await Meeting.find({})).filter((m) => mine(m, uid));
  const tasks = await Task.find({});
  const open = tasks.filter((t) => t.status !== "completed").length;
  // AIInsightsWidget expects an array of STRINGS under `insights`.
  return { insights: [
    `You have ${meetings.filter((m) => m.isActive).length} active meeting(s).`,
    `${meetings.filter((m) => m.summary).length} meeting(s) have AI summaries.`,
    `${open} open task(s) across the workspace.`,
  ] };
};

export const upcoming = async (uid) => {
  const meetings = (await Meeting.find({})).filter((m) => mine(m, uid) && m.isActive).slice(0, 5);
  // UpcomingMeetings reads: _id, title, scheduledAt, duration
  return { meetings: meetings.map((m) => ({
    _id: String(m._id), title: m.title, scheduledAt: m.createdAt, duration: 30,
  })) };
};
