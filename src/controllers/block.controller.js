// controllers/block.controller.js
import asyncHandler from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { Block } from "../models/block.model.js";
import { Page } from "../models/pages.model.js";
import { Workspace } from "../models/workspace.model.js";
import mongoose from "mongoose";

/**
 * Helper: Verify if the user has access to the page
 */
const verifyAccess = async (pageId, userId) => {
  if (!mongoose.Types.ObjectId.isValid(pageId)) {
    throw new ApiError(400, "Invalid page ID");
  }

  const page = await Page.findById(pageId);
  if (!page) throw new ApiError(404, "Page not found");

  const workspace = await Workspace.findOne({
    _id: page.workspace,
    $or: [{ owner: userId }, { collaborators: userId }],
  });

  if (!workspace) {
    throw new ApiError(403, "Access denied to this page");
  }

  return page;
};

/**
 * @desc Create a new block in a page
 * @route POST /api/blocks
 */
export const createBlock = asyncHandler(async (req, res) => {
  const { pageId, type, content, parentBlock, position } = req.body;
  const userId = req.user._id;

  await verifyAccess(pageId, userId);

  const block = await Block.create({
    page: pageId,
    type,
    content,
    parentBlock: parentBlock || null,
    createdBy: userId,
    position: position || 0,
  });

  return res
    .status(201)
    .json(new ApiResponse(201, block, "Block created successfully"));
});

/**
 * @desc Get all blocks of a page
 * @route GET /api/blocks/:pageId
 */
export const getBlocksByPage = asyncHandler(async (req, res) => {
  const { pageId } = req.params;
  const userId = req.user._id;

  await verifyAccess(pageId, userId);

  const blocks = await Block.find({ page: pageId }).sort({ position: 1 });

  return res.status(200).json(new ApiResponse(200, blocks));
});

/**
 * @desc Update a block
 * @route PUT /api/blocks/:blockId
 */
export const updateBlock = asyncHandler(async (req, res) => {
  const { blockId } = req.params;
  const { content, type, position } = req.body;
  const userId = req.user._id;

  const block = await Block.findById(blockId);
  if (!block) throw new ApiError(404, "Block not found");

  await verifyAccess(block.page, userId);

  block.content = content || block.content;
  block.type = type || block.type;
  block.position = position ?? block.position;

  await block.save();

  return res
    .status(200)
    .json(new ApiResponse(200, block, "Block updated successfully"));
});

/**
 * @desc Delete a block
 * @route DELETE /api/blocks/:blockId
 */
export const deleteBlock = asyncHandler(async (req, res) => {
  const { blockId } = req.params;
  const userId = req.user._id;

  const block = await Block.findById(blockId);
  if (!block) throw new ApiError(404, "Block not found");

  await verifyAccess(block.page, userId);

  await block.deleteOne();

  return res
    .status(200)
    .json(new ApiResponse(200, {}, "Block deleted successfully"));
});
