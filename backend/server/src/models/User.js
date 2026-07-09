import mongoose, { Schema } from "mongoose";

const UserSchema = new Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    password: { type: String, required: true },
    avatar: { type: String, default: "" },
    role: { type: String, enum: ["admin", "member"], default: "member" },
    department: { type: String, default: "" },
    settings: { type: Object, default: {} },
    stats: { type: Object, default: {} },

    // --- Signup verification / invite flow ---
    // isVerified: email OTP confirmed. hasPassword: user has set a real password
    // (false for admin-invited members until they complete setup).
    isVerified: { type: Boolean, default: false },
    hasPassword: { type: Boolean, default: false },
    invitedBy: { type: String, default: "" }, // userId of admin who added this member, if any
    otp: {
      codeHash: { type: String, default: "" },
      expiresAt: { type: Date, default: null },
      purpose: { type: String, enum: ["signup", "invite", ""], default: "" },
      attempts: { type: Number, default: 0 },
    },
  },
  { timestamps: true }
);

// `unique: true` on email already creates the index.
export const User = mongoose.models.User || mongoose.model("User", UserSchema);
export const MongoUser = User; // back-compat alias