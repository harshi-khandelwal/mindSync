import { Router } from "express";
import {
  createMindMap,
  getAllMindMaps,
  getMindMapById,
  updateMindMap,
  deleteMindMap,
  addCollaborator, 
  removeCollaborator,
} from "../controllers/mindmap.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";

const router = Router();

router.use(verifyJWT);

// CRUD routes
router.route("/")
  .post(createMindMap)        
  .get(getAllMindMaps);        

router.route("/:id")
  .get(getMindMapById)         
  .patch(updateMindMap)       
  .delete(deleteMindMap);     

// Collaborator
router.post("/:id/collaborators", addCollaborator); //TODO
router.delete("/:id/collaborators", removeCollaborator)
export default router;