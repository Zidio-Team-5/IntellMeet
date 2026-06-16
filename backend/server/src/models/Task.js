import mongoose, { Schema } from "mongoose";

// Status values match the locked frontend exactly: todo | in_progress | completed
const TaskSchema = new Schema(
  {
    meetingId: { type: String, default: "" },
    title: { type: String, required: true },
    description: { type: String, default: "" },
    assignee: { type: String, default: "" },
    priority: { type: String, enum: ["low", "medium", "high", "urgent"], default: "medium" },
    status: { type: String, enum: ["todo", "in_progress", "completed"], default: "todo" },
    dueDate: { type: Date },
  },
  { timestamps: true }
);

TaskSchema.index({ assignee: 1 });
TaskSchema.index({ status: 1 });
TaskSchema.index({ meetingId: 1 });

export const Task = mongoose.models.Task || mongoose.model("Task", TaskSchema);
export const MongoTask = Task;