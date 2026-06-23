import mongoose, { Schema } from "mongoose";

const ParticipantSchema = new Schema(
  {
    userId: String,
    name: String,
    email: String,
    avatar: String,
    joinedAt: { type: Date, default: Date.now },
  },
  { _id: false }
);

// People who have a seat at the meeting (creator + anyone added). Distinct from
// `participants`, which records who has actually been inside the room.
const MemberSchema = new Schema(
  {
    userId: { type: String, required: true },
    name: String,
    email: String,
    role: { type: String, enum: ["host", "member"], default: "member" },
    addedAt: { type: Date, default: Date.now },
  },
  { _id: false }
);

// Pending/accepted invitations. invitedUsers grant list-visibility before a
// user has ever joined, which is what makes meetings show up cross-user.
const InviteSchema = new Schema(
  {
    userId: String, // resolved when the invitee already has an account
    email: String,
    name: String,
    status: { type: String, enum: ["pending", "accepted", "declined"], default: "pending" },
    invitedAt: { type: Date, default: Date.now },
  },
  { _id: false }
);

const MeetingSchema = new Schema(
  {
    title: { type: String, required: true },
    description: { type: String, default: "" },
    roomId: { type: String, required: true, unique: true }, // human-shareable meeting id
    host: { type: String, required: true }, // creator userId (kept for back-compat)
    creator: { type: String }, // mirror of host (explicit ownership field)
    members: { type: [MemberSchema], default: [] },
    participants: { type: [ParticipantSchema], default: [] },
    invitedUsers: { type: [InviteSchema], default: [] },
    visibility: { type: String, enum: ["private", "invite", "public"], default: "invite" },
    status: { type: String, enum: ["upcoming", "live", "completed", "cancelled"], default: "live" },
    scheduledAt: { type: Date },
    duration: { type: Number, default: 30 },
    transcript: [
      {
        senderName: String,
        message: String,
        timestamp: { type: Date, default: Date.now },
      },
    ],
    summary: { type: String, default: "" },
    actionItems: {
      type: [
        {
          task: String,
          assignee: String,
          priority: { type: String, default: "medium" },
        },
      ],
      default: [],
    },
    recordingUrl: { type: String, default: "" },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

// Indexes for the queries used by meetingService.listForUser / dashboard.
MeetingSchema.index({ host: 1 });
MeetingSchema.index({ creator: 1 });
MeetingSchema.index({ "participants.userId": 1 });
MeetingSchema.index({ "members.userId": 1 });
MeetingSchema.index({ "invitedUsers.userId": 1 });
MeetingSchema.index({ "invitedUsers.email": 1 });
// roomId index is created by `unique: true`.

export const Meeting = mongoose.models.Meeting || mongoose.model("Meeting", MeetingSchema);
export const MongoMeeting = Meeting; // back-compat alias (socket layer)
