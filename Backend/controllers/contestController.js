import Contest from "../models/contestModel.js";
import User from "../models/userModel.js";

export const createContest = async (req, res) => {
  try {
    // Get organizer info from authenticated user (middleware should set req.firebaseUser)
    // Find the organizer's User document
    const {
      title,
      description,
      startDate,
      endDate,
      startTime,
      endTime,
      coverImageUrl,
      contestLogoImageUrl,
      positions,
      participants,
      status,
      type,
      uid,
    } = req.body;

    const organizer = await User.findOne({ firebaseUid: uid });
    if (!organizer) {
      return res.status(404).json({ message: "Organizer not found" });
    }

    // Prepare contest data

    // Create the contest
    const contest = await Contest.create({
      title,
      description,
      organizer: organizer._id,
      firebaseUid: uid,
      startDate,
      endDate,
      startTime,
      endTime,
      coverImageUrl,
      contestLogoImageUrl,
      positions,
      participants,
      status,
      type,
    });

    res.status(201).json({ message: "Contest created successfully", contest });
  } catch (err) {
    console.error("Failed to create contest:", err.message);
    res.status(500).json({ message: "Server error" });
  }
};

// Edit contest details
export const editContest = async (req, res) => {
  try {
    const { contestId } = req.params;
    const updateData = req.body;

    const contest = await Contest.findByIdAndUpdate(contestId, updateData, {
      new: true,
    });

    if (!contest) {
      return res.status(404).json({ message: "Contest not found" });
    }

    res.status(200).json({ message: "Contest updated successfully", contest });
  } catch (err) {
    console.error("Failed to edit contest:", err.message);
    res.status(500).json({ message: "Server error" });
  }
};

// Add a voter to a contest
export const addVoter = async (req, res) => {
  try {
    const { contestId } = req.params;
    const { name, email, votedFor } = req.body; // votedFor = participant _id

    const contest = await Contest.findById(contestId);
    if (!contest) {
      return res.status(404).json({ message: "Contest not found" });
    }

    // Add voter
    contest.voters.push({ name, email, votedFor });
    await contest.save();

    res
      .status(200)
      .json({ message: "Voter added successfully", voters: contest.voters });
  } catch (err) {
    console.error("Failed to add voter:", err.message);
    res.status(500).json({ message: "Server error" });
  }
};

export const deleteContest = async (req, res) => {
  try {
    const { contestId } = req.params;
    const contest = await Contest.findByIdAndDelete(contestId);

    if (!contest) {
      return res.status(404).json({ message: "Contest not found" });
    }

    res.status(200).json({ message: "Contest deleted successfully" });
  } catch (err) {
    console.error("Failed to delete contest:", err.message);
    res.status(500).json({ message: "Server error" });
  }
};

export const getOrganizerContests = async (req, res) => {
  try {
    const { organizerId } = req.params;
    const contests = await Contest.find({ organizer: organizerId }).sort({
      createdAt: -1,
    });
    res.status(200).json({ contests });
  } catch (err) {
    console.error("Failed to get organizer contests:", err.message);
    res.status(500).json({ message: "Server error" });
  }
};
