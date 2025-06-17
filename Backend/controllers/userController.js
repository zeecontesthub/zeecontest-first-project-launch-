// /controllers/userController.js
import User from "../models/userModel.js";

export const saveUser = async (req, res) => {
  const { email, name } = req.body;
  const { uid } = req.firebaseUser;

  try {
    let user = await User.findOne({ firebaseUid: uid });

    if (!user) {
      user = await User.create({ firebaseUid: uid, email, name });
    } else {
      user.name = name; // update name if needed
      await user.save();
    }

    res.status(200).json({ message: "User saved", user });
  } catch (err) {
    console.error("Failed to save user:", err.message);
    res.status(500).json({ message: "Server error" });
  }
};

export const updateUserRole = async (req, res) => {
  const { uid } = req.firebaseUser;
  const { role } = req.body;

  if (!["organizer", "cheerleader"].includes(role)) {
    return res.status(400).json({ message: "Invalid role provided" });
  }

  try {
    const user = await User.findOne({ firebaseUid: uid });
    if (!user) return res.status(404).json({ message: "User not found" });

    user.role = role;
    await user.save();

    res.status(200).json({ message: "Role updated successfully", user });
  } catch (err) {
    console.error("Failed to update role:", err.message);
    res.status(500).json({ message: "Server error" });
  }
};
