import { Router } from "express";
import { createWorkspace, getUserWorkspaces, updateWorkspace, deleteWorkspace } from "../controllers/workspace.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";

const router = Router();

router.route("/").post(verifyJWT, createWorkspace).get(verifyJWT, getUserWorkspaces);
router.route("/:workspaceId").patch(verifyJWT, updateWorkspace).delete(verifyJWT, deleteWorkspace);

export default router;
