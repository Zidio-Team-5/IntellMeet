import mongoose, { Schema } from "mongoose";

const MeetingSchema = new Schema(
  {
    title: { type: String, required: true },
    roomId: { type: String, required: true, unique: true },
    host: { type: String, required: true },
    participants: [
      {
        userId: String,
        name: String,
        email: String,
        avatar: String,
        joinedAt: { type: Date, default: Date.now },
      },
    ],
    transcript: [
      {
        senderName: String,
        message: String,
        timestamp: { type: Date, default: Date.now },
      },
    ],
    summary: { type: String, default: "" },
    recordingUrl: { type: String, default: "" },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

// Indexes for the queries used by meetingService.listForUser / dashboard.
MeetingSchema.index({ host: 1 });
MeetingSchema.index({ "participants.userId": 1 });
// roomId index is created by `unique: true`.

export const Meeting = mongoose.models.Meeting || mongoose.model("Meeting", MeetingSchema);
export const MongoMeeting = Meeting; // back-compat alias (socket layer)