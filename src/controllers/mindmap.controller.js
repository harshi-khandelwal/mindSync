import { MindMap } from "../models/mindmap.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import asyncHandler  from "../utils/asyncHandler.js";

// Create a new mind map
export const createMindMap = asyncHandler(async (req, res) => {
  const { title, nodes, edges, workspace, isPrivate } = req.body;

  const mindMap = await MindMap.create({
    title,
    nodes,
    edges,
    workspace,
    isPrivate,
    createdBy: req.user._id,
    collaborators: [req.user._id],
  });

  res.status(201).json(new ApiResponse(201, mindMap, "Mind map created"));
});

// Get all mind maps for user (created or collaborated)
export const getAllMindMaps = asyncHandler(async (req, res) => {
  const mindMaps = await MindMap.find({
    $or: [
      { createdBy: req.user._id },
      { collaborators: req.user._id }
    ]
  }).sort("-updatedAt");

  res.status(200).json(new ApiResponse(200, mindMaps));
});

// Get single mind map by ID
export const getMindMapById = asyncHandler(async (req, res) => {
  const mindMap = await MindMap.findById(req.params.id);

  if (!mindMap) {
    throw new ApiError(404, "Mind map not found");
  }

  const isAuthorized =
    mindMap.createdBy.equals(req.user._id) ||
    mindMap.collaborators.some(id => id.toString() === userId.toString())

  if (!isAuthorized) {
    throw new ApiError(403, "Unauthorized access to mind map");
  }

  res.status(200).json(new ApiResponse(200, mindMap));
});

// Update a mind map (title, nodes, edges, isPrivate)
export const updateMindMap = asyncHandler(async (req, res) => {
  const { title, nodes, edges, isPrivate } = req.body;

  const mindMap = await MindMap.findById(req.params.id);

  if (!mindMap) {
    throw new ApiError(404, "Mind map not found");
  }

  if (!mindMap.createdBy.equals(req.user._id)) {
    throw new ApiError(403, "Only the creator can update this mind map");
  }

  if (title) mindMap.title = title;
  if (Array.isArray(nodes)) mindMap.nodes = nodes;
  if (Array.isArray(edges)) mindMap.edges = edges;
  if (typeof isPrivate === "boolean") mindMap.isPrivate = isPrivate;

  await mindMap.save();

  res.status(200).json(new ApiResponse(200, mindMap, "Mind map updated"));
});

// Delete mind map
export const deleteMindMap = asyncHandler(async (req, res) => {
  const mindMap = await MindMap.findById(req.params.id);

  if (!mindMap) {
    throw new ApiError(404, "Mind map not found");
  }

  if (!mindMap.createdBy.equals(req.user._id)) {
    throw new ApiError(403, "Only the creator can delete this mind map");
  }

  await mindMap.deleteOne();

  res.status(200).json(new ApiResponse(200, null, "Mind map deleted"));
});

// Add collaborator
export const addCollaborator = asyncHandler(async (req, res) => {
  const { userId } = req.body;
  const mindMap = await MindMap.findById(req.params.id);

  if (!mindMap) {
    throw new ApiError(404, "Mind map not found");
  }

  if (!mindMap.createdBy.equals(req.user._id)) {
    throw new ApiError(403, "Only the creator can add collaborators");
  }

  if (!mindMap.collaborators.some(id => id.toString() === userId.toString()))
 {
    mindMap.collaborators.push(userId);
    await mindMap.save();
  }

  res.status(200).json(new ApiResponse(200, mindMap, "Collaborator added"));
});

// Remove collaborator
export const removeCollaborator = asyncHandler(async (req, res) => {
  const { userId } = req.body;
  const mindMap = await MindMap.findById(req.params.id);

  if (!mindMap) throw new ApiError(404, "Mind map not found");

  if (!mindMap.createdBy.equals(req.user._id)) {
    throw new ApiError(403, "Only the creator can remove collaborators");
  }

  mindMap.collaborators = mindMap.collaborators.filter(
    (id) => id.toString() !== userId.toString()
  );

  await mindMap.save();

  res.status(200).json(new ApiResponse(200, mindMap, "Collaborator removed"));
});
