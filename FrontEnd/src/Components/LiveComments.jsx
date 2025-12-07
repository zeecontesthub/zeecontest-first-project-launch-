import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Send, MessageCircle } from 'lucide-react';
import { GoogleAuthProvider, signInWithPopup, onAuthStateChanged } from 'firebase/auth';
import { auth } from '../firebase';

const LiveComments = ({ contestId }) => {
  const [comments, setComments] = useState([]);
  const [contestants, setContestants] = useState([]);
  const [newComment, setNewComment] = useState('');
  const [userName, setUserName] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [showMentionDropdown, setShowMentionDropdown] = useState(false);
  const [mentionQuery, setMentionQuery] = useState('');
  const [mentionPosition, setMentionPosition] = useState(0);
  const [cursorPosition, setCursorPosition] = useState(0);
  const [contest, setContest] = useState(null);
  const [user, setUser] = useState(null);

  useEffect(() => {
    // Fetch contestants for mention dropdown
    const fetchContestants = async () => {
      try {
        const res = await axios.get(`/api/contest/${contestId}`);
        const contestData = res.data.contest;
        setContest(contestData);
        const allContestants = contestData.positions?.flatMap(pos => pos.contestants) || [];
        setContestants(allContestants);
      } catch (err) {
        setContestants([]);
      }
    };
    fetchContestants();
  }, [contestId]);

  useEffect(() => {
    // Fetch comments for this contest
    const fetchComments = async () => {
      try {
        const res = await axios.get(`/api/contest/${contestId}/comments`);
        setComments(res.data.comments || []);
      } catch (err) {
        setComments([]);
      }
    };
    fetchComments();
  }, [contestId]);

  useEffect(() => {
    // Google auth state
    const storedName = localStorage.getItem('commentUserName');
    if (storedName) setUserName(storedName);
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      if (currentUser) {
        setUserName(currentUser.displayName);
        // Store for 30 days
        localStorage.setItem('commentUserName', currentUser.displayName);
        localStorage.setItem('commentUserNameExpiry', Date.now() + 30 * 24 * 60 * 60 * 1000);
      }
    });
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    // Expire stored name after 30 days
    const expiry = localStorage.getItem('commentUserNameExpiry');
    if (expiry && Date.now() > Number(expiry)) {
      localStorage.removeItem('commentUserName');
      localStorage.removeItem('commentUserNameExpiry');
      setUserName('');
    }
  }, []);

  const handleGoogleSignIn = async () => {
    try {
      const provider = new GoogleAuthProvider();
      await signInWithPopup(auth, provider);
      // Name will be set by auth state change
    } catch (error) {
      // handle error
    }
  };

  const handleCommentChange = (e) => {
    const value = e.target.value;
    const cursorPos = e.target.selectionStart;
    setCursorPosition(cursorPos);
    setNewComment(value);
    // Check for @ mention
    const textBeforeCursor = value.substring(0, cursorPos);
    const atIndex = textBeforeCursor.lastIndexOf('@');
    if (atIndex !== -1 && (atIndex === 0 || textBeforeCursor[atIndex - 1] === ' ')) {
      const query = textBeforeCursor.substring(atIndex + 1);
      setMentionQuery(query);
      setMentionPosition(atIndex);
      setShowMentionDropdown(true);
    } else {
      setShowMentionDropdown(false);
    }
  };

  const handleMentionSelect = (contestantName) => {
    const beforeMention = newComment.substring(0, mentionPosition);
    const afterMention = newComment.substring(cursorPosition);
    const newText = `${beforeMention}@${contestantName} ${afterMention}`;
    setNewComment(newText);
    setShowMentionDropdown(false);
    setMentionQuery('');
  };

  const filteredContestants = contestants.filter(c =>
    c.name.toLowerCase().includes(mentionQuery.toLowerCase())
  );

  const handleSubmitComment = async (e) => {
    e.preventDefault();
    if (!newComment.trim() || !userName.trim()) return;
    setSubmitting(true);
    try {
      await axios.post(`/api/contest/${contestId}/contestants/general/comments`, {
        userName,
        comment: newComment.trim()
      });
      setNewComment('');
      // Refresh comments after post
      const res = await axios.get(`/api/contest/${contestId}/comments`);
      setComments(res.data.comments || []);
    } catch (err) {
      // handle error
    } finally {
      setSubmitting(false);
    }
  };

  // Require Google sign-in for open contests
  if (contest && !contest.isClosedContest && !user) {
    return (
      <>
        <div className="text-center py-8">
          <p className="text-gray-600 mb-4">Sign in with Google to leave a comment</p>
          <button
            onClick={handleGoogleSignIn}
            className="bg-red-600 text-white px-6 py-2 rounded-lg hover:bg-red-700 transition-colors flex items-center gap-2 mx-auto"
          >
            <svg className="w-5 h-5" viewBox="0 0 24 24">
              <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
              <path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
              <path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
              <path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
            </svg>
            Sign in with Google
          </button>
        </div>
      </>
    );
  }

  return (
    <div className="space-y-4">
      <h4 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
        <MessageCircle className="w-5 h-5" />
        Live Comments
      </h4>
      <div className="max-h-96 overflow-y-auto space-y-4">
        {comments.length === 0 ? (
          <p className="text-gray-500 text-center py-4">No comments yet. Be the first to comment!</p>
        ) : (
          comments.map((comment, index) => (
            <div key={comment._id || index} className="bg-white p-4 rounded-lg shadow-sm border">
              <p className="text-sm text-gray-700">
                <span className="font-semibold text-blue-600">{comment.userName}</span>: {comment.comment}
              </p>
              <p className="text-xs text-gray-500 mt-1">{new Date(comment.timestamp).toLocaleString()}</p>
            </div>
          ))
        )}
      </div>
      <form onSubmit={handleSubmitComment} className="space-y-4">
        {/* Name input only for closed contests or if not signed in */}
        {(!contest || contest.isClosedContest || !user) && (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Your Name</label>
            <input
              type="text"
              value={userName}
              onChange={e => setUserName(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Enter your full name"
              required
            />
          </div>
        )}
        <div className="relative">
          <label className="block text-sm font-medium text-gray-700 mb-1">Comment</label>
          <textarea
            value={newComment}
            onChange={handleCommentChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
            rows={3}
            placeholder="Mention a contestant with @ and share your thoughts..."
            required
          />
          {showMentionDropdown && filteredContestants.length > 0 && (
            <div className="absolute z-10 w-full bg-white border border-gray-300 rounded-lg shadow-lg max-h-40 overflow-y-auto mt-1">
              {filteredContestants.map((c) => (
                <div
                  key={c._id}
                  onClick={() => handleMentionSelect(c.name)}
                  className="px-3 py-2 hover:bg-gray-100 cursor-pointer"
                >
                  {c.name}
                </div>
              ))}
            </div>
          )}
        </div>
        <button
          type="submit"
          disabled={submitting || !newComment.trim() || !userName.trim()}
          className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed flex items-center justify-center gap-2 transition-colors"
        >
          {submitting ? (
            <>
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
              Posting...
            </>
          ) : (
            <>
              <Send className="w-4 h-4" />
              Post Comment
            </>
          )}
        </button>
      </form>
    </div>
  );
};

export default LiveComments;
