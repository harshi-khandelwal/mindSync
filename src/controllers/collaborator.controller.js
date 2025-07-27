import asyncHandler from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { Workspace } from "../models/workspace.model.js";
import { User } from "../models/user.model.js";
import mongoose from "mongoose";

/**
 * @desc Add a collaborator to a workspace
 * @route POST /api/collaborators
 */
export const addCollaborator = asyncHandler(async (req, res) => {
  const { workspaceId, email } = req.body;
  const userId = req.user._id;

  if (!mongoose.Types.ObjectId.isValid(workspaceId)) {
    throw new ApiError(400, "Invalid workspace ID");
  }

  const workspace = await Workspace.findById(workspaceId);
  if (!workspace) throw new ApiError(404, "Workspace not found");

  if (!workspace.owner.equals(userId)) {
    throw new ApiError(403, "Only the workspace owner can add collaborators");
  }

  const userToAdd = await User.findOne({ email });
  if (!userToAdd) {
    throw new ApiError(404, "User with this email not found");
  }

  const alreadyExists = workspace.collaborators.some(
    (collabId) => collabId.toString() === userToAdd._id.toString()
  );
  if (alreadyExists) {
    throw new ApiError(409, "User is already a collaborator");
  }

  workspace.collaborators.push(userToAdd._id);
  await workspace.save();

  return res.status(201).json(
    new ApiResponse(201, { collaborator: userToAdd }, "Collaborator added")
  );
});

/**
 * @desc Get all collaborators for a workspace
 * @route GET /api/collaborators/:workspaceId
 */
export const getCollaborators = asyncHandler(async (req, res) => {
  const { workspaceId } = req.params;
  const userId = req.user._id;

  if (!mongoose.Types.ObjectId.isValid(workspaceId)) {
    throw new ApiError(400, "Invalid workspace ID");
  }

  const workspace = await Workspace.findById(workspaceId).populate(
    "collaborators",
    "fullName email username"
  );
  if (!workspace) throw new ApiError(404, "Workspace not found");

  const hasAccess =
    workspace.owner.equals(userId) ||
    workspace.collaborators.some((u) => u._id.equals(userId));

  if (!hasAccess) {
    throw new ApiError(403, "You don't have access to this workspace");
  }

  return res
    .status(200)
    .json(new ApiResponse(200, workspace.collaborators, "Collaborators fetched"));
});

/**
 * @desc Remove a collaborator from a workspace
 * @route DELETE /api/collaborators/:workspaceId/:userId
 */
export const removeCollaborator = asyncHandler(async (req, res) => {
  const { workspaceId, userId: targetUserId } = req.params;
  const requesterId = req.user._id;

  if (!mongoose.Types.ObjectId.isValid(workspaceId) || !mongoose.Types.ObjectId.isValid(targetUserId)) {
    throw new ApiError(400, "Invalid workspace or user ID");
  }

  const workspace = await Workspace.findById(workspaceId);
  if (!workspace) throw new ApiError(404, "Workspace not found");

  if (!workspace.owner.equals(requesterId)) {
    throw new ApiError(403, "Only the owner can remove collaborators");
  }

  workspace.collaborators = workspace.collaborators.filter(
    (c) => c.toString() !== targetUserId
  );

  await workspace.save();

  return res
    .status(200)
    .json(new ApiResponse(200, {}, "Collaborator removed successfully"));
});