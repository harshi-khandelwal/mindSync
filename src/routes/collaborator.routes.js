import { Router } from "express";
import {
  addCollaborator,
  getCollaborators,
  removeCollaborator,
} from "../controllers/collaborator.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";

const router = Router();

router.post("/", verifyJWT, addCollaborator); // body: { workspaceId, email }
router.get("/:workspaceId", verifyJWT, getCollaborators);
router.delete("/:workspaceId/:userId", verifyJWT, removeCollaborator);

export default router;
