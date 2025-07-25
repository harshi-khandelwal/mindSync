import { Router } from "express";
import { createPage, getPagesByWorkspace, updatePage, deletePage } from "../controllers/page.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";

const router = Router();

router.route("/:workspaceId").post(verifyJWT, createPage).get(verifyJWT, getPagesByWorkspace);
router.route("/:pageId").patch(verifyJWT, updatePage).delete(verifyJWT, deletePage);

export default router;

// pages testing done 
