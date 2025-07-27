import { Workspace } from "../models/workspace.model.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { ApiError } from "../utils/ApiError.js";
import  asyncHandler  from "../utils/asyncHandler.js";
import mongoose from "mongoose";

/**
 * Create a new workspace
 */
const createWorkspace = asyncHandler(async (req, res) => {
  const { name, description, isPublic = false } = req.body;

  if (!name) {
    throw new ApiError(400, "Workspace name is required");
  }

  const workspace = await Workspace.create({
    name,
    description,
    isPublic,
    owner: req.user._id,
    collaborators: [req.user._id],
  });

  return res
    .status(201)
    .json(new ApiResponse(201, workspace, "Workspace created successfully"));
});

/**
 * Get all workspaces for the logged-in user
 */
const getUserWorkspaces = asyncHandler(async (req, res) => {
  const workspaces = await Workspace.find({
    collaborators: req.user._id,
  }).populate("owner", "name email");

  return res
    .status(200)
    .json(new ApiResponse(200, workspaces, "Fetched workspaces"));
});

/**
 * Get a single workspace
 */
const getWorkspaceById = asyncHandler(async (req, res) => {
  const { workspaceId } = req.params;

  if (!mongoose.Types.ObjectId.isValid(workspaceId)) {
    throw new ApiError(400, "Invalid workspace ID");
  }

  const workspace = await Workspace.findById(workspaceId).populate(
    "collaborators",
    "fullName", "email", "username"
  );

  if (!workspace) {
    throw new ApiError(404, "Workspace not found");
  }

  if (
    !workspace.isPublic &&
    !workspace.collaborators.some((id) => id.equals(req.user._id))
  ) {
    throw new ApiError(403, "Access denied to this workspace");
  }

  return res
    .status(200)
    .json(new ApiResponse(200, workspace, "Workspace fetched"));
});

/**
 * Update a workspace (only owner can update)
 */
const updateWorkspace = asyncHandler(async (req, res) => {
  const { workspaceId } = req.params;
  const { name, description, isPublic } = req.body;

  const workspace = await Workspace.findById(workspaceId);

  if (!workspace) {
    throw new ApiError(404, "Workspace not found");
  }

  if (!workspace.owner.equals(req.user._id)) {
    throw new ApiError(403, "Only the owner can update the workspace");
  }

  if (name) workspace.name = name;
  if (description) workspace.description = description;
  if (typeof isPublic === "boolean") workspace.isPublic = isPublic;

  await workspace.save();

  return res
    .status(200)
    .json(new ApiResponse(200, workspace, "Workspace updated"));
});

/**
 * Delete a workspace (only owner can delete)
 */
const deleteWorkspace = asyncHandler(async (req, res) => {
  const { workspaceId } = req.params;

  const workspace = await Workspace.findById(workspaceId);

  if (!workspace) {
    throw new ApiError(404, "Workspace not found");
  }

  if (!workspace.owner.equals(req.user._id)) {
    throw new ApiError(403, "Only the owner can delete the workspace");
  }

  await workspace.deleteOne();

  return res
    .status(200)
    .json(new ApiResponse(200, null, "Workspace deleted"));
});

/**
 * Add a collaborator to a workspace (only owner can add)
 */
const addCollaborator = asyncHandler(async (req, res) => {
  const { workspaceId } = req.params;
  const { userId } = req.body;

  if (!userId || !mongoose.Types.ObjectId.isValid(userId)) {
    throw new ApiError(400, "A valid userId must be provided");
  }

  const workspace = await Workspace.findById(workspaceId);

  if (!workspace) {
    throw new ApiError(404, "Workspace not found");
  }

  if (!workspace.owner.equals(req.user._id)) {
    throw new ApiError(403, "Only the owner can add collaborators");
  }

  const alreadyCollaborator = workspace.collaborators.some(id =>
    id.equals(userId)
  );

  if (alreadyCollaborator) {
    throw new ApiError(400, "User already a collaborator");
  }

  workspace.collaborators.push(userId);
  await workspace.save();

  return res
    .status(200)
    .json(new ApiResponse(200, workspace, "Collaborator added"));
});

/**
 * Remove a collaborator (only owner can remove others)
 */
const removeCollaborator = asyncHandler(async (req, res) => {
  const { workspaceId } = req.params;
  const { userId } = req.body;

  const workspace = await Workspace.findById(workspaceId);

  if (!workspace) {
    throw new ApiError(404, "Workspace not found");
  }

  if (!workspace.owner || !req.user || !workspace.owner.equals(req.user._id)) {
  throw new ApiError(403, "Only the owner can update the workspace");
}

  workspace.collaborators = workspace.collaborators.filter(
    (id) => id.toString() !== userId
  );

  await workspace.save();

  return res
    .status(200)
    .json(new ApiResponse(200, workspace, "Collaborator removed"));
});

export {
  createWorkspace,
  getUserWorkspaces,
  getWorkspaceById,
  updateWorkspace,
  deleteWorkspace,
  addCollaborator,
  removeCollaborator,
};
