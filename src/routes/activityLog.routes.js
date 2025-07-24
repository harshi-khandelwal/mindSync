import { Router } from "express";
import {
getPageActivityLogs,
createActivityLog,
deleteLogsByPage,
} from "../controllers/activityLog.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";

const router = Router();

// Get activity logs for a specific page
router.get("/:pageId", verifyJWT, getPageActivityLogs);

// Create a new activity log
router.post("/", verifyJWT, createActivityLog);

// Delete all logs for a page
router.delete("/:pageId", verifyJWT, deleteLogsByPage);

export default router;

// ACTIVITY LOG POSTMAN TESTING POSTMAN COMPLETED