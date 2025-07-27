import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import morgan from "morgan";
import dotenv from "dotenv";
import { errorMiddleware } from "./middlewares/error.middleware.js";

// Load environment variables
dotenv.config();

// Initialize app
const app = express();

// ================== Middleware ==================

// Enable CORS
app.use(cors({
  origin: process.env.CORS_ORIGIN || "http://localhost:8000",
  credentials: true
}));

// Parse JSON and URL-encoded data
app.use(express.json({ limit: "16kb" }));
app.use(express.urlencoded({ extended: true, limit: "16kb" }));

// Serve static files (e.g. for uploaded avatars temporarily stored in public/temp)
app.use(express.static("public"));

// Parse cookies from headers
app.use(cookieParser());

// Logger (optional for dev)
if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
}

// ================== Routes ==================
import userRoutes from "./routes/user.routes.js";
import workspaceRoutes from "./routes/workspace.routes.js";
import pageRoutes from "./routes/page.routes.js";
import blockRoutes from "./routes/block.routes.js";
import commentRoutes from "./routes/comment.routes.js";
import collaboratorRoutes from "./routes/collaborator.routes.js";
import notificationRoutes from "./routes/notification.routes.js";
import activityLogRoutes from "./routes/activityLog.routes.js";
import adminRoutes from "./routes/admin.routes.js";
import mindmapRoutes from "./routes/mindmap.routes.js"
import templateRoutes from "./routes/template.routes.js"
// Base route prefix (e.g. /api/v1)
app.use("/api/v1/users", userRoutes);
app.use("/api/v1/workspaces", workspaceRoutes);
app.use("/api/v1/pages", pageRoutes);
app.use("/api/v1/blocks", blockRoutes);
app.use("/api/v1/comments", commentRoutes);
app.use("/api/v1/collaborators", collaboratorRoutes);
app.use("/api/v1/notifications", notificationRoutes);
app.use("/api/v1/activity-logs", activityLogRoutes);
app.use("/api/v1/admin", adminRoutes);
app.use("/api/v1/mindmap", mindmapRoutes);
app.use("/api/v1/template", templateRoutes);
// ================== Error Handler ==================
app.use(errorMiddleware); // custom error handling middleware

export { app };

