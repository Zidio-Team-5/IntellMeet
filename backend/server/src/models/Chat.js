import mongoose, { Schema } from "mongoose";

const ChatSchema = new Schema(
  {
    roomId: { type: String, required: true },
    sender: {
      userId: { type: String, required: true },
      name: { type: String, required: true },
      avatar: { type: String, default: "" },
    },
    message: { type: String, required: true },
    timestamp: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

ChatSchema.index({ roomId: 1, timestamp: 1 });

export const Chat = mongoose.models.Chat || mongoose.model("Chat", ChatSchema);
export const MongoChat = Chat;