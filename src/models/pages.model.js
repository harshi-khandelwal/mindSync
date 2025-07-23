import mongoose, { Schema } from "mongoose";

const pageSchema = new Schema(
  {
    title: {
      type: String,
      default: "Untitled Page",
      trim: true,
    },
    content: {
      type: Schema.Types.Mixed,
      default: {},
      required: true,
    },
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

// Automatically update `updatedAt` on change
pageSchema.pre("save", function (next) {
  this.updatedAt = Date.now();
  next();
});

export const Page = mongoose.model("Page", pageSchema);