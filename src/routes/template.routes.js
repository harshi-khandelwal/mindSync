import { Router } from "express";
import { createTemplate, getAllTemplates, getTemplateById, deleteTemplate } from "../controllers/template.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";

const router = Router();

router.route("/").post(verifyJWT, createTemplate).get(getAllTemplates);
router.route("/:templateId").get(getTemplateById).delete(verifyJWT, deleteTemplate);

export default router;
