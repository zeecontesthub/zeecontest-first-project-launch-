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
      closedContestType,
      authenticationField,
      closedContestVoters,
      isVoteCountVisible,
      resultRevealSetting,
      revealDate,
      revealTime,
      isResultReleased,
      _id, // _id is optional for editing
      uid,
    } = req.body;

    const organizer = await User.findOne({ firebaseUid: uid });
    if (!organizer) {
      return res.status(404).json({ message: "Organizer not found" });
    }

    let finalVoters = closedContestVoters || [];
    if (closedContestType === "bulk-upload" && authenticationField) {
      finalVoters = finalVoters.map((v) => {
        if (v.customData && v.customData[authenticationField]) {
          v.customKey = v.customData[authenticationField].toString().trim();
        }
        return v;
      });
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
      closedContestType,
      authenticationField,
      closedContestVoters: finalVoters,
      isVoteCountVisible,
      resultRevealSetting,
      revealDate,
      revealTime,
      isResultReleased,
      socialLinks: req.body.socialLinks,
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
    const { status, startDate, startTime, endDate, endTime, isResultReleased } = req.body;

    // Build update object based on what is sent
    const updateData = {};
    if (status) updateData.status = status;
    if (startDate) updateData.startDate = startDate;
    if (startTime) updateData.startTime = startTime;
    if (endDate) updateData.endDate = endDate;
    if (endTime) updateData.endTime = endTime;
    if (isResultReleased !== undefined) updateData.isResultReleased = isResultReleased;

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

    // Format contest date/time
    const startDate = new Date(contest.startDate).toLocaleDateString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });
    const endDate = new Date(contest.endDate).toLocaleDateString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });

    const startTime = `${contest.startTime.startTimeHour}:${contest.startTime.startTimeMinute} ${contest.startTime.startTimeAmPm}`;
    const endTime = `${contest.endTime.endTimeHour}:${contest.endTime.endTimeMinute} ${contest.endTime.endTimeAmPm}`;

    // Add unverified voter with code
    contest.closedContestVoters.push({
      name: voterName,
      email: voterEmail,
      code,
      verified: false,
    });
    await contest.save();

    // Setup transporter for Resend
    const resendApiKey = process.env.RESEND_API_KEY;

    if (resendApiKey && resendApiKey !== "your_resend_api_key_here") {
      const transporter = nodemailer.createTransport({
        host: "smtp.resend.com",
        port: 587,
        secure: false, // STARTTLS
        auth: {
          user: "resend",
          pass: resendApiKey,
        },
      });

      // Send email
      await transporter.sendMail({
        from: `"ZEECONTEST Support" <support@zeecontest.com>`, // Updated to verified domain
        to: voterEmail,
        subject: `Your Voting Verification Code – ${contest.title}`,
        html: `
          <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
            <h2 style="color: #0A84FF;">Hello ${voterName},</h2>
            <p>Thank you for registering to vote in <b>${contest.title}</b>.</p>
            
            <p>Your one-time verification code is:</p>
            <div style="margin: 20px 0; padding: 12px; background: #f4f4f4;
                        border: 1px solid #ddd; border-radius: 6px;
                        display: inline-block; font-size: 20px; font-weight: bold;
                        letter-spacing: 2px; color: #0A84FF;">
              ${code}
            </div>

            <p>Please enter this code to confirm your vote.</p>

            <h3 style="margin-top: 24px; color: #444;">📅 Contest Schedule</h3>
            <p>
              <b>Start:</b> ${startDate}, ${startTime} <br/>
              <b>End:</b> ${endDate}, ${endTime}
            </p>

            <p style="font-size: 14px; color: #777;">If you didn’t request this code, please ignore this email.</p>
            
            <hr style="margin: 24px 0; border: none; border-top: 1px solid #eee;">
            <p style="font-size: 12px; color: #999;">© ${new Date().getFullYear()} ZEECONTEST. All rights reserved.</p>
          </div>
        `,
      });
      console.log(`Verification email sent to ${voterEmail}`);
    } else {
      console.log("-----------------------------------------");
      console.log("DEVELOPMENT MODE: RESEND_API_KEY missing.");
      console.log(`To: ${voterEmail}`);
      console.log(`Verification Code: ${code}`);
      console.log("-----------------------------------------");
    }

    return res.status(200).json({
      message: resendApiKey && resendApiKey !== "your_resend_api_key_here"
        ? "Verification code sent to email"
        : "Verification code generated (check server console in dev)",
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
    let { email, code, customKey, votedFor, multiplier = 1 } = req.body;

    // normalize types
    multiplier = Number(multiplier) || 1;

    const contest = await Contest.findById(contestId);
    if (!contest) return res.status(404).json({ message: "Contest not found" });

    let voter;
    if (contest.closedContestType === "bulk-upload") {
      // Find voter by their custom authentication key natively mapped
      if (!customKey) return res.status(400).json({ message: "Verification key is required" });

      voter = contest.closedContestVoters.find(
        (v) => v.customKey && v.customKey.toLowerCase() === customKey.trim().toLowerCase()
      );
      if (!voter) {
        return res.status(400).json({ message: `Invalid ${contest.authenticationField || 'Verification Key'}` });
      }
    } else {
      // Normal pre-registration email/code check
      const codeNum = Number(code);
      voter = contest.closedContestVoters.find(
        (v) => v.email === email && v.code === codeNum
      );
      if (!voter) {
        return res.status(400).json({ message: "Invalid code or email" });
      }
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

    const query = {};

    if (q) query.title = { $regex: q, $options: "i" };
    if (status) {
      query.status = status;
    } else {
      query.status = { $ne: "draft" }; // Default: Exclude drafts
    }
    if (type) query.type = type; // optional filter

    const pageNum = Math.max(parseInt(page, 10) || 1, 1);
    const lim = Math.min(Math.max(parseInt(limit, 10) || 30, 1), 100);

    const [contests, total] = await Promise.all([
      Contest.aggregate([
        { $match: query },
        { $sort: { createdAt: -1 } },
        { $skip: (pageNum - 1) * lim },
        { $limit: lim },
        {
          $project: {
            title: 1,
            status: 1,
            coverImageUrl: 1,
            isClosedContest: 1,
            positionCount: { $size: { $ifNull: ["$positions", []] } },
            totalContestants: {
              $sum: {
                $map: {
                  input: { $ifNull: ["$positions", []] },
                  as: "pos",
                  in: { $size: { $ifNull: ["$$pos.contestants", []] } }
                }
              }
            },
            totalVotes: {
              $add: [
                {
                  $sum: {
                    $map: {
                      input: { $ifNull: ["$positions", []] },
                      as: "pos",
                      in: {
                        $sum: {
                          $map: {
                            input: { $ifNull: ["$$pos.voters", []] },
                            as: "voter",
                            in: { $max: [{ $ifNull: ["$$voter.multiplier", 1] }, 1] }
                          }
                        }
                      }
                    }
                  }
                },
                {
                  $sum: {
                    $map: {
                      input: { $ifNull: ["$closedContestVoters", []] },
                      as: "cvoter",
                      in: {
                        $multiply: [
                          { $max: [{ $ifNull: ["$$cvoter.multiplier", 1] }, 1] },
                          { $size: { $ifNull: ["$$cvoter.votedFor", []] } }
                        ]
                      }
                    }
                  }
                }
              ]
            }
          }
        }
      ]),
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
    const resendApiKey = process.env.RESEND_API_KEY;

    if (resendApiKey && resendApiKey !== "your_resend_api_key_here") {
      const transporter = nodemailer.createTransport({
        host: "smtp.resend.com",
        port: 587,
        secure: false, // STARTTLS
        auth: {
          user: "resend",
          pass: resendApiKey,
        },
      });

      const mailOptions = {
        from: `"Zeecontest" <support@zeecontest.com>`, // Updated to verified domain
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
      console.log(`Withdrawal email sent for ${userEmail}`);
    } else {
      console.log("-----------------------------------------");
      console.log("DEVELOPMENT MODE: RESEND_API_KEY missing.");
      console.log(`Withdrawal Request for: ${userName} (${userEmail})`);
      console.log(`Amount: ₦${amount}`);
      console.log(`Bank: ${bankName}, Acc: ${bankAccount}`);
      console.log("-----------------------------------------");
    }

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