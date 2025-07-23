import mongoose, { Schema } from "mongoose";

const templateSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    type: {
      type: String,
      enum: ["Page", "MindMap"],
      required: true,
    },
    content: {
      type: Schema.Types.Mixed,
      required: true,
    },
    createdBy: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    isPublic: {
      type: Boolean,
      default: false,
    },
    usageCount: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true }
);

export const Template = mongoose.model("Template", templateSchema);
