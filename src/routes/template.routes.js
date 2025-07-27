import { Router } from "express";
import {
  createTemplate,
  getAllTemplates,
  getTemplateById,
  updateTemplate,
  deleteTemplate
} from "../controllers/template.controller.js";

import { verifyJWT } from "../middlewares/auth.middleware.js";

const router = Router();
router.route("/")
  .post(verifyJWT, createTemplate)
  .get(getAllTemplates);

router.route("/:templateId")
  .get(verifyJWT, getTemplateById)
  .put(verifyJWT, updateTemplate)
  .delete(verifyJWT, deleteTemplate);

  export default router;
