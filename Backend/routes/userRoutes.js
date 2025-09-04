import express from "express";
<<<<<<< HEAD
<<<<<<< HEAD
import { saveUser, updateUserRole } from "../controllers/userController.js";
=======
=======
>>>>>>> 4cb84f74b69a8693bca6b47fe8eeddbf07295aa8
import {
  saveUser,
  updateUserRole,
  updateUserProfile,
} from "../controllers/userController.js";
<<<<<<< HEAD
>>>>>>> oscar-branch
=======
>>>>>>> 4cb84f74b69a8693bca6b47fe8eeddbf07295aa8
import { verifyFirebaseToken } from "../middleware/firebaseAuth.js";

const router = express.Router();

router.post("/save-user", verifyFirebaseToken, saveUser);
router.post("/update-role", verifyFirebaseToken, updateUserRole); // ✅ new route

<<<<<<< HEAD
<<<<<<< HEAD
=======
router.post("/update-profile", updateUserProfile); // ✅ new route

>>>>>>> oscar-branch
=======
router.post("/update-profile", updateUserProfile); // ✅ new route

>>>>>>> 4cb84f74b69a8693bca6b47fe8eeddbf07295aa8
export default router;
