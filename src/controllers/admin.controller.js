// controllers/admin.controller.js
import asyncHandler from "../utils/asyncHandler.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { ApiError } from "../utils/ApiError.js";
import { User } from "../models/user.model.js";
import { Workspace } from "../models/workspace.model.js";
import { Page } from "../models/pages.model.js";
import { Block } from "../models/block.model.js";
import { Comment } from "../models/comment.model.js";


  // Middleware to check if user is admin
 
export const isAdmin = asyncHandler(async (req, res, next) => {
  if (!req.user || req.user.role !== "admin") {
    throw new ApiError(403, "Admin access denied");
  }
  next();
});

/**
 * @desc Get all users
 * @route GET /api/admin/users
 */
export const getAllUsers = asyncHandler(async (req, res) => {
  const users = await User.find().select("-password");

  return res
    .status(200)
    .json(new ApiResponse(200, users, "Fetched all users successfully"));
});

/**
 * @desc Delete a user and all their content
 * @route DELETE /api/admin/users/:userId
 */
export const deleteUser = asyncHandler(async (req, res) => {
  const { userId } = req.params;

  const user = await User.findById(userId);
  if (!user) throw new ApiError(404, "User not found");

  // Delete user's workspaces, pages, blocks, comments
  await Promise.all([
    Workspace.deleteMany({ owner: userId }),
    Page.deleteMany({ owner: userId }),
    Block.deleteMany({ owner: userId }),
    Comment.deleteMany({ user: userId }),
    user.deleteOne()
  ]);

  return res
    .status(200)
    .json(new ApiResponse(200, null, "User and related data deleted"));
});

/**
 * @desc Get all workspaces
 * @route GET /api/admin/workspaces
 */
export const getAllWorkspaces = asyncHandler(async (req, res) => {
  const workspaces = await Workspace.find()
    .populate("owner", "name email")
    .sort({ createdAt: -1 });

  return res
    .status(200)
    .json(new ApiResponse(200, workspaces, "All workspaces fetched"));
});

/**
 * @desc Get all pages
 * @route GET /api/admin/pages
 */
export const getAllPages = asyncHandler(async (req, res) => {
  const pages = await Page.find()
    .populate("owner", "name email")
    .sort({ createdAt: -1 });

  return res
    .status(200)
    .json(new ApiResponse(200, pages, "All pages fetched"));
});

/**
 * @desc Delete inappropriate comment
 * @route DELETE /api/admin/comments/:commentId
 */
export const deleteCommentAsAdmin = asyncHandler(async (req, res) => {
  const { commentId } = req.params;

  const comment = await Comment.findById(commentId);
  if (!comment) throw new ApiError(404, "Comment not found");

  await comment.deleteOne();

  return res
    .status(200)
    .json(new ApiResponse(200, null, "Comment deleted by admin"));
});

/**
 * @desc Promote a user to admin
 * @route PATCH /api/admin/promote/:userId
 */
export const promoteUserToAdmin = asyncHandler(async (req, res) => {
  const { userId } = req.params;

  const user = await User.findById(userId);
  if (!user) throw new ApiError(404, "User not found");

  user.role = "admin";
  await user.save();

  return res
    .status(200)
    .json(new ApiResponse(200, user, "User promoted to admin"));
});
