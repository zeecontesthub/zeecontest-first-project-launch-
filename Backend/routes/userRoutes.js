import express from "express";
import { saveUser, updateUserRole } from "../controllers/userController.js";
import { verifyFirebaseToken } from "../middleware/firebaseAuth.js";

const router = express.Router();

router.post("/save-user", verifyFirebaseToken, saveUser);
router.post("/update-role", verifyFirebaseToken, updateUserRole); // ✅ new route

export default router;
