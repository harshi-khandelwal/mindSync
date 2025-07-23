// controllers/activityLog.controller.js
import asyncHandler from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { ActivityLog } from "../models/activityLog.model.js";
import mongoose from "mongoose";

/**
 * @desc Get all activity logs for a page
 * @route GET /api/activity/:pageId
 */
export const getPageActivityLogs = asyncHandler(async (req, res) => {
  const { pageId } = req.params;

  if (!mongoose.Types.ObjectId.isValid(pageId)) {
    throw new ApiError(400, "Invalid page ID");
  }

  const logs = await ActivityLog.find({ page: pageId }).populate("user", "name email");

  return res.status(200).json(
    new ApiResponse(200, logs, "Activity logs fetched successfully")
  );
});

/**
 * @desc Create an activity log entry
 * @route POST /api/activity
 */
export const createActivityLog = asyncHandler(async (req, res) => {
  const { modelType, modelId, action, message } = req.body;

  if (!modelType || !modelId || !action || !message) {
    throw new ApiError(400, "modelType, modelId, action, and message are required");
  }

  const log = await ActivityLog.create({
    modelType,
    modelId,
    action,
    message,
    performedBy: req.user._id,
  });

  return res
    .status(201)
    .json(new ApiResponse(201, log, "Activity log created successfully"));
});

/**
 * @desc Delete all logs for a page (Admin or owner only)
 * @route DELETE /api/activity/:pageId
 */
export const deleteLogsByPage = asyncHandler(async (req, res) => {
  const { pageId } = req.params;

  if (!mongoose.Types.ObjectId.isValid(pageId)) {
    throw new ApiError(400, "Invalid page ID");
  }

  await ActivityLog.deleteMany({ page: pageId });

  return res
    .status(200)
    .json(new ApiResponse(200, null, "Activity logs deleted successfully"));
});
