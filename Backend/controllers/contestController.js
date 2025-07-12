import Contest from "../models/contestModel.js";
import User from "../models/userModel.js";

export const createContest = async (req, res) => {
  try {
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
      payment,
      allowMultipleVotes,
      _id, // _id is optional for editing
      uid,
    } = req.body;

    const organizer = await User.findOne({ firebaseUid: uid });
    if (!organizer) {
      return res.status(404).json({ message: "Organizer not found" });
    }

    const contestData = {
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
      payment,
      allowMultipleVotes,
      status,
      type,
    };

    let contest;
    if (_id) {
      // Update existing contest
      contest = await Contest.findByIdAndUpdate(_id, contestData, {
        new: true,
      });
      if (!contest) {
        return res
          .status(404)
          .json({ message: "Contest not found for update" });
      }
      res
        .status(200)
        .json({ message: "Contest updated successfully", contest });
    } else {
      // Create new contest
      contest = await Contest.create(contestData);
      res
        .status(201)
        .json({ message: "Contest created successfully", contest });
    }
  } catch (err) {
    console.error("Failed to create/update contest:", err.message);
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

export const getContestById = async (req, res) => {
  try {
    const { contestId } = req.params;
    const contest = await Contest.findById(contestId);
    if (!contest) {
      return res.status(404).json({ message: "Contest not found" });
    }
    res.status(200).json({ contest });
  } catch (err) {
    console.error("Failed to get contest:", err.message);
    res.status(500).json({ message: "Server error" });
  }
};

export const updateContestStatus = async (req, res) => {
  try {
    const { contestId } = req.params;
    const { status, startDate, startTime, endDate, endTime } = req.body;

    // Build update object based on what is sent
    const updateData = {};
    if (status) updateData.status = status;
    if (startDate) updateData.startDate = startDate;
    if (startTime) updateData.startTime = startTime;
    if (endDate) updateData.endDate = endDate;
    if (endTime) updateData.endTime = endTime;

    const contest = await Contest.findByIdAndUpdate(contestId, updateData, {
      new: true,
    });

    if (!contest) {
      return res.status(404).json({ message: "Contest not found" });
    }

    res
      .status(200)
      .json({ message: "Contest status updated successfully", contest });
  } catch (err) {
    console.error("Failed to update contest status:", err.message);
    res.status(500).json({ message: "Server error" });
  }
};

// Add this function to your contestController.js
export const updateContestant = async (req, res) => {
  const { contestId, contestantId } = req.params;
  const { name, bio, avatar, position, email } = req.body;

  try {
    const contest = await Contest.findById(contestId);
    if (!contest) return res.status(404).json({ message: "Contest not found" });

    // Find the current position containing the contestant
    let oldPos = contest.positions.find((p) =>
      p.contestants.some((c) => c._id.toString() === contestantId)
    );
    if (!oldPos)
      return res
        .status(404)
        .json({ message: "Contestant not found in any position" });

    // Find the contestant
    let contestant = oldPos.contestants.id(contestantId);
    if (!contestant)
      return res.status(404).json({ message: "Contestant not found" });

    // If position changed, move contestant
    if (position && position !== oldPos.name) {
      oldPos.contestants = oldPos.contestants.filter(
        (c) => c._id.toString() !== contestantId
      );

      let newPos = contest.positions.find((p) => p.name === position);
      if (!newPos)
        return res.status(404).json({ message: "New position not found" });

      contestant.name = name;
      contestant.bio = bio;
      contestant.image = avatar;
      contestant.position = position;
      contestant.email = email;

      newPos.contestants.push(contestant);
    } else {
      // Update details without moving
      contestant.name = name;
      contestant.bio = bio;
      contestant.image = avatar;
      contestant.position = position;
      contestant.email = email;
    }

    // Update in participants array
    let participant = contest.participants.find(
      (p) => p._id.toString() === contestantId
    );
    if (participant) {
      participant.name = name;
      participant.bio = bio;
      participant.image = avatar;
      participant.position = position;
      participant.email = email;
    }

    await contest.save();
    res.json({ message: "Contestant updated successfully", contest });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

// Delete a contestant from a contest position
export const deleteContestant = async (req, res) => {
  const { contestId, contestantId } = req.params;

  try {
    const contest = await Contest.findById(contestId);
    if (!contest) return res.status(404).json({ message: "Contest not found" });

    // Remove from positions[].contestants
    const position = contest.positions.find((p) =>
      p.contestants.some((c) => c._id.toString() === contestantId)
    );
    if (!position)
      return res
        .status(404)
        .json({ message: "Contestant not found in any position" });

    position.contestants = position.contestants.filter(
      (c) => c._id.toString() !== contestantId
    );

    // Remove votes tied to this contestant
    position.voters = position.voters.filter(
      (v) => v.votedFor?.toString() !== contestantId
    );
    contest.voters = contest.voters.filter(
      (v) => v.votedFor?.toString() !== contestantId
    );

    // Remove from participants array
    contest.participants = contest.participants.filter(
      (p) => p._id.toString() !== contestantId
    );

    await contest.save();
    res.json({ message: "Contestant deleted successfully", contest });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};
