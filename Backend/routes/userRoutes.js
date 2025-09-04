import express from "express";
<<<<<<< HEAD
import { saveUser, updateUserRole } from "../controllers/userController.js";
=======
import {
  saveUser,
  updateUserRole,
  updateUserProfile,
} from "../controllers/userController.js";
>>>>>>> oscar-branch
import { verifyFirebaseToken } from "../middleware/firebaseAuth.js";

const router = express.Router();

router.post("/save-user", verifyFirebaseToken, saveUser);
router.post("/update-role", verifyFirebaseToken, updateUserRole); // ✅ new route

<<<<<<< HEAD
=======
router.post("/update-profile", updateUserProfile); // ✅ new route

>>>>>>> oscar-branch
export default router;
