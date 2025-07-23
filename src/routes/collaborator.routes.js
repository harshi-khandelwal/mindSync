import { Router } from "express";
import { addCollaborator, removeCollaborator, getCollaborators } from "../controllers/collaborator.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";

const router = Router();

router.route("/:workspaceId")
    .post(verifyJWT, addCollaborator)
    .get(verifyJWT, getCollaborators)
    .delete(verifyJWT, removeCollaborator);

export default router;
