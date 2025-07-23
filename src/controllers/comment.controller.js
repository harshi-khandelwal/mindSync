// controllers/comment.controller.js
import asyncHandler from "../utils/asyncHandler.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { ApiError } from "../utils/ApiError.js";
import { Comment } from "../models/comment.model.js";
import mongoose from "mongoose";

/**
 * @desc Add a new comment to a block or page
 * @route POST /api/comments
 */
export const createComment = asyncHandler(async (req, res) => {
  const { content, pageId, blockId } = req.body;

  if (!content || (!pageId && !blockId)) {
    throw new ApiError(400, "Content and either pageId or blockId are required");
  }

  const comment = await Comment.create({
    user: req.user._id,
    content,
    page: pageId,
    block: blockId,
  });

  return res
    .status(201)
    .json(new ApiResponse(201, comment, "Comment added successfully"));
});

/**
 * @desc Get all comments for a page or block
 * @route GET /api/comments?pageId= or /api/comments?blockId=
 */
export const getComments = asyncHandler(async (req, res) => {
  const { pageId, blockId } = req.query;

  if (!pageId && !blockId) {
    throw new ApiError(400, "Provide either pageId or blockId");
  }

  const filter = {};
  if (pageId) filter.page = pageId;
  if (blockId) filter.block = blockId;

  const comments = await Comment.find(filter)
    .populate("user", "name email avatar")
    .sort({ createdAt: -1 });

  return res
    .status(200)
    .json(new ApiResponse(200, comments, "Comments fetched successfully"));
});

/**
 * @desc Update a comment
 * @route PUT /api/comments/:commentId
 */
export const updateComment = asyncHandler(async (req, res) => {
  const { commentId } = req.params;
  const { content } = req.body;

  if (!content) {
    throw new ApiError(400, "Content is required");
  }

  const comment = await Comment.findById(commentId);
  if (!comment) {
    throw new ApiError(404, "Comment not found");
  }

  if (comment.user.toString() !== req.user._id.toString()) {
    throw new ApiError(403, "You are not authorized to update this comment");
  }

  comment.content = content;
  await comment.save();

  return res
    .status(200)
    .json(new ApiResponse(200, comment, "Comment updated successfully"));
});

/**
 * @desc Delete a comment
 * @route DELETE /api/comments/:commentId
 */
export const deleteComment = asyncHandler(async (req, res) => {
  const { commentId } = req.params;

  const comment = await Comment.findById(commentId);
  if (!comment) {
    throw new ApiError(404, "Comment not found");
  }

  if (comment.user.toString() !== req.user._id.toString()) {
    throw new ApiError(403, "You are not authorized to delete this comment");
  }

  await comment.deleteOne();

  return res
    .status(200)
    .json(new ApiResponse(200, null, "Comment deleted successfully"));
});
