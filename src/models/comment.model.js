import mongoose, { Schema } from "mongoose";

const commentSchema = new Schema(
  {
    content: {
      type: String,
      required: true,
    },
    page: {
      type: Schema.Types.ObjectId,
      ref: "Page",
    },
    mindMap: {
      type: Schema.Types.ObjectId,
      ref: "MindMap",
    },
    createdBy: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  { timestamps: true }
);

export const Comment = mongoose.model("Comment", commentSchema);
