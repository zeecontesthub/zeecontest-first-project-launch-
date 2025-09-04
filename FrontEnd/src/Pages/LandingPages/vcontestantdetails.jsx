import React, { useState, useEffect, useMemo } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  Crown,
  Medal,
  Award,
  Users,
  ChevronLeft,
} from "lucide-react";
import axios from "axios";

const VContestantDetails = () => {
  const { position, contestantId, contestId } = useParams();
  const navigate = useNavigate();
  const [contest, setContest] = useState(null);

  useEffect(() => {
    const fetchContest = async () => {
      try {
        const res = await axios.get(`/api/contest/${contestId}`);
        setContest(res.data.contest);
      } catch (err) {
        console.error("Failed to fetch contest:", err);
      }
    };
    if (contestId) fetchContest();
  }, [contestId]);

  const positionInfo = useMemo(() => {
    return contest?.positions?.find((pos) => pos.name === position);
  }, [contest, position]);

  const allContestants = useMemo(() => {
    if (!positionInfo?.contestants) return [];
    const totalVoters = positionInfo.voters?.length || 0;
    const voteCounts = {};
    positionInfo.voters.forEach((voter) => {
      const id = voter.votedFor?.toString();
      if (id) {
        voteCounts[id] = (voteCounts[id] || 0) + 1;
      }
    });
    const contestantsWithVotes = positionInfo.contestants.map((c, idx) => {
      const id = c._id?.toString() || idx.toString();
      const votes = voteCounts[id] || 0;
      const percentage = totalVoters > 0 ? ((votes / totalVoters) * 100).toFixed(1) : "0.0";
      return {
        ...c,
        id,
        votes,
        percentage,
      };
    });
    contestantsWithVotes.sort((a, b) => b.votes - a.votes);
    contestantsWithVotes.forEach((c, idx) => {
      c.rank = idx + 1;
    });
    return contestantsWithVotes;
  }, [positionInfo]);

  const currentContestant = useMemo(() => {
    if (!allContestants.length) return null;
    return (
      allContestants.find(
        (c) => c._id === contestantId || c.id === contestantId
      ) || allContestants[0]
    );
  }, [allContestants, contestantId]);

  if (!currentContestant) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center p-8 bg-white rounded-xl shadow-lg max-w-md">
          <h2 className="text-2xl font-bold text-gray-900 mb-3">Contestant Not Found</h2>
          <p className="text-gray-600 mb-6">The requested contestant could not be found.</p>
          <button
            onClick={() => navigate(`/vcontest-details`)}
            className="px-6 py-3 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition-all duration-200 font-medium"
          >
            Back to Contest Details
          </button>
        </div>
      </div>
    );
  }

  const getRankIcon = (rank) => {
    switch (rank) {
      case 1:
        return <Crown className="w-6 h-6 text-yellow-500" />;
      case 2:
        return <Medal className="w-6 h-6 text-gray-400" />;
      case 3:
        return <Award className="w-6 h-6 text-orange-600" />;
      default:
        return null;
    }
  };

  const getRankColor = (rank) => {
    switch (rank) {
      case 1:
        return "text-yellow-600";
      case 2:
        return "text-gray-600";
      case 3:
        return "text-orange-600";
      default:
        return "text-gray-600";
    }
  };

  const getLeaderboardItemStyle = (index, isCurrentContestant) => {
    if (isCurrentContestant) {
      return "bg-gradient-to-r from-blue-50 to-indigo-50 border-2 border-blue-200 shadow-sm";
    }
    return "bg-gray-50 hover:bg-gray-100 border border-gray-200";
  };

  const getLeaderboardRankStyle = (index) => {
    switch (index) {
      case 0:
        return "bg-yellow-500 text-white";
      case 1:
        return "bg-gray-400 text-white";
      case 2:
        return "bg-orange-500 text-white";
      default:
        return "bg-gray-300 text-gray-700";
    }
  };

  return (
    <div className="min-h-screen bg-teal-900 p-4 md:p-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <button
            onClick={() => navigate(-1)}
            className="p-2 rounded-full hover:bg-white hover:shadow-md transition-all duration-200 bg-white/70"
            aria-label="Back to Contest Details"
          >
            <ChevronLeft size={24} className="text-gray-700" />
          </button>
          <h1 className="text-[40px] font-bold text-[#ffffff]">Contestant Details</h1>
        </div>

        {/* Profile Section */}
        <div className="bg-white rounded-xl p-8 mb-8 shadow-sm border border-gray-200">
          <div className="flex flex-col items-center">
            {/* Profile Image */}
            <div className="w-36 h-36 rounded-full overflow-hidden bg-gradient-to-br from-blue-400 via-purple-500 to-pink-400 flex items-center justify-center text-white text-5xl font-bold mb-6 shadow-lg">
              {currentContestant.image ? (
                <img
                  src={currentContestant.image}
                  alt={currentContestant.name}
                  className="w-full h-full object-cover"
                />
              ) : (
                currentContestant.name.charAt(0)
              )}
            </div>

            {/* Name and Rank */}
            <div className="text-center mb-6">
              <div className="flex items-center justify-center gap-3 mb-3">
                <h2 className="text-3xl font-bold text-gray-900">{currentContestant.name}</h2>
                {getRankIcon(currentContestant.rank)}
              </div>
              <p className="text-gray-600 text-lg leading-relaxed max-w-2xl">
                {currentContestant.description || currentContestant.bio || "No description provided."}
              </p>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 w-full max-w-lg mb-8">
              <div className="text-center p-4 bg-gradient-to-b from-gray-50 to-white rounded-xl border border-gray-200">
                <div className="text-4xl font-bold text-gray-900 mb-1">{currentContestant.votes}</div>
                <div className="text-sm font-medium text-gray-600">Total Votes</div>
              </div>
              <div className="text-center p-4 bg-gradient-to-b from-gray-50 to-white rounded-xl border border-gray-200">
                <div className={`text-4xl font-bold mb-1 ${getRankColor(currentContestant.rank)}`}>
                  #{currentContestant.rank}
                </div>
                <div className="text-sm font-medium text-gray-600">Current Rank</div>
              </div>
              <div className="text-center p-4 bg-gradient-to-b from-gray-50 to-white rounded-xl border border-gray-200">
                <div className="text-4xl font-bold text-blue-600 mb-1">{currentContestant.percentage}%</div>
                <div className="text-sm font-medium text-gray-600">Vote Share</div>
              </div>
            </div>

            {/* Contest Info */}
            <div className="flex flex-col md:flex-row gap-6 text-sm bg-gray-50 rounded-lg p-4 w-full max-w-lg">
              <div className="text-center md:text-left">
                <span className="text-gray-600">Contest: </span>
                <span className="font-semibold text-gray-900">{contest?.title || "Contest Name"}</span>
              </div>
              <div className="text-center md:text-left">
                <span className="text-gray-600">Position: </span>
                <span className="font-semibold text-gray-900">{position}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Leaderboard Section */}
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
          <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-3">
            <Users className="w-6 h-6 text-gray-700" />
            {position} Race Standings
          </h3>
          
          <div className="space-y-3">
            {allContestants.map((candidate, index) => (
              <div
                key={candidate.id || index}
                className={`flex items-center gap-4 p-4 rounded-xl transition-all duration-200 ${getLeaderboardItemStyle(index, candidate.id === currentContestant.id)}`}
              >
                {/* Rank Badge */}
                <div className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold shadow-sm ${getLeaderboardRankStyle(index)}`}>
                  {candidate.rank}
                </div>

                {/* Avatar */}
                <div className="w-12 h-12 bg-gradient-to-br from-blue-400 via-purple-500 to-pink-400 rounded-full flex items-center justify-center text-white text-lg font-bold shadow-sm">
                  {candidate.image ? (
                    <img
                      src={candidate.image}
                      alt={candidate.name}
                      className="w-full h-full object-cover rounded-full"
                    />
                  ) : (
                    candidate.name.charAt(0)
                  )}
                </div>

                {/* Candidate Info */}
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <div className="font-semibold text-gray-900 text-lg">{candidate.name}</div>
                    {getRankIcon(candidate.rank)}
                  </div>
                  <div className="text-sm text-gray-600 font-medium">
                    {candidate.votes} votes • {candidate.percentage}%
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default VContestantDetails;