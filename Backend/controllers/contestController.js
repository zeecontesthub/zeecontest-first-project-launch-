import Contest from "../models/contestModel.js";
import User from "../models/userModel.js";
import nodemailer from "nodemailer";

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
      isClosedContest,
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
      isClosedContest,
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

      console.log(avatar);

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

    // Remove from positions[].contestants & voters
    contest.positions.forEach((position) => {
      // Remove contestant from this position
      position.contestants = position.contestants.filter(
        (c) => c._id.toString() !== contestantId
      );

      // Remove votes tied to this contestant in this position
      position.voters = position.voters.filter(
        (v) => v.votedFor?.toString() !== contestantId
      );
    });

    // Remove votes tied to this contestant globally in contest.voters
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

// open contest
export const addVote = async (req, res) => {
  try {
    const { contestId } = req.params;
    const { voterName, voterEmail, multiplier = 1, votedFor } = req.body;
    // votedFor is an array of { positionTitle, votedFor }

    if (!contestId || !voterName || !voterEmail || !Array.isArray(votedFor)) {
      return res.status(400).json({ message: "Missing or invalid fields" });
    }

    // Find contest
    const contest = await Contest.findById(contestId);
    if (!contest) {
      return res.status(404).json({ message: "Contest not found" });
    }

    // 🚫 Prevent duplicate votes across the whole contest if not allowed
    if (
      !contest.allowMultipleVotes &&
      contest.positions.some((pos) =>
        pos.voters.some((v) => v.email === voterEmail)
      )
    ) {
      return res.status(400).json({ message: "You have already voted" });
    }

    const voteResults = [];

    // Loop through each vote: { positionTitle, votedFor }
    for (const vote of votedFor) {
      const { positionTitle, votedFor: contestantId } = vote;

      // Find the position by its name (title)
      const position = contest.positions.find(
        (p) => p.name.toLowerCase() === positionTitle.toLowerCase()
      );
      if (!position) {
        return res
          .status(404)
          .json({ message: `Position not found: ${positionTitle}` });
      }

      // Find the contestant by _id inside this position
      const contestant = position.contestants.id(contestantId);
      if (!contestant) {
        return res.status(404).json({
          message: `Contestant not found in position ${position.name}`,
        });
      }

      // Check if this voter already voted for THIS contestant in THIS position
      const existingVoter = position.voters.find((v) => v.email === voterEmail);

      if (existingVoter) {
        // ➕ Increment multiplier instead of adding a duplicate record
        existingVoter.multiplier += multiplier;
        existingVoter.votedFor = contestantId;
      } else {
        // ➕ Push a new vote entry
        position.voters.push({
          name: voterName,
          email: voterEmail,
          votedFor: contestantId,
          multiplier,
        });
      }

      voteResults.push({
        position: position.name,
        votedFor: contestant.name,
      });
    }

    await contest.save();

    return res.status(200).json({
      message: "Votes recorded successfully",
      votes: voteResults,
      success: true,
    });
  } catch (error) {
    console.error("Error adding vote:", error);
    return res.status(500).json({ message: "Server error" });
  }
};

// closed contest
export const addVoters = async (req, res) => {
  try {
    const { contestId } = req.params;
    const { voterName, voterEmail } = req.body;

    if (!contestId || !voterName || !voterEmail) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    const contest = await Contest.findById(contestId);
    if (!contest) return res.status(404).json({ message: "Contest not found" });

    const alreadyAdded = contest.closedContestVoters.some(
      (v) => v.email === voterEmail
    );
    if (alreadyAdded) {
      return res
        .status(400)
        .json({ message: "You have already added your details" });
    }

    // Generate 6-digit numeric code
    const code = Math.floor(100000 + Math.random() * 900000);

    // Add unverified voter with code
    contest.closedContestVoters.push({
      name: voterName,
      email: voterEmail,
      code,
      verified: false,
    });
    await contest.save();

    // Setup transporter (use env vars for real secrets)
    const transporter = nodemailer.createTransport({
      host: "smtp.gmail.com",
      port: 465,
      secure: true,
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    // Send email
    await transporter.sendMail({
      from: `"Contest Vote" <${process.env.EMAIL_USER}>`,
      to: voterEmail,
      subject: "Your Voting Verification Code - ZEECONTEST",
      html: `<p>Hello ${voterName},</p>
             <p>Your verification code is <b>${code}</b>. 
             You will Enter this code to confirm your vote.</p>`,
    });

    return res.status(200).json({
      message: "Verification code sent to email",
      success: true,
      contest,
    });
  } catch (err) {
    console.error("Error adding voter:", err);
    res.status(500).json({ message: "Server error" });
  }
};

// DELETE /api/contests/:contestId/voters/:voterId

export const deleteVoter = async (req, res) => {
  try {
    const { contestId, voterId } = req.params;
    if (!contestId || !voterId) {
      return res
        .status(400)
        .json({ success: false, message: "Missing contestId or voterId" });
    }

    // Remove the subdocument from closedContestVoters
    const updatedContest = await Contest.findByIdAndUpdate(
      contestId,
      { $pull: { closedContestVoters: { _id: voterId } } },
      { new: true }
    );

    if (!updatedContest) {
      return res
        .status(404)
        .json({ success: false, message: "Contest not found" });
    }

    // Check if a voter with that id actually existed
    const stillExists = updatedContest.closedContestVoters.some(
      (v) => v._id.toString() === voterId
    );
    if (stillExists) {
      return res
        .status(404)
        .json({ success: false, message: "Voter not found in contest" });
    }

    return res.status(200).json({
      success: true,
      message: "Voter deleted successfully",
      contest: updatedContest,
    });
  } catch (err) {
    console.error("Error deleting voter:", err);
    return res.status(500).json({ success: false, message: "Server error" });
  }
};

export const addVerifyVote = async (req, res) => {
  try {
    const { contestId } = req.params;
    let { email, code, votedFor, multiplier = 1 } = req.body;

    // normalize types
    multiplier = Number(multiplier) || 1;
    const codeNum = Number(code);

    const contest = await Contest.findById(contestId);
    if (!contest) return res.status(404).json({ message: "Contest not found" });

    // find the unverified/registered voter by email+code
    const voter = contest.closedContestVoters.find(
      (v) => v.email === email && v.code === codeNum
    );
    if (!voter) {
      return res.status(400).json({ message: "Invalid code or email" });
    }

    // If multiple votes are not allowed and the voter already has multiplier > 0
    if (!contest.allowMultipleVotes && Number(voter.multiplier) > 0) {
      return res.status(400).json({ message: "You have already voted" });
    }

    if (contest.allowMultipleVotes && Number(voter.multiplier) > 0) {
      // initialize multiplier if missing, then add
      voter.multiplier = (Number(voter.multiplier) || 0) + multiplier;

      // set/overwrite votedFor (if you expect multiple votedFor entries, adjust accordingly)
      voter.votedFor = votedFor;

      // optionally clear the code so it can't be reused:
      // existingVoter.code = null;
    } else {
      // push a new voter entry (should rarely happen if you pre-registered voters)
      voter.multiplier = 1 * multiplier; // ensure numeric

      // set/overwrite votedFor (if you expect multiple votedFor entries, adjust accordingly)
      voter.votedFor = votedFor;
    }

    await contest.save();

    return res
      .status(200)
      .json({ message: "Vote Added successfully", success: true });
  } catch (err) {
    console.error("Error Adding Vote:", err);
    res.status(500).json({ message: "Server error" });
  }
};

// end of closed contest

// Get contests with pagination, search, and filters
export const getAllContests = async (req, res) => {
  try {
    const { page = 1, limit = 30, q = "", status, type } = req.query;

    const query = {
      status: { $ne: "draft" }, // Exclude drafts
    };

    if (q) query.title = { $regex: q, $options: "i" };
    if (status) query.status = status; // optional filter for non-draft statuses
    if (type) query.type = type; // optional filter

    const pageNum = Math.max(parseInt(page, 10) || 1, 1);
    const lim = Math.min(Math.max(parseInt(limit, 10) || 30, 1), 100);

    const [contests, total] = await Promise.all([
      Contest.find(query)
        .sort({ createdAt: -1 })
        .skip((pageNum - 1) * lim)
        .limit(lim),
      Contest.countDocuments(query),
    ]);

    res.status(200).json({
      contests,
      total,
      hasMore: pageNum * lim < total,
      page: pageNum,
      limit: lim,
    });
  } catch (err) {
    console.error("Failed to fetch contests:", err.message);
    res.status(500).json({ message: "Server error" });
  }
};

export const verifyPayment = async (req, res) => {
  const { reference } = req.body;

  if (!reference) {
    return res
      .status(400)
      .json({ success: false, message: "Reference is required" });
  }

  try {
    const paystackRes = await fetch(
      `https://api.paystack.co/transaction/verify/${reference}`,
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}`,
          "Content-Type": "application/json",
        },
      }
    );

    // Parse JSON body
    const responseData = await paystackRes.json();

    const { status, data } = responseData;

    if (status && data.status === "success") {
      return res.json({
        success: true,
        message: "Payment verified",
        data,
      });
    }

    return res.status(400).json({
      success: false,
      message: "Payment not successful",
    });
  } catch (error) {
    console.error("⚠️ Paystack verify error:", error);
    return res.status(500).json({
      success: false,
      message: "Verification failed",
      error: error.message,
    });
  }
};

export const getUserWallet = async (req, res) => {
  try {
    const { uid } = req.query;

    if (!uid) {
      return res.status(400).json({ success: false, message: "uid required" });
    }

    const contests = await Contest.find({ firebaseUid: uid }).sort({
      createdAt: -1,
    });

    let totalEarnings = 0; // sum of all contests
    let availableBalance = 0; // sum of contests not withdrawn and completed
    let thisMonthTotal = 0; // sum of contests this month
    let totalWithdrawals = 0; // sum of withdrawn contests
    let lastWithdrawalDate = null;

    const startOfMonth = new Date();
    startOfMonth.setDate(1);
    startOfMonth.setHours(0, 0, 0, 0);

    const detailed = contests.map((c) => {
      let votes = 0;
      const pricePerVote = c.payment?.amount || 0;

      // Calculate votes
      if (c.isClosedContest) {
        votes = (c.closedContestVoters || []).reduce(
          (sum, v) => sum + (v.multiplier || 0),
          0
        );
      } else if (Array.isArray(c.positions)) {
        const emailMap = {};
        c.positions.forEach((pos) => {
          (pos.voters || []).forEach((voter) => {
            const multiplier = voter.multiplier || 0;
            if (!emailMap[voter.email] || multiplier > emailMap[voter.email]) {
              emailMap[voter.email] = multiplier;
            }
          });
        });
        votes = Object.values(emailMap).reduce((sum, m) => sum + m, 0);
      }

      const revenue = votes * pricePerVote;

      // Totals
      totalEarnings += revenue;

      // Withdrawn contests
      if (c.payment?.isWithdrawn) {
        totalWithdrawals += revenue;
        if (!lastWithdrawalDate || c.payment.paymentDate > lastWithdrawalDate) {
          lastWithdrawalDate = c.payment.paymentDate;
        }
      }

      // Available balance: only completed contests not withdrawn
      if (!c.payment?.isWithdrawn) {
        availableBalance += revenue;
      }

      // Earnings for this month
      if (c.createdAt >= startOfMonth) {
        thisMonthTotal += revenue;
      }

      return {
        id: c._id,
        title: c.title,
        votes,
        totalVotes: votes,
        pricePerVote,
        revenue,
        createdAt: c.createdAt,
        status: c.status || "unknown",
        type: c.type,
        payment: c.payment,
      };
    });

    res.json({
      success: true,
      totalEarnings,
      availableBalance,
      totalWithdrawals,
      thisMonthEarnings: thisMonthTotal,
      lastWithdrawal: lastWithdrawalDate,
      contests: detailed,
    });
  } catch (err) {
    console.error("Wallet fetch failed:", err);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

export const withdrawal = async (req, res) => {
  try {
    const { uid } = req.params;
    const { amount, userName, userEmail, bankName, bankAccount, accountName } =
      req.body;

    if (!uid)
      return res.status(400).json({ success: false, message: "UID required" });

    const contests = await Contest.find({
      firebaseUid: uid,
      "payment.isWithdrawn": { $in: [false, null] },
      status: "completed",
    });

    if (!contests.length) {
      return res.status(400).json({
        success: false,
        message: "No eligible contests for withdrawal",
      });
    }

    let totalAmount = 0;
    const now = new Date();

    for (const contest of contests) {
      let votes = 0;
      const pricePerVote = contest.payment?.amount || 0;

      if (contest.isClosedContest) {
        votes = (contest.closedContestVoters || []).reduce(
          (sum, v) => sum + (v.multiplier || 0),
          0
        );
      } else {
        const emailMap = {};
        (contest.positions || []).forEach((pos) => {
          (pos.voters || []).forEach((v) => {
            if (!emailMap[v.email] || v.multiplier > emailMap[v.email]) {
              emailMap[v.email] = v.multiplier || 0;
            }
          });
        });
        votes = Object.values(emailMap).reduce((sum, m) => sum + m, 0);
      }

      const revenue = votes * pricePerVote;
      totalAmount += revenue;

      // Mark contest as withdrawn
      contest.payment.isWithdrawn = true;
      contest.payment.paymentDate = now;
      await contest.save();
    }

    // ----- SEND EMAIL TO Zeecontesthub -----
    const transporter = nodemailer.createTransport({
      host: "smtp.gmail.com",
      port: 465,
      secure: true,
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    const mailOptions = {
      from: `"Zeecontest" <${process.env.SMTP_USER}>`,
      to: "Zeecontesthub@gmail.com",
      subject: `Withdrawal Request from ${userName}`,
      html: `
        <h2>Withdrawal Details</h2>
        <p><strong>User:</strong> ${userName} (${userEmail})</p>
        <p><strong>Amount:</strong> ₦${amount}</p>
        <p><strong>Bank Name:</strong> ${bankName}</p>
        <p><strong>Account Number:</strong> ${bankAccount}</p>
        <p><strong>Account Holder:</strong> ${accountName}</p>
        <p>Please make the transfer accordingly.</p>
      `,
    };

    await transporter.sendMail(mailOptions);

    res.json({
      success: true,
      message: "Withdrawal successful, email sent to Zeecontesthub",
      totalAmount,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Server error" });
  }
};
