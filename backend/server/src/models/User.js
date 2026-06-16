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
  },
  { timestamps: true }
);

// `unique: true` on email already creates the index.
export const User = mongoose.models.User || mongoose.model("User", UserSchema);
export const MongoUser = User; // back-compat alias