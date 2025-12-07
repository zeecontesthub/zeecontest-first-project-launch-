import mongoose from "mongoose";
import Comment from "../models/commentModel.js";
import Contest from "../models/contestModel.js";

// Helper: resolve contestant name to contestantId within a contest
const findContestantIdByName = (contest, name) => {
  if (!contest || !contest.positions) return null;
  const lc = name.toLowerCase().trim();
  for (const pos of contest.positions) {
    for (const contestant of pos.contestants || []) {
      if ((contestant.name || '').toLowerCase().trim() === lc) {
        return contestant._id;
      }
    }
  }
  return null;
};

// Get comments for a contest or specific contestant
export const getComments = async (req, res) => {
  try {
    const { contestId, contestantId } = req.params;
    const query = { contestId };
    if (!contestantId || contestantId === 'general' || contestantId === 'null') {
      query.contestantId = null;
    } else {
      query.contestantId = contestantId;
    }
    const comments = await Comment.find(query).sort({ timestamp: -1 });
    res.status(200).json({ success: true, comments });
  } catch (error) {
    console.error('Error fetching comments:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch comments' });
  }
};

// Add comment (support @mentions by contestant name or id)
export const addComment = async (req, res) => {
  try {
    const { contestId, contestantId } = req.params;
    let { userName, comment, parentCommentId } = req.body;

    if (!comment || !comment.toString().trim()) {
      return res.status(400).json({ success: false, message: 'Comment text is required' });
    }

    comment = comment.toString().trim();
    userName = userName || 'Anonymous';

    // Validate contestId
    if (!mongoose.Types.ObjectId.isValid(contestId)) {
      return res.status(400).json({ success: false, message: 'Invalid contest ID' });
    }

    // Load contest once to enable name->id resolution
    const contest = await Contest.findById(contestId).lean();
    if (!contest) return res.status(404).json({ success: false, message: 'Contest not found' });

    // Determine target contestantId precedence: URL param > @mention in text
    let targetContestantId = null;
    if (contestantId && contestantId !== 'general' && contestantId !== 'null') {
      if (!mongoose.Types.ObjectId.isValid(contestantId)) {
        return res.status(400).json({ success: false, message: 'Invalid contestant ID' });
      }
      targetContestantId = contestantId;
    }

    // If no contestantId in URL, allow @mentions by either 24-hex id or by contestant name
    if (!targetContestantId) {
      // Check for direct id mention like @60d...24hex
      const idMatch = comment.match(/@([a-fA-F0-9]{24})/);
      if (idMatch && mongoose.Types.ObjectId.isValid(idMatch[1])) {
        targetContestantId = idMatch[1];
        comment = comment.replace(idMatch[0], '').trim();
      } else {
        // Check for name mention like @John Doe or @John
        const nameMatch = comment.match(/^@([\w\s.-]{1,100})/);
        if (nameMatch) {
          const name = nameMatch[1].trim();
          const resolved = findContestantIdByName(contest, name);
          if (resolved) {
            targetContestantId = resolved;
            comment = comment.replace(nameMatch[0], '').trim();
          }
        }
      }
    }

    const newComment = new Comment({
      contestantId: targetContestantId || null,
      contestId,
      userName,
      comment,
      parentCommentId: parentCommentId || null
    });

    await newComment.save();

    res.status(201).json({ success: true, message: 'Comment added successfully', comment: newComment });
  } catch (error) {
    console.error('Error adding comment:', error);
    res.status(500).json({ success: false, message: 'Failed to add comment' });
  }
};

// Get all comments for a contest
export const getAllCommentsForContest = async (req, res) => {
  try {
    const { contestId } = req.params;
    const comments = await Comment.find({ contestId }).sort({ timestamp: -1 });
    res.status(200).json({ success: true, comments });
  } catch (error) {
    console.error('Error fetching all comments for contest:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch comments' });
  }
};
