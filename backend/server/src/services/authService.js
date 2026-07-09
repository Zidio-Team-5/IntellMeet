import bcrypt from "bcryptjs";
import { User } from "../models/User.js";
import { signToken } from "../utils/jwt.js";
import { buildOtpRecord, checkOtp } from "../utils/otp.js";
import { sendOtpEmail, sendAccountCreatedEmail, sendPasswordResetEmail, sendPasswordChangedEmail } from "./emailService.js";

// Shape the user object exactly as the frontend reads it (authStore.user).
export const publicUser = (u) => ({
  _id: String(u._id || u.id),
  id: String(u._id || u.id),
  name: u.name,
  email: u.email,
  avatar: u.avatar || "",
  role: u.role || "member",
  department: u.department || "",
  jobTitle: u.jobTitle || "",
  phone: u.phone || "",
  bio: u.bio || "",
  location: u.location || "",
  timezone: u.timezone || "",
  skills: u.skills || [],
  socialLinks: u.socialLinks || {},
  manager: u.manager || "",
  startDate: u.startDate || null,
  settings: u.settings || {},
  stats: u.stats || {},
  isVerified: !!u.isVerified,
  hasPassword: !!u.hasPassword,
});

const badRequest = (msg) => { const e = new Error(msg); e.status = 400; return e; };

// STEP 1 - Start signup: create (or reuse) a pending user and email an OTP.
// No token is issued here; the frontend moves to the "enter code" screen.
export const register = async ({ name, email }) => {
  if (!name || !email) throw badRequest("Name and email are required.");
  const normEmail = String(email).toLowerCase().trim();
  let user = await User.findOne({ email: normEmail });

  if (user && (user.hasPassword || user.password)) throw badRequest("Email already registered. Please log in.");

  const { code, record } = buildOtpRecord("signup");

  if (user) {
    user.name = name;
    user.otp = record;
    await user.save();
  } else {
    user = await User.create({
      name, email: normEmail, password: "", // set later in setPassword
      avatar: `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(name)}`,
      role: "member", isVerified: false, hasPassword: false, otp: record,
    });
  }

  await sendOtpEmail(normEmail, { name, code, purpose: "signup" });
  return { pendingEmail: normEmail, message: "Verification code sent to your email." };
};

export const resendOtp = async ({ email }) => {
  const normEmail = String(email || "").toLowerCase().trim();
  const user = await User.findOne({ email: normEmail });
  if (!user) throw badRequest("No pending signup found for this email.");
  if (user.hasPassword || user.password) throw badRequest("Email already registered. Please log in.");
  const { code, record } = buildOtpRecord(user.invitedBy ? "invite" : "signup");
  user.otp = record;
  await user.save();
  await sendOtpEmail(normEmail, { name: user.name, code, purpose: record.purpose });
  return { message: "A new code has been sent." };
};

// STEP 2 - Confirm the OTP. Does not issue a token; frontend proceeds to set-password.
export const verifyOtp = async ({ email, code }) => {
  const normEmail = String(email || "").toLowerCase().trim();
  const user = await User.findOne({ email: normEmail });
  if (!user) throw badRequest("No pending signup found for this email.");
  const result = checkOtp(user.otp, code);
  if (!result.ok) {
    user.otp.attempts = (user.otp.attempts || 0) + 1;
    await user.save();
    throw badRequest(result.reason);
  }
  user.isVerified = true;
  user.otp = { codeHash: "", expiresAt: null, purpose: "", attempts: 0 };
  await user.save();
  return { verified: true, email: normEmail };
};

// STEP 3 - Set the real password once verified. Issues the login token.
export const setPassword = async ({ email, password }) => {
  const normEmail = String(email || "").toLowerCase().trim();
  if (!password || password.length < 8) throw badRequest("Password must be at least 8 characters.");
  const user = await User.findOne({ email: normEmail });
  if (!user) throw badRequest("Account not found.");
  if (!user.isVerified) throw badRequest("Please verify your email first.");
  user.password = await bcrypt.hash(password, 10);
  user.hasPassword = true;
  await user.save();
  await sendAccountCreatedEmail(normEmail, { name: user.name });
  return { user: publicUser(user), token: signToken(user) };
};

// Forgot password — step 1: email a reset OTP. Always returns the same
// generic message whether or not the account exists, so this can't be used
// to enumerate registered emails.
export const forgotPassword = async ({ email }) => {
  const normEmail = String(email || "").toLowerCase().trim();
  const generic = { message: "If that email is registered, a reset code has been sent." };
  if (!normEmail) throw badRequest("Email is required.");

  const user = await User.findOne({ email: normEmail });
  if (!user || !(user.hasPassword || user.password)) return generic;

  const { code, record } = buildOtpRecord("reset");
  user.otp = record;
  await user.save();
  await sendPasswordResetEmail(normEmail, { name: user.name, code });
  return generic;
};

// Forgot password — step 2: confirm the code and set a new password.
export const resetPassword = async ({ email, code, password }) => {
  const normEmail = String(email || "").toLowerCase().trim();
  if (!password || password.length < 8) throw badRequest("Password must be at least 8 characters.");
  const user = await User.findOne({ email: normEmail });
  if (!user) throw badRequest("Invalid or expired code.");

  const result = checkOtp(user.otp, code);
  if (!result.ok || user.otp.purpose !== "reset") {
    user.otp.attempts = (user.otp.attempts || 0) + 1;
    await user.save();
    throw badRequest(result.ok ? "Invalid code." : result.reason);
  }

  user.password = await bcrypt.hash(password, 10);
  user.hasPassword = true;
  user.otp = { codeHash: "", expiresAt: null, purpose: "", attempts: 0 };
  await user.save();
  sendPasswordChangedEmail(normEmail, { name: user.name }).catch(() => {});
  return { message: "Password reset. You can now log in." };
};

export const login = async ({ email, password }) => {
  const normEmail = String(email || "").toLowerCase().trim();
  const user = await User.findOne({ email: normEmail });
  if (!user) {
    const e = new Error("No account found with this email.");
    e.status = 404; e.code = "NO_ACCOUNT";
    throw e;
  }

  // Back-compat: accounts created before this OTP flow existed have a real
  // password hash but no hasPassword/isVerified flags set. Self-heal them on
  // first successful login instead of locking existing users out.
  const legacyAccount = !user.hasPassword && !!user.password;
  if (!user.hasPassword && !legacyAccount) throw badRequest("Please finish signup - verify your email and set a password.");

  const match = await bcrypt.compare(password, user.password || "");
  if (!match) {
    const e = new Error("Incorrect password.");
    e.status = 401; e.code = "WRONG_PASSWORD";
    throw e;
  }

  if (legacyAccount) {
    user.hasPassword = true;
    user.isVerified = true;
    await user.save();
  }
  return { user: publicUser(user), token: signToken(user) };
};

export const profile = async (userId) => {
  const user = await User.findById(userId);
  if (!user) { const e = new Error("User not found."); e.status = 404; throw e; }
  return publicUser(user);
};

export const updateProfile = async (userId, body) => {
  const updates = {};
  ["name", "avatar", "department", "jobTitle", "phone", "bio", "location", "timezone", "manager"].forEach((k) => {
    if (body[k] !== undefined) updates[k] = body[k];
  });
  if (body.skills !== undefined) updates.skills = Array.isArray(body.skills) ? body.skills : String(body.skills).split(",").map((s) => s.trim()).filter(Boolean);
  if (body.socialLinks !== undefined) updates.socialLinks = { ...body.socialLinks };
  if (body.startDate !== undefined) updates.startDate = body.startDate;
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
