// controllers/notification.controller.js
import asyncHandler from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { Notification } from "../models/notifications.model.js";
import mongoose from "mongoose";

/**
 * @desc Get all notifications for the logged-in user
 * @route GET /api/notifications
 */
export const getNotifications = asyncHandler(async (req, res) => {
  const userId = req.user._id;

  const notifications = await Notification.find({ user: userId }).sort({
    createdAt: -1,
  });

  return res.status(200).json(
    new ApiResponse(200, notifications, "Notifications fetched successfully")
  );
});

/**
 * @desc Mark a single notification as read
 * @route PATCH /api/notifications/:id/read
 */
export const markAsRead = asyncHandler(async (req, res) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    throw new ApiError(400, "Invalid notification ID");
  }

  const notification = await Notification.findById(id);
  if (!notification) {
    throw new ApiError(404, "Notification not found");
  }

  if (!notification.user.equals(req.user._id)) {
    throw new ApiError(403, "Access denied to this notification");
  }

  notification.read = true;
  await notification.save();

  return res
    .status(200)
    .json(new ApiResponse(200, notification, "Notification marked as read"));
});

/**
 * @desc Mark all notifications as read
 * @route PATCH /api/notifications/mark-all-read
 */
export const markAllAsRead = asyncHandler(async (req, res) => {
  const userId = req.user._id;

  await Notification.updateMany(
    { user: userId, read: false },
    { $set: { read: true } }
  );

  return res
    .status(200)
    .json(new ApiResponse(200, null, "All notifications marked as read"));
});

/**
 * @desc Delete a notification
 * @route DELETE /api/notifications/:id
 */
export const deleteNotification = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const notification = await Notification.findById(id);
  if (!notification) {
    throw new ApiError(404, "Notification not found");
  }

  if (!notification.user.equals(req.user._id)) {
    throw new ApiError(403, "You are not allowed to delete this notification");
  }

  await notification.deleteOne();

  return res
    .status(200)
    .json(new ApiResponse(200, null, "Notification deleted successfully"));
});
