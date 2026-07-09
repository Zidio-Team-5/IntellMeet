import crypto from "crypto";

const OTP_TTL_MS = 10 * 60 * 1000; // 10 minutes
const MAX_ATTEMPTS = 5;

export const generateOtp = () => String(crypto.randomInt(100000, 999999)); // 6 digits

const hash = (code) => crypto.createHash("sha256").update(String(code)).digest("hex");

export const buildOtpRecord = (purpose) => {
  const code = generateOtp();
  return { code, record: { codeHash: hash(code), expiresAt: new Date(Date.now() + OTP_TTL_MS), purpose, attempts: 0 } };
};

// Returns { ok, reason? }. Mutates nothing — caller decides what to persist.
export const checkOtp = (otpField, submittedCode) => {
  if (!otpField || !otpField.codeHash || !otpField.expiresAt) return { ok: false, reason: "No verification in progress." };
  if ((otpField.attempts || 0) >= MAX_ATTEMPTS) return { ok: false, reason: "Too many attempts. Request a new code." };
  if (new Date(otpField.expiresAt).getTime() < Date.now()) return { ok: false, reason: "Code expired. Request a new one." };
  if (hash(submittedCode) !== otpField.codeHash) return { ok: false, reason: "Incorrect code." };
  return { ok: true };
};
