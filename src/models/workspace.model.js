import mongoose, { Schema } from "mongoose";

const workspaceSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      default: "",
    },
    owner: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    collaborators: [
      {
        user: {
          type: Schema.Types.ObjectId,
          ref: "User",
        },
      },
    ],
    pages: [
      {
        type: Schema.Types.ObjectId,
        ref: "Page",
      },
    ],
    mindMaps: [
      {
        type: Schema.Types.ObjectId,
        ref: "MindMap",
      },
    ],
  },
  { timestamps: true }
);

export const Workspace = mongoose.model("Workspace", workspaceSchema);
