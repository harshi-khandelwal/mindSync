import { Router } from "express";
import {
  getNotifications,
  markAsRead,
  markAllAsRead,
  deleteNotification,
} from "../controllers/notification.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";

const router = Router();

// Get all notifications
router.get("/", verifyJWT, getNotifications);

// Mark a single notification as read
router.patch("/:id/read", verifyJWT, markAsRead);

// Mark all notifications as read
router.patch("/mark-all-read", verifyJWT, markAllAsRead);

// Delete a notification
router.delete("/:id", verifyJWT, deleteNotification);

export default router;
