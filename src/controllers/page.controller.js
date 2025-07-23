// controllers/page.controller.js
import asyncHandler from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { Page } from "../models/pages.model.js";
import { Workspace } from "../models/workspace.model.js";
import mongoose from "mongoose";

/**
 * @desc Create a new page inside a workspace
 * @route POST /api/pages
 */
export const createPage = asyncHandler(async (req, res) => {
  const { workspaceId, title } = req.body;
  const userId = req.user._id;

  if (!workspaceId || !title) {
    throw new ApiError(400, "Workspace ID and title are required");
  }

  const workspace = await Workspace.findOne({
    _id: workspaceId,
    $or: [
      { owner: userId },
      { collaborators: userId },
    ],
  });

  if (!workspace) {
    throw new ApiError(403, "You are not authorized to add a page in this workspace");
  }

  const page = await Page.create({
    title,
    workspace: workspaceId,
    createdBy: userId,
  });

  return res.status(201).json(
    new ApiResponse(201, page, "Page created successfully")
  );
});

/**
 * @desc Get all pages of a workspace
 * @route GET /api/pages/:workspaceId
 */
export const getPagesByWorkspace = asyncHandler(async (req, res) => {
  const { workspaceId } = req.params;
  const userId = req.user._id;

  if (!mongoose.Types.ObjectId.isValid(workspaceId)) {
    throw new ApiError(400, "Invalid workspace ID");
  }

  const workspace = await Workspace.findOne({
    _id: workspaceId,
    $or: [{ owner: userId }, { collaborators: userId }],
  });

  if (!workspace) {
    throw new ApiError(403, "You are not authorized to view pages in this workspace");
  }

  const pages = await Page.find({ workspace: workspaceId }).sort({ updatedAt: -1 });

  return res.status(200).json(new ApiResponse(200, pages));
});

/**
 * @desc Update a page (title)
 * @route PUT /api/pages/:pageId
 */
export const updatePage = asyncHandler(async (req, res) => {
  const { pageId } = req.params;
  const { title } = req.body;
  const userId = req.user._id;

  const page = await Page.findById(pageId);
  if (!page) {
    throw new ApiError(404, "Page not found");
  }

  const workspace = await Workspace.findOne({
    _id: page.workspace,
    $or: [{ owner: userId }, { collaborators: userId }],
  });

  if (!workspace) {
    throw new ApiError(403, "You are not authorized to update this page");
  }

  page.title = title || page.title;
  await page.save();

  return res.status(200).json(new ApiResponse(200, page, "Page updated"));
});

/**
 * @desc Delete a page
 * @route DELETE /api/pages/:pageId
 */
export const deletePage = asyncHandler(async (req, res) => {
  const { pageId } = req.params;
  const userId = req.user._id;

  const page = await Page.findById(pageId);
  if (!page) {
    throw new ApiError(404, "Page not found");
  }

  const workspace = await Workspace.findOne({
    _id: page.workspace,
    $or: [{ owner: userId }, { collaborators: userId }],
  });

  if (!workspace) {
    throw new ApiError(403, "You are not authorized to delete this page");
  }

  await page.deleteOne();

  return res.status(200).json(new ApiResponse(200, {}, "Page deleted"));
});
