import mongoose from "mongoose";

const commentSchema = new mongoose.Schema({
  contestantId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'Contest.positions.contestants' // Reference to contestant in contest
  },
  contestId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'Contest'
  },
  userName: {
    type: String,
    required: true
  },
  comment: {
    type: String,
    required: true,
    trim: true
  },
  parentCommentId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Comment',
    default: null
  },
  timestamp: {
    type: Date,
    default: Date.now
  }
});

const Comment = mongoose.model("Comment", commentSchema);

export default Comment;
