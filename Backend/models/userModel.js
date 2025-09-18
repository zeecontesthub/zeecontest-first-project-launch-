// /models/User.js
import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  firebaseUid: { type: String, required: true, unique: true },
  email: { type: String, required: true },
  role: { type: String, default: null },
  name: String,
  userImage: { type: String },
  orgName: { type: String, default: null },
  orgAbout: { type: String, default: null },
  createdAt: { type: Date, default: Date.now },
  bankName: { type: String, default: null },
  accountNumber: { type: String, default: null },
  accountHolderName: { type: String, default: null },
});

const User = mongoose.model("User", userSchema);

export default User; // ✅ This is what your controller expects
