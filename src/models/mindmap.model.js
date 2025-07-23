import mongoose, { Schema } from "mongoose";

const mindMapSchema = new Schema(
  {
    title: {
      type: String,
      default: "Untitled Mind Map",
    },
    nodes: [
      {
        id: { type: String },
        label: { type: String },
        position: {
          x: Number,
          y: Number,
        },
      },
    ],
    edges: [
      {
        id: { type: String },
        source: { type: String },
        target: { type: String },
      },
    ],
    createdBy: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    collaborators: [
      {
        type: Schema.Types.ObjectId,
        ref: "User",
      },
    ],
    workspace: {
      type: Schema.Types.ObjectId,
      ref: "Workspace",
    },
    isPrivate: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

export const MindMap = mongoose.model("MindMap", mindMapSchema);
