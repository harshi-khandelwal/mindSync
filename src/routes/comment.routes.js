import { Router } from "express";
import {
  createComment,
  getComments,
  updateComment,
  deleteComment,
} from "../controllers/comment.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";

const router = Router();

// Create and list comments
router
  .route("/")
  .post(verifyJWT, createComment) // expects body: { content, pageId OR blockId }
  .get(verifyJWT, getComments);   // expects query: ?pageId= OR ?blockId=

// Update and delete individual comments
router
  .route("/:commentId")
  .put(verifyJWT, updateComment)
  .delete(verifyJWT, deleteComment);

export default router;
