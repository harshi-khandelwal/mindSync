import express from "express";
import { upload } from "../middlewares/multer.middleware.js";
import {
    registerUser,
    loginUser,
    logoutUser,
    getUserProfile,
    updateUser,
    deleteUser,
} from "../controllers/user.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";
const router = express.Router();

router.post("/register", upload.single("avatar"), registerUser);
router.post("/login", loginUser);
router.get("/logout", logoutUser);
router.get("/profile", verifyJWT, getUserProfile);
router.put("/profile", verifyJWT, upload.single("avatar"), updateUser);
router.delete("/profile", verifyJWT, deleteUser);

export default router;


// postamn testing done 