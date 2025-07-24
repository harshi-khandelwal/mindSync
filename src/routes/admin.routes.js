import { Router } from "express";
import {
  getAllUsers,
  deleteUser,
  getAllWorkspaces,
  getAllPages,
  deleteCommentAsAdmin,
  promoteUserToAdmin,
  isAdmin,
} from "../controllers/admin.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";

const router = Router();

// User management
router.route("/users").get(verifyJWT, isAdmin, getAllUsers);
router.route("/users/:userId").delete(verifyJWT, isAdmin, deleteUser);

// Workspace management
router.route("/workspaces").get(verifyJWT, isAdmin, getAllWorkspaces);

// Page management
router.route("/pages").get(verifyJWT, isAdmin, getAllPages);

// Comment moderation
router.route("/comments/:commentId").delete(verifyJWT, isAdmin, deleteCommentAsAdmin);

// Promote user
router.route("/promote/:userId").patch(verifyJWT, isAdmin, promoteUserToAdmin);

export default router;

//postman testing done 