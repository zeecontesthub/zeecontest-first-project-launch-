import express from "express";
import {
  saveUser,
  updateUserRole,
  updateUserProfile,
  saveUserAccountDetails,
} from "../controllers/userController.js";
import { verifyFirebaseToken } from "../middleware/firebaseAuth.js";

const router = express.Router();

router.post("/save-user", verifyFirebaseToken, saveUser);
router.post("/update-role", verifyFirebaseToken, updateUserRole); // ✅ new route

router.post("/update-profile", updateUserProfile); // ✅ new route

router.post("/save-account-details", saveUserAccountDetails);

export default router;
