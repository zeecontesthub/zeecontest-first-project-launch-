// /models/User.js
import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  firebaseUid: { type: String, required: true, unique: true },
  email: { type: String, required: true },
  role: { type: String, default: null },
  name: String,
<<<<<<< HEAD
=======
  userImage: { type: String },
  orgName: { type: String, default: null },
  orgAbout: { type: String, default: null },
>>>>>>> oscar-branch
  createdAt: { type: Date, default: Date.now },
});

const User = mongoose.model("User", userSchema);

export default User; // ✅ This is what your controller expects
