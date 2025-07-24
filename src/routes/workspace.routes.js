import { Router } from "express";
import { createWorkspace, getUserWorkspaces, updateWorkspace, deleteWorkspace, addCollaborator, removeCollaborator } from "../controllers/workspace.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";

const router = Router();

router.route("/").post(verifyJWT, createWorkspace).get(verifyJWT, getUserWorkspaces);
router.route("/:workspaceId").patch(verifyJWT, updateWorkspace).delete(verifyJWT, deleteWorkspace);
router.post("/:workspaceId/collaborators", verifyJWT, addCollaborator);
router.delete("/:workspaceId/collaborators", verifyJWT, removeCollaborator);
export default router;
