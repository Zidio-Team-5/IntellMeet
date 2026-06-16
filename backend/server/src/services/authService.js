import bcrypt from "bcryptjs";
import { User } from "../models/User.js";
import { signToken } from "../utils/jwt.js";

// Shape the user object exactly as the frontend reads it (authStore.user).
export const publicUser = (u) => ({
  _id: String(u._id || u.id),
  id: String(u._id || u.id),
  name: u.name,
  email: u.email,
  avatar: u.avatar || "",
  role: u.role || "member",
  department: u.department || "",
  settings: u.settings || {},
  stats: u.stats || {},
});

export const register = async ({ name, email, password, role }) => {
  if (!name || !email || !password) { const e = new Error("Name, email and password are required."); e.status = 400; throw e; }
  if (await User.findOne({ email })) { const e = new Error("Email already registered."); e.status = 400; throw e; }
  const hashed = await bcrypt.hash(password, 10);
  const user = await User.create({
    name, email, password: hashed,
    avatar: `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(name)}`,
    role: role === "admin" ? "admin" : "member",
  });
  return { user: publicUser(user), token: signToken(user) };
};

export const login = async ({ email, password }) => {
  const user = await User.findOne({ email });
  if (!user) { const e = new Error("Invalid email or password."); e.status = 400; throw e; }
  const match = await bcrypt.compare(password, user.password || "");
  if (!match) { const e = new Error("Invalid email or password."); e.status = 400; throw e; }
  return { user: publicUser(user), token: signToken(user) };
};

export const profile = async (userId) => {
  const user = await User.findById(userId);
  if (!user) { const e = new Error("User not found."); e.status = 404; throw e; }
  return publicUser(user);
};

export const updateProfile = async (userId, body) => {
  const updates = {};
  ["name", "avatar", "department"].forEach((k) => { if (body[k] !== undefined) updates[k] = body[k]; });
  if (body.password) updates.password = await bcrypt.hash(body.password, 10);
  const user = await User.findByIdAndUpdate(userId, updates, { new: true });
  return publicUser(user);
};

export const updateSettings = async (userId, settings) => {
  const cur = await User.findById(userId);
  const merged = { ...(cur?.settings || {}), ...(settings || {}) };
  const user = await User.findByIdAndUpdate(userId, { settings: merged }, { new: true });
  return publicUser(user);
};
