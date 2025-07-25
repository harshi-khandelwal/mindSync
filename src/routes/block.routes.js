import { Router } from "express";
import { createBlock, updateBlock, deleteBlock, getBlocksByPage } from "../controllers/block.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";

const router = Router();

router.route("/:pageId").post(verifyJWT, createBlock).get(verifyJWT, getBlocksByPage);
router.route("/:blockId").patch(verifyJWT, updateBlock).delete(verifyJWT, deleteBlock);

export default router;

//blocks testing done 