import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { MessageCircle, User } from 'lucide-react';

const LiveComments = ({ contestId }) => {
  const [comments, setComments] = useState([]);
  const [contestants, setContestants] = useState({});
  const [loading, setLoading] = useState(true);
  const [commentMap, setCommentMap] = useState({});

  useEffect(() => {
    const fetchContestData = async () => {
      try {
        const res = await axios.get(`/api/contest/${contestId}`);
        const contest = res.data.contest;
        const contestantMap = {};
        contest.positions.forEach(position => {
          position.contestants.forEach(contestant => {
            contestantMap[contestant._id] = contestant.name;
          });
        });
        setContestants(contestantMap);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching contest data:', error);
        setLoading(false);
      }
    };

    fetchContestData();
  }, [contestId]);

  useEffect(() => {
    const fetchComments = async () => {
      try {
        const res = await axios.get(`/api/contest/${contestId}/comments`);
        const fetchedComments = res.data.comments || [];
        const commentMap = {};
        fetchedComments.forEach(comment => {
          commentMap[comment._id] = comment;
        });
        setCommentMap(commentMap);
        setComments(fetchedComments.slice(-10)); // Show last 10
      } catch (error) {
        console.error('Error fetching comments:', error);
      }
    };

    fetchComments();
    const interval = setInterval(fetchComments, 5000); // Poll every 5 seconds

    return () => clearInterval(interval);
  }, [contestId]);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-4 max-h-96 overflow-y-auto">
      <h4 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
        <MessageCircle className="w-5 h-5" />
        Live Comments Feed
      </h4>
      {comments.length === 0 ? (
        <p className="text-gray-500 text-center py-4">No comments yet. Be the first to comment!</p>
      ) : (
        comments.map((comment, index) => (
          <div
            key={comment._id || index}
            className="bg-white p-4 rounded-lg shadow-sm border animate-fadeIn"
            style={{ animationDelay: `${index * 0.1}s` }}
          >
            <p className="text-sm text-gray-700">
              {comment.parentCommentId ? (
                <>
                  <span className="font-semibold text-blue-600">{comment.userName}</span> replied to{' '}
                  <span className="font-semibold text-purple-600">{commentMap[comment.parentCommentId]?.userName || 'Unknown User'}</span>'s comment for{' '}
                  <span className="font-semibold text-green-600">{contestants[comment.contestantId] || 'Unknown Contestant'}</span>
                  : "{comment.comment}"
                </>
              ) : (
                <>
                  <span className="font-semibold text-blue-600">{comment.userName}</span> just dropped a comment for{' '}
                  <span className="font-semibold text-green-600">{contestants[comment.contestantId] || 'Unknown Contestant'}</span>
                  : "{comment.comment}"
                </>
              )}
            </p>
            <p className="text-xs text-gray-500 mt-1">
              {new Date(comment.timestamp).toLocaleString()}
            </p>
          </div>
        ))
      )}
    </div>
  );
};

export default LiveComments;
