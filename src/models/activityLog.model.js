import mongoose, { Schema } from "mongoose";

const activityLogSchema = new Schema(
  {
    action: {
      type: String,
      required: true,
      enum: ["created", "updated", "deleted", "shared", "commented"],
    },
    modelType: {
      type: String,
      enum: ["Page", "MindMap", "Workspace"],
      required: true,
    },
    modelId: {
      type: Schema.Types.ObjectId,
      required: true,
    },
    message: {
      type: String,
      required: true,
    },
    performedBy: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    workspace: {
      type: Schema.Types.ObjectId,
      ref: "Workspace",
    },
  },
  { timestamps: true }
);

export const ActivityLog = mongoose.model("ActivityLog", activityLogSchema);
