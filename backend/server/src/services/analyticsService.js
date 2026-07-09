import { Meeting } from "../models/Meeting.js";
import { Task } from "../models/Task.js";
import { User } from "../models/User.js";

export const overview = async () => {
  const meetings = await Meeting.find({});
  const tasks = await Task.find({});
  const users = await User.find({});

  const withDuration = meetings.filter((m) => m.duration);
  const avgDurationMin = withDuration.length
    ? Math.round(withDuration.reduce((sum, m) => sum + (m.duration || 0), 0) / withDuration.length)
    : 0;

  // Utilization = share of members who have participated in at least one meeting.
  const participantIds = new Set(meetings.flatMap((m) => (m.participants || []).map((p) => p.userId)));
  const utilizationPct = users.length ? Math.round((participantIds.size / users.length) * 100) : 0;

  const done = tasks.filter((t) => t.status === "completed").length;
  const prod = tasks.length ? Math.round((done / tasks.length) * 100) : 0;

  return { stats: {
    totalMeetings: meetings.length,
    avgDuration: `${avgDurationMin} min`,
    utilization: `${utilizationPct}%`,
    productivity: String(prod || 0),
  } };
};

export const productivity = async () => {
  // ProductivityMetrics reads `weekly` => [{ week, score, tasks }]
  const tasks = await Task.find({});
  const now = Date.now();
  const WEEK_MS = 7 * 24 * 60 * 60 * 1000;
  // Bucket tasks into the last 6 real calendar weeks by createdAt.
  const weeks = Array.from({ length: 6 }, (_, i) => {
    const start = now - (6 - i) * WEEK_MS;
    const end = start + WEEK_MS;
    const inWeek = tasks.filter((t) => {
      const t0 = new Date(t.createdAt || 0).getTime();
      return t0 >= start && t0 < end;
    });
    const completed = inWeek.filter((t) => t.status === "completed").length;
    const score = inWeek.length ? Math.round((completed / inWeek.length) * 100) : 0;
    return { week: `W${i + 1}`, score, tasks: inWeek.length };
  });
  return { weekly: weeks };
};

export const teamPerformance = async () => {
  // TeamPerformance reads `teams` => [{ name, score, meetings, tasks }]
  const tasks = await Task.find({});
  const meetings = await Meeting.find({});
  const byAssignee = {};
  tasks.forEach((t) => {
    const names = t.assignees?.length ? t.assignees : (t.assignee ? [t.assignee] : ["Unassigned"]);
    names.forEach((k) => {
      byAssignee[k] = byAssignee[k] || { name: k, tasksTotal: 0, tasksDone: 0, meetings: 0 };
      byAssignee[k].tasksTotal += 1;
      if (t.status === "completed") byAssignee[k].tasksDone += 1;
    });
  });
  meetings.forEach((m) => {
    (m.participants || []).forEach((p) => {
      const k = p.name || "Unassigned";
      byAssignee[k] = byAssignee[k] || { name: k, tasksTotal: 0, tasksDone: 0, meetings: 0 };
      byAssignee[k].meetings += 1;
    });
  });
  const teams = Object.values(byAssignee).map((t) => ({
    name: t.name,
    score: t.tasksTotal ? Math.round((t.tasksDone / t.tasksTotal) * 100) : 80,
    meetings: t.meetings,
    tasks: t.tasksTotal,
  })).slice(0, 8);
  return { teams: teams.length ? teams : [{ name: "No data yet", score: 0, meetings: 0, tasks: 0 }] };
};

export const meetingInsights = async () => {
  const meetings = await Meeting.find({});
  return { stats: {
    total: meetings.length,
    withSummary: meetings.filter((m) => m.summary).length,
    avgParticipants: meetings.length ? Math.round(meetings.reduce((a, m) => a + (m.participants?.length || 0), 0) / meetings.length) : 0,
  } };
};

export const knowledge = async () => {
  const meetings = await Meeting.find({});
  return { stats: { summarized: meetings.filter((m) => m.summary).length, total: meetings.length } };
};
