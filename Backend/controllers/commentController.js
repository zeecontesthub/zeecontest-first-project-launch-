import Comment from "../models/commentModel.js";

// Get all comments for a specific contestant
export const getComments = async (req, res) => {
  try {
    const { contestId, contestantId } = req.params;

    const comments = await Comment.find({
      contestId,
      contestantId
    }).sort({ timestamp: -1 }); // Most recent first

    res.status(200).json({
      success: true,
      comments
    });
  } catch (error) {
    console.error('Error fetching comments:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch comments'
    });
  }
};

// Add a new comment for a contestant
export const addComment = async (req, res) => {
  try {
    const { contestId, contestantId } = req.params;
    const { userName, comment, parentCommentId } = req.body;

    if (!userName || !comment) {
      return res.status(400).json({
        success: false,
        message: 'User name and comment are required'
      });
    }

    const newComment = new Comment({
      contestantId,
      contestId,
      userName,
      comment,
      parentCommentId: parentCommentId || null
    });

    await newComment.save();

    res.status(201).json({
      success: true,
      message: 'Comment added successfully',
      comment: newComment
    });
  } catch (error) {
    console.error('Error adding comment:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to add comment'
    });
  }
};

// Get all comments for a contest (for live comments feed)
export const getAllCommentsForContest = async (req, res) => {
  try {
    const { contestId } = req.params;

    const comments = await Comment.find({ contestId }).sort({ timestamp: -1 });

    res.status(200).json({
      success: true,
      comments
    });
  } catch (error) {
    console.error('Error fetching all comments for contest:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch comments'
    });
  }
};
