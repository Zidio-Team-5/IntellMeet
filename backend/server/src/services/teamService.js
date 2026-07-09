import { User } from "../models/User.js";
import { Task } from "../models/Task.js";
import { buildOtpRecord } from "../utils/otp.js";
import { sendOtpEmail, sendRoleChangedEmail, sendMemberRemovedEmail } from "./emailService.js";
import { notify } from "./notificationService.js";

const member = (u) => ({
  _id: String(u._id || u.id), id: String(u._id || u.id),
  name: u.name, email: u.email, role: u.role || "member",
  department: u.department || "", isOnline: false, avatar: u.avatar || "",
  isVerified: !!u.isVerified, hasPassword: !!u.hasPassword,
});

const notFound = () => { const e = new Error("Member not found."); e.status = 404; return e; };
const badRequest = (msg) => { const e = new Error(msg); e.status = 400; return e; };

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

// --- Admin actions ---

// Promote a member to admin.
export const promote = async (targetId, actingAdminId) => {
  const u = await User.findById(targetId);
  if (!u) throw notFound();
  if (u.role === "admin") return { member: member(u) };
  u.role = "admin";
  await u.save();
  await notify(u._id, { type: "role", message: "You were promoted to admin." }).catch(() => {});
  sendRoleChangedEmail(u.email, { name: u.name, newRole: "admin" }).catch(() => {});
  return { member: member(u) };
};

// Demote an admin back to member. Prevents removing the last remaining admin.
export const demote = async (targetId, actingAdminId) => {
  const u = await User.findById(targetId);
  if (!u) throw notFound();
  if (u.role === "member") return { member: member(u) };
  if (String(u._id) === String(actingAdminId)) throw badRequest("You can't demote yourself.");
  const adminCount = await User.countDocuments({ role: "admin" });
  if (adminCount <= 1) throw badRequest("Cannot demote the only remaining admin.");
  u.role = "member";
  await u.save();
  await notify(u._id, { type: "role", message: "You were moved from admin to member." }).catch(() => {});
  sendRoleChangedEmail(u.email, { name: u.name, newRole: "member" }).catch(() => {});
  return { member: member(u) };
};

// Admin adds a new member/admin by email. Creates a pending (unverified,
// no-password) account and emails them an invite OTP; they complete signup
// via the normal verify-otp -> set-password flow.
export const addMember = async ({ name, email, role }, actingAdminId) => {
  if (!name || !email) throw badRequest("Name and email are required.");
  const normEmail = String(email).toLowerCase().trim();
  const existing = await User.findOne({ email: normEmail });
  if (existing && (existing.hasPassword || existing.password)) throw badRequest("A user with this email already exists.");

  const { code, record } = buildOtpRecord("invite");
  const finalRole = role === "admin" ? "admin" : "member";

  let u;
  if (existing) {
    existing.name = name;
    existing.role = finalRole;
    existing.otp = record;
    existing.invitedBy = String(actingAdminId);
    u = await existing.save();
  } else {
    u = await User.create({
      name, email: normEmail, password: "",
      avatar: `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(name)}`,
      role: finalRole, isVerified: false, hasPassword: false,
      invitedBy: String(actingAdminId), otp: record,
    });
  }
  await sendOtpEmail(normEmail, { name, code, purpose: "invite" });
  return { member: member(u) };
};

// Admin removes a member or admin. Prevents removing the last admin / self-removal.
export const removeMember = async (targetId, actingAdminId) => {
  const u = await User.findById(targetId);
  if (!u) throw notFound();
  if (String(u._id) === String(actingAdminId)) throw badRequest("You can't remove your own account.");
  if (u.role === "admin") {
    const adminCount = await User.countDocuments({ role: "admin" });
    if (adminCount <= 1) throw badRequest("Cannot remove the only remaining admin.");
  }
  await User.findByIdAndDelete(targetId);
  sendMemberRemovedEmail(u.email, { name: u.name }).catch(() => {});
  return { _id: targetId, removed: true };
};
