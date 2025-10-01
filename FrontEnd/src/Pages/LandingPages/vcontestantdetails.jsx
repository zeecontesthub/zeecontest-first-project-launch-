import React, { useState, useEffect, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Crown, Medal, Award, Users, ChevronLeft } from 'lucide-react';
import axios from 'axios';

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
        console.error('Failed to fetch contest:', err);
      }
    };
    if (contestId) fetchContest();
  }, [contestId]);

  /** ----------  Helpers  ---------- */

  const positionInfo = useMemo(() => {
    return contest?.positions?.find((pos) => pos.name === position);
  }, [contest, position]);

  /**
   * All votes for THIS position.
   * - If open contest → positionInfo.voters
   * - If closed contest → contest.closedContestVoters filtered by positionTitle
   */
  const positionVotes = useMemo(() => {
    if (!contest || !positionInfo) return [];
    if (contest.isClosedContest) {
      return (
        contest.closedContestVoters?.filter((v) =>
          v.votedFor?.some?.((vv) => vv.positionTitle === position)
        ) || []
      ).flatMap((v) =>
        v.votedFor
          .filter((vv) => vv.positionTitle === position)
          .map((vv) => ({
            votedFor: vv.votedFor,
            multiplier: v.multiplier || 1,
          }))
      );
    } else {
      return (
        positionInfo.voters?.map((v) => ({
          votedFor: v.votedFor,
          multiplier: v.multiplier || 1,
        })) || []
      );
    }
  }, [contest, positionInfo, position]);

  /** ----------  Contestants with vote totals ---------- */
  const allContestants = useMemo(() => {
    if (!positionInfo?.contestants) return [];
    // Sum multipliers per candidate
    const voteCounts = {};
    positionVotes.forEach((v) => {
      const id = v.votedFor?.toString();
      if (id) {
        voteCounts[id] = (voteCounts[id] || 0) + (v.multiplier || 1);
      }
    });

    const totalVotes = Object.values(voteCounts).reduce((a, b) => a + b, 0);

    const withVotes = positionInfo.contestants.map((c, idx) => {
      const id = c._id?.toString() || idx.toString();
      const votes = voteCounts[id] || 0;
      const percentage =
        totalVotes > 0 ? ((votes / totalVotes) * 100).toFixed(1) : '0.0';
      return { ...c, id, votes, percentage };
    });

    withVotes.sort((a, b) => b.votes - a.votes);
    withVotes.forEach((c, i) => (c.rank = i + 1));
    return withVotes;
  }, [positionInfo, positionVotes]);

  const currentContestant = useMemo(() => {
    if (!allContestants.length) return null;
    return (
      allContestants.find(
        (c) => c._id?.toString() === contestantId || c.id === contestantId
      ) || allContestants[0]
    );
  }, [allContestants, contestantId]);

  /** ----------  UI helpers ---------- */
  const getRankIcon = (rank) => {
    switch (rank) {
      case 1:
        return <Crown className='w-6 h-6 text-yellow-500' />;
      case 2:
        return <Medal className='w-6 h-6 text-gray-400' />;
      case 3:
        return <Award className='w-6 h-6 text-orange-600' />;
      default:
        return null;
    }
  };

  const getRankColor = (rank) => {
    if (rank === 1) return 'text-yellow-600';
    if (rank === 2) return 'text-gray-600';
    if (rank === 3) return 'text-orange-600';
    return 'text-gray-600';
  };

  const getLeaderboardItemStyle = (isCurrent) =>
    isCurrent
      ? 'bg-gradient-to-r from-blue-50 to-indigo-50 border-2 border-blue-200 shadow-sm'
      : 'bg-gray-50 hover:bg-gray-100 border border-gray-200';

  const getLeaderboardRankStyle = (index) => {
    if (index === 0) return 'bg-yellow-500 text-white';
    if (index === 1) return 'bg-gray-400 text-white';
    if (index === 2) return 'bg-orange-500 text-white';
    return 'bg-gray-300 text-gray-700';
  };

  if (!currentContestant) {
    return (
      <div className='min-h-screen flex items-center justify-center bg-gray-50'>
        <div className='text-center p-8 bg-white rounded-xl shadow-lg max-w-md'>
          <h2 className='text-2xl font-bold text-gray-900 mb-3'>
            Contestant Not Found
          </h2>
          <p className='text-gray-600 mb-6'>
            The requested contestant could not be found.
          </p>
          <button
            onClick={() => navigate(-1)}
            className='px-6 py-3 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition-all duration-200 font-medium'
          >
            Back
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className='min-h-screen bg-teal-900 p-4 md:p-8'>
      <div className='max-w-4xl mx-auto'>
        {/* Header */}
        <div className='flex items-center gap-4 mb-8'>
          <button
            onClick={() => navigate(-1)}
            className='p-2 rounded-full hover:bg-white hover:shadow-md transition-all duration-200 bg-white/70'
            aria-label='Back'
          >
            <ChevronLeft size={24} className='text-gray-700' />
          </button>
          <h1 className='text-[40px] font-bold text-white'>
            Contestant Details
          </h1>
        </div>

        {/* Profile */}
        <div className='bg-white rounded-xl p-8 mb-8 shadow-sm border border-gray-200 text-center'>
          <div className='w-36 h-36 mx-auto rounded-full overflow-hidden bg-gradient-to-br from-blue-400 via-purple-500 to-pink-400 flex items-center justify-center text-white text-5xl font-bold mb-6 shadow-lg'>
            {currentContestant.image ? (
              <img
                src={currentContestant.image}
                alt={currentContestant.name}
                className='w-full h-full object-cover'
              />
            ) : (
              currentContestant.name.charAt(0)
            )}
          </div>

          <div className='flex items-center justify-center gap-3 mb-3'>
            <h2 className='text-3xl font-bold text-gray-900'>
              {currentContestant.name}
            </h2>
            {getRankIcon(currentContestant.rank)}
          </div>
          <p className='text-gray-600 text-lg mb-6'>
            {currentContestant.description ||
              currentContestant.bio ||
              'No description provided.'}
          </p>

          {/* Stats */}
          <div className='grid grid-cols-1 md:grid-cols-3 gap-8 max-w-lg mx-auto mb-8'>
            <div className='text-center p-4 bg-gray-50 rounded-xl border'>
              <div className='text-4xl font-bold text-gray-900 mb-1'>
                {currentContestant.votes}
              </div>
              <div className='text-sm font-medium text-gray-600'>
                Total Votes
              </div>
            </div>
            <div className='text-center p-4 bg-gray-50 rounded-xl border'>
              <div
                className={`text-4xl font-bold mb-1 ${getRankColor(
                  currentContestant.rank
                )}`}
              >
                #{currentContestant.rank}
              </div>
              <div className='text-sm font-medium text-gray-600'>
                Current Rank
              </div>
            </div>
            <div className='text-center p-4 bg-gray-50 rounded-xl border'>
              <div className='text-4xl font-bold text-blue-600 mb-1'>
                {currentContestant.percentage}%
              </div>
              <div className='text-sm font-medium text-gray-600'>
                Vote Share
              </div>
            </div>
          </div>

          {/* Contest Info */}
          <div className='flex flex-col md:flex-row gap-6 text-sm bg-gray-50 rounded-lg p-4 w-full max-w-lg place-self-center'>
            <div className='text-center md:text-left'>
              <span className='text-gray-600'>Contest: </span>
              <span className='font-semibold text-gray-900'>
                {contest?.title || 'Contest Name'}
              </span>
            </div>
            <div className='text-center md:text-left'>
              <span className='text-gray-600'>Position: </span>
              <span className='font-semibold text-gray-900'>{position}</span>
            </div>
          </div>

          <div className='flex justify-center'>
            <button
              className='mt-4 w-full max-w-xs bg-[#034045] hover:bg-[#045a60] text-white py-4 rounded-lg font-bold text-lg shadow-lg'
              onClick={() => {
                window.location.href = `/vote/${
                  contest._id
                }?position=${encodeURIComponent(
                  position
                )}&candidateId=${encodeURIComponent(
                  currentContestant.id || currentContestant._id
                )}&candidateName=${encodeURIComponent(currentContestant.name)}`;
              }}
            >
              Cast Your Vote
            </button>
          </div>
        </div>

        {/* Leaderboard */}
        <div className='bg-white rounded-xl p-6 shadow-sm border border-gray-200'>
          <h3 className='text-xl font-bold text-gray-900 mb-6 flex items-center gap-3'>
            <Users className='w-6 h-6 text-gray-700' />
            {position} Standings
          </h3>
          <div className='space-y-3'>
            {allContestants.map((c, i) => (
              <div
                key={c.id || i}
                className={`flex items-center gap-4 p-4 rounded-xl ${getLeaderboardItemStyle(
                  c.id === currentContestant.id
                )}`}
              >
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold ${getLeaderboardRankStyle(
                    i
                  )}`}
                >
                  {c.rank}
                </div>
                <div className='w-12 h-12 rounded-full overflow-hidden bg-gradient-to-br from-blue-400 via-purple-500 to-pink-400 flex items-center justify-center text-white text-lg font-bold'>
                  {c.image ? (
                    <img
                      src={c.image}
                      alt={c.name}
                      className='w-full h-full object-cover'
                    />
                  ) : (
                    c.name.charAt(0)
                  )}
                </div>
                <div className='flex-1'>
                  <div className='flex items-center gap-2 mb-1'>
                    <div className='font-semibold text-gray-900 text-lg'>
                      {c.name}
                    </div>
                    {getRankIcon(c.rank)}
                  </div>
                  <div className='text-sm text-gray-600 font-medium'>
                    {c.votes} votes • {c.percentage}%
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
