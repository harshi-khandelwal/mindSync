import mongoose from "mongoose";

const blockSchema = new mongoose.Schema(
  {
    page: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Page",
      required: true,
    },
    parent: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Block",
      default: null, 
    },
    type: {
      type: String,
      enum: ["text", "heading", "checkbox", "image", "code", "quote", "divider"],
      default: "text",
    },
    content: {
      type: mongoose.Schema.Types.Mixed, // flexible for JSON, text, etc.
      default: "",
    },
    order: {
      type: Number,
      required: true,
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  { timestamps: true }
);

export const Block = mongoose.model("Block", blockSchema);
