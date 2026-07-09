import { google } from "googleapis";
import { Readable } from "stream";
import { User } from "../models/User.js";
import { logger } from "../utils/logger.js";

/**
 * Per-user Google Drive connection. Each user connects their own Google
 * account (OAuth2, Drive scope only — never sees other files); recordings
 * for meetings they host upload to their own Drive, and we store a shareable
 * link on the Meeting document.
 *
 * Required env vars:
 *   GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET — from a Google Cloud OAuth
 *   client (Web application type).
 *   GOOGLE_REDIRECT_URI — must exactly match an authorized redirect URI on
 *   that OAuth client, e.g. https://your-backend.onrender.com/api/drive/oauth/callback
 *
 * Without these, Drive features are simply unavailable (routes return a
 * clear "not configured" error) — nothing else breaks.
 */
const isConfigured = () => !!(process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET && process.env.GOOGLE_REDIRECT_URI);

const buildOAuthClient = () => new google.auth.OAuth2(
  process.env.GOOGLE_CLIENT_ID,
  process.env.GOOGLE_CLIENT_SECRET,
  process.env.GOOGLE_REDIRECT_URI
);

const SCOPES = ["https://www.googleapis.com/auth/drive.file", "https://www.googleapis.com/auth/userinfo.email"];

export const getAuthUrl = (state) => {
  if (!isConfigured()) { const e = new Error("Google Drive isn't configured on this server yet."); e.status = 501; throw e; }
  const client = buildOAuthClient();
  return client.generateAuthUrl({ access_type: "offline", prompt: "consent", scope: SCOPES, state });
};

export const handleCallback = async (code, userId) => {
  if (!isConfigured()) { const e = new Error("Google Drive isn't configured on this server yet."); e.status = 501; throw e; }
  const client = buildOAuthClient();
  const { tokens } = await client.getToken(code);
  client.setCredentials(tokens);

  const oauth2 = google.oauth2({ auth: client, version: "v2" });
  const { data: profile } = await oauth2.userinfo.get();

  await User.findByIdAndUpdate(userId, {
    googleDrive: {
      connected: true,
      accessToken: tokens.access_token || "",
      refreshToken: tokens.refresh_token || "", // prompt:"consent" in getAuthUrl guarantees Google returns one each time
      expiryDate: tokens.expiry_date || 0,
      email: profile.email || "",
    },
  });
  return { email: profile.email };
};

export const disconnect = async (userId) => {
  await User.findByIdAndUpdate(userId, { googleDrive: { connected: false, accessToken: "", refreshToken: "", expiryDate: 0, email: "" } });
  return { disconnected: true };
};

export const status = async (userId) => {
  const user = await User.findById(userId);
  return { connected: !!user?.googleDrive?.connected, email: user?.googleDrive?.email || "" };
};

// Build an authenticated client for this user, refreshing + persisting a new
// access token if the stored one has expired.
const getUserDriveClient = async (userId) => {
  const user = await User.findById(userId);
  if (!user?.googleDrive?.connected || !user.googleDrive.refreshToken) {
    const e = new Error("This user hasn't connected Google Drive.");
    e.status = 400;
    throw e;
  }
  const client = buildOAuthClient();
  client.setCredentials({
    access_token: user.googleDrive.accessToken,
    refresh_token: user.googleDrive.refreshToken,
    expiry_date: user.googleDrive.expiryDate,
  });
  client.on("tokens", async (tokens) => {
    const updates = {};
    if (tokens.access_token) updates["googleDrive.accessToken"] = tokens.access_token;
    if (tokens.expiry_date) updates["googleDrive.expiryDate"] = tokens.expiry_date;
    if (Object.keys(updates).length) await User.findByIdAndUpdate(userId, updates).catch(() => {});
  });
  return client;
};

// Upload a recording buffer to the host's Drive, make it link-viewable, and
// return the shareable link.
export const uploadRecording = async (userId, { filename, mimeType, buffer }) => {
  const client = await getUserDriveClient(userId);
  const drive = google.drive({ version: "v3", auth: client });

  const { data: file } = await drive.files.create({
    requestBody: { name: filename, mimeType },
    media: { mimeType, body: Readable.from(buffer) },
    fields: "id, webViewLink",
  });

  await drive.permissions.create({
    fileId: file.id,
    requestBody: { role: "reader", type: "anyone" },
  }).catch((e) => logger.warn(`Drive permission set failed: ${e.message}`)); // upload still succeeds even if this fails

  return { fileId: file.id, url: file.webViewLink };
};
