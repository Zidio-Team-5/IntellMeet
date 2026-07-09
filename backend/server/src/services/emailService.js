import nodemailer from "nodemailer";
import { logger } from "../utils/logger.js";

/**
 * Email delivery via Gmail SMTP (free — just a Gmail account + an App
 * Password, no domain verification needed).
 *
 * Required env vars on Render:
 *   EMAIL_USER   - the Gmail address sending mail (e.g. yourapp@gmail.com)
 *   EMAIL_PASS   - a 16-char Gmail "App Password" (NOT the account password;
 *                  generate one at myaccount.google.com/apppasswords — requires
 *                  2-Step Verification enabled on that Google account)
 *   EMAIL_FROM   - optional display name/from address, defaults to EMAIL_USER
 *
 * If these aren't set, every send is logged and skipped (no crash, no test
 * mail fallback) — the caller still proceeds so the app keeps working, but
 * the person's real inbox simply won't get anything until it's configured.
 */
let transporter = null;
let attempted = false;

const buildTransport = () => {
  attempted = true;
  const user = process.env.EMAIL_USER;
  const pass = process.env.EMAIL_PASS;
  if (!user || !pass) {
    logger.warn("EMAIL_USER/EMAIL_PASS not set — emails will be skipped (logged only).");
    return null;
  }
  try {
    return nodemailer.createTransport({
      service: "gmail",
      auth: { user, pass },
    });
  } catch (e) {
    logger.error(`Email transport init failed: ${e.message}`);
    return null;
  }
};

const getTransporter = () => {
  if (!attempted) transporter = buildTransport();
  return transporter;
};

const FROM = () => process.env.EMAIL_FROM || process.env.EMAIL_USER || "IntellMeet <no-reply@intellmeet.app>";

const wrap = (title, bodyHtml) => `
  <div style="font-family:Segoe UI,Roboto,Helvetica,Arial,sans-serif;max-width:480px;margin:0 auto;padding:24px;color:#1a1a1a;">
    <h2 style="margin:0 0 16px;font-size:18px;">${title}</h2>
    <div style="font-size:14px;line-height:1.6;color:#333;">${bodyHtml}</div>
    <p style="margin-top:32px;font-size:12px;color:#888;">— IntellMeet</p>
  </div>
`;

// Core sender — never throws; logs and returns false on failure so callers
// (auth flows especially) never break user-facing behavior over an email hiccup.
export const sendMail = async ({ to, subject, html }) => {
  const t = getTransporter();
  if (!t) {
    logger.warn(`Email skipped (not configured): to=${to} subject="${subject}"`);
    return false;
  }
  try {
    await t.sendMail({ from: FROM(), to, subject, html });
    return true;
  } catch (e) {
    logger.error(`Email send failed to ${to}: ${e.message}`);
    return false;
  }
};

export const sendOtpEmail = (to, { name, code, purpose }) => {
  const subject = purpose === "invite" ? "Your IntellMeet invite code" : "Verify your IntellMeet account";
  const intro = purpose === "invite"
    ? `You've been invited to join IntellMeet as a team member.`
    : `Use the code below to verify your email and finish creating your account.`;
  return sendMail({
    to, subject,
    html: wrap(subject, `
      <p>Hi ${name || ""},</p>
      <p>${intro}</p>
      <p style="font-size:28px;font-weight:700;letter-spacing:4px;margin:20px 0;text-align:center;background:#f4f4f8;padding:16px;border-radius:8px;">${code}</p>
      <p>This code expires in 10 minutes. If you didn't request this, you can ignore this email.</p>
    `),
  });
};

export const sendPasswordResetEmail = (to, { name, code }) => sendMail({
  to, subject: "Reset your IntellMeet password",
  html: wrap("Reset your password", `
    <p>Hi ${name || ""},</p>
    <p>We received a request to reset your IntellMeet password. Use the code below to continue.</p>
    <p style="font-size:28px;font-weight:700;letter-spacing:4px;margin:20px 0;text-align:center;background:#f4f4f8;padding:16px;border-radius:8px;">${code}</p>
    <p>This code expires in 10 minutes. If you didn't request this, your password is still safe — just ignore this email.</p>
  `),
});

export const sendPasswordChangedEmail = (to, { name }) => sendMail({
  to, subject: "Your IntellMeet password was changed",
  html: wrap("Password changed", `
    <p>Hi ${name || ""},</p>
    <p>Your password was just changed. If this wasn't you, contact your workspace admin immediately.</p>
  `),
});

export const sendAccountCreatedEmail = (to, { name }) => sendMail({
  to, subject: "Your IntellMeet account is ready",
  html: wrap("Welcome to IntellMeet", `
    <p>Hi ${name || ""},</p>
    <p>Your account has been created and verified. You can now sign in and start collaborating.</p>
  `),
});

export const sendRoleChangedEmail = (to, { name, newRole }) => sendMail({
  to, subject: `Your IntellMeet role was updated to ${newRole}`,
  html: wrap("Role updated", `
    <p>Hi ${name || ""},</p>
    <p>An administrator changed your role to <strong>${newRole}</strong>.</p>
    ${newRole === "admin"
      ? "<p>You now have access to admin tools: team management and task assignment.</p>"
      : "<p>Your admin access has been removed.</p>"}
  `),
});

export const sendTaskAssignedEmail = (to, { name, taskTitle, priority }) => sendMail({
  to, subject: `New task assigned: ${taskTitle}`,
  html: wrap("New task assigned", `
    <p>Hi ${name || ""},</p>
    <p>You've been assigned a new task: <strong>${taskTitle}</strong>${priority ? ` (priority: ${priority})` : ""}.</p>
  `),
});

export const sendMemberRemovedEmail = (to, { name }) => sendMail({
  to, subject: "Your IntellMeet account was removed",
  html: wrap("Account removed", `
    <p>Hi ${name || ""},</p>
    <p>An administrator has removed your account from the workspace.</p>
  `),
});
