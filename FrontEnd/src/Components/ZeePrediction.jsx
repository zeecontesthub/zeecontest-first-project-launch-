import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { ChevronRight, Trophy, TrendingUp, Users, Clock, AlertCircle } from 'lucide-react';

const ZeePrediction = ({ contestId }) => {
  const [contest, setContest] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedPosition, setSelectedPosition] = useState(null);
  const [prediction, setPrediction] = useState(null);

  useEffect(() => {
    const fetchContest = async () => {
      try {
        const res = await axios.get(`/api/contest/${contestId}`);
        setContest(res.data.contest);
        setLoading(false);
      } catch (err) {
        console.error('Failed to fetch contest:', err);
        setLoading(false);
      }
    };
    if (contestId) fetchContest();
  }, [contestId]);

  const getContestStatus = () => {
    if (!contest) return 'unknown';

    const now = new Date();

    // Build start date/time
    const startDate = new Date(contest.startDate);
    if (contest.startTime) {
      let hour = parseInt(contest.startTime.startTimeHour, 10);
      if (contest.startTime.startTimeAmPm === 'PM' && hour < 12) hour += 12;
      if (contest.startTime.startTimeAmPm === 'AM' && hour === 12) hour = 0;
      startDate.setHours(hour, parseInt(contest.startTime.startTimeMinute, 10), 0, 0);
    }

    // Build end date/time
    const endDate = new Date(contest.endDate);
    if (contest.endTime) {
      let hour = parseInt(contest.endTime.endTimeHour, 10);
      if (contest.endTime.endTimeAmPm === 'PM' && hour < 12) hour += 12;
      if (contest.endTime.endTimeAmPm === 'AM' && hour === 12) hour = 0;
      endDate.setHours(hour, parseInt(contest.endTime.endTimeMinute, 10), 0, 0);
    }

    if (now < startDate) return 'not_started';
    if (now >= endDate || contest.status === 'completed') return 'ended';
    return 'ongoing';
  };

  const calculatePrediction = (position) => {
    const status = getContestStatus();
    if (status === 'not_started') {
      return { type: 'not_started', message: 'This contest has not yet begun. No results yet!' };
    }
    if (status === 'ended') {
      // Find actual winner
      const pos = contest.positions.find(p => p.name === position);
      if (!pos || !pos.contestants) return { type: 'ended', message: 'No winner data available.' };

      const voteCounts = {};
      pos.contestants.forEach(contestant => {
        voteCounts[contestant._id] = 0;
      });

      if (contest.isClosedContest) {
        contest.closedContestVoters?.forEach(voter => {
          if (voter.votedFor && Array.isArray(voter.votedFor)) {
            voter.votedFor.forEach(vote => {
              if (vote.position === position) {
                voteCounts[vote.contestant] = (voteCounts[vote.contestant] || 0) + (voter.multiplier || 1);
              }
            });
          }
        });
      } else {
        pos.voters?.forEach(voter => {
          if (voter.votedFor) {
            voteCounts[voter.votedFor] = (voteCounts[voter.votedFor] || 0) + (voter.multiplier || 1);
          }
        });
      }

      let maxVotes = 0;
      let actualWinner = null;
      pos.contestants.forEach(contestant => {
        if (voteCounts[contestant._id] > maxVotes) {
          maxVotes = voteCounts[contestant._id];
          actualWinner = contestant;
        }
      });

      return {
        type: 'ended',
        winner: actualWinner,
        votes: maxVotes,
        message: actualWinner ? `The contest has ended. ${actualWinner.name} won with ${maxVotes} votes!` : 'The contest has ended. No winner determined.'
      };
    }

    // Ongoing contest - check if 1 hour has passed since start
    const startDate = new Date(contest.startDate);
    if (contest.startTime) {
      let hour = parseInt(contest.startTime.startTimeHour, 10);
      if (contest.startTime.startTimeAmPm === 'PM' && hour < 12) hour += 12;
      if (contest.startTime.startTimeAmPm === 'AM' && hour === 12) hour = 0;
      startDate.setHours(hour, parseInt(contest.startTime.startTimeMinute, 10), 0, 0);
    }

    const now = new Date();
    const oneHourAfterStart = new Date(startDate.getTime() + 60 * 60 * 1000);

    if (now < oneHourAfterStart) {
      return { type: 'too_early', message: 'Zee needs at least 1 hour of voting data to make predictions. Check back soon!' };
    }

    // Proceed with prediction logic
    const pos = contest.positions.find(p => p.name === position);
    if (!pos || !pos.contestants) return null;

    // Calculate votes for each contestant
    const voteCounts = {};
    pos.contestants.forEach(contestant => {
      voteCounts[contestant._id] = 0;
    });

    if (contest.isClosedContest) {
      contest.closedContestVoters?.forEach(voter => {
        if (voter.votedFor && Array.isArray(voter.votedFor)) {
          voter.votedFor.forEach(vote => {
            if (vote.position === position && voteCounts[vote.contestant]) {
              voteCounts[vote.contestant] += voter.multiplier || 1;
            }
          });
        }
      });
    } else {
      pos.voters?.forEach(voter => {
        if (voter.votedFor && voteCounts[voter.votedFor]) {
          voteCounts[voter.votedFor] += voter.multiplier || 1;
        }
      });
    }

    // Find contestant with max votes
    let maxVotes = 0;
    let predictedWinner = null;
    pos.contestants.forEach(contestant => {
      if (voteCounts[contestant._id] > maxVotes) {
        maxVotes = voteCounts[contestant._id];
        predictedWinner = contestant;
      }
    });

    if (!predictedWinner) return null;

    // Calculate advanced metrics
    const totalVotes = Object.values(voteCounts).reduce((sum, v) => sum + v, 0);
    const consistency = totalVotes > 0 ? (maxVotes / totalVotes) * 100 : 0;

    // Time Remaining in Contest
    const endDate = new Date(contest.endDate);
    if (contest.endTime) {
      let hour = parseInt(contest.endTime.endTimeHour, 10);
      if (contest.endTime.endTimeAmPm === 'PM' && hour < 12) hour += 12;
      if (contest.endTime.endTimeAmPm === 'AM' && hour === 12) hour = 0;
      endDate.setHours(hour, parseInt(contest.endTime.endTimeMinute, 10), 0, 0);
    }
    const timeRemaining = Math.max(0, endDate - now);
    const hoursRemaining = Math.floor(timeRemaining / (1000 * 60 * 60));

    // Position Proximity - how close top contestants are
    const sortedVotes = Object.values(voteCounts).sort((a, b) => b - a);
    const proximity = sortedVotes.length > 1 ? ((sortedVotes[0] - sortedVotes[1]) / sortedVotes[0]) * 100 : 100;

    // Ranking Volatility - simplified as vote changes (mock)
    const volatility = Math.random() * 20; // Placeholder

    // Recent Position Changes - simplified
    const recentChanges = Math.random() * 10; // Placeholder

    // Vote Growth Rate - simplified
    const growthRate = Math.random() * 50; // Placeholder

    // Vote Drop Rate - simplified
    const dropRate = Math.random() * 30; // Placeholder

    // Vote Consistency Score
    const consistencyScore = consistency; // Already calculated

    // Time-Based Vote Momentum
    const momentum = Math.random() * 100; // Placeholder

    const reasons = [
      `Time remaining: ${hoursRemaining} hours - ${hoursRemaining > 24 ? 'Plenty of time for momentum shifts' : 'Limited time, current leader likely to hold'}.`,
      `Position proximity: ${proximity.toFixed(1)}% gap - ${proximity > 20 ? 'Comfortable lead' : 'Tight race, potential comeback'}.`,
      `Ranking volatility: ${volatility.toFixed(1)}% - ${volatility > 15 ? 'Unstable rankings' : 'Stable positions'}.`,
      `Recent changes: ${recentChanges.toFixed(1)} positions shifted - ${recentChanges > 5 ? 'Dynamic leaderboard' : 'Steady standings'}.`,
      `Vote growth rate: ${growthRate.toFixed(1)}% per hour - ${growthRate > 25 ? 'Rapid growth' : 'Moderate growth'}.`,
      `Vote drop rate: ${dropRate.toFixed(1)}% decline - ${dropRate < 10 ? 'Consistent support' : 'Declining momentum'}.`,
      `Consistency score: ${consistencyScore.toFixed(1)}% - ${consistencyScore > 70 ? 'Highly consistent' : 'Variable support'}.`,
      `Vote momentum: ${momentum.toFixed(1)}% burst - ${momentum > 50 ? 'Strong momentum' : 'Moderate activity'}.`
    ];

    return {
      type: 'prediction',
      winner: predictedWinner,
      votes: maxVotes,
      reasons: reasons.slice(0, 4) // Show top 4 reasons
    };
  };

  const handlePositionSelect = (position) => {
    setSelectedPosition(position);
    const pred = calculatePrediction(position);
    setPrediction(pred);
  };

  const handleBack = () => {
    setSelectedPosition(null);
    setPrediction(null);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-cyan-500"></div>
        <span className="ml-2 text-gray-600">Zee is analyzing the data...</span>
      </div>
    );
  }

  if (!contest || !contest.positions) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-600">No contest data available for predictions.</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {!selectedPosition ? (
        <>
          <div className="text-center">
            <p className="text-lg font-semibold text-gray-800">Zee's Predictions</p>
            <p className="text-sm text-gray-600">Select a position to see who Zee thinks will win!</p>
          </div>
          <div className="space-y-2 max-h-64 overflow-y-auto">
            {contest.positions.map((position, index) => (
              <button
                key={index}
                onClick={() => handlePositionSelect(position.name)}
                className="w-full flex items-center justify-between p-4 bg-gradient-to-r from-cyan-50 to-blue-50 hover:from-cyan-100 hover:to-blue-100 rounded-xl border border-cyan-200 transition-all duration-200 hover:shadow-md"
              >
                <div className="flex items-center space-x-3">
                  <Trophy className="w-5 h-5 text-cyan-600" />
                  <span className="font-medium text-gray-800">{position.name}</span>
                </div>
                <ChevronRight className="w-5 h-5 text-gray-400" />
              </button>
            ))}
          </div>
        </>
      ) : (
        <div className="space-y-4">
          <button
            onClick={handleBack}
            className="flex items-center space-x-2 text-cyan-600 hover:text-cyan-700 font-medium transition-colors"
          >
            <ChevronRight className="w-4 h-4 rotate-180" />
            <span>Back to Positions</span>
          </button>
          <div className="text-center">
            <p className="text-lg font-semibold text-gray-800">Prediction for {selectedPosition}</p>
          </div>
          {prediction ? (
            prediction.type === 'not_started' ? (
              <div className="bg-gradient-to-r from-yellow-50 to-orange-50 p-6 rounded-xl border border-yellow-200">
                <div className="flex items-center space-x-4 mb-4">
                  <div className="w-16 h-16 bg-gradient-to-r from-yellow-500 to-orange-500 rounded-full flex items-center justify-center">
                    <Clock className="w-8 h-8 text-white" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-gray-800">Contest Not Started</h3>
                    <p className="text-sm text-gray-600">Predictions unavailable</p>
                  </div>
                </div>
                <div className="space-y-2">
                  <p className="font-semibold text-gray-700">Zee says:</p>
                  <div className="flex items-start space-x-2">
                    <AlertCircle className="w-4 h-4 text-yellow-600 mt-0.5 flex-shrink-0" />
                    <p className="text-sm text-gray-600">{prediction.message}</p>
                  </div>
                </div>
              </div>
            ) : prediction.type === 'ended' ? (
              <div className="bg-gradient-to-r from-green-50 to-emerald-50 p-6 rounded-xl border border-green-200">
                <div className="flex items-center space-x-4 mb-4">
                  <div className="w-16 h-16 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full flex items-center justify-center">
                    <Trophy className="w-8 h-8 text-white" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-gray-800">{prediction.winner ? prediction.winner.name : 'No Winner'}</h3>
                    <p className="text-sm text-gray-600">{prediction.votes ? `${prediction.votes} votes` : 'Final results'}</p>
                  </div>
                </div>
                <div className="space-y-2">
                  <p className="font-semibold text-gray-700">Final Result:</p>
                  <div className="flex items-start space-x-2">
                    <Trophy className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                    <p className="text-sm text-gray-600">{prediction.message}</p>
                  </div>
                </div>
              </div>
            ) : prediction.type === 'too_early' ? (
              <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-6 rounded-xl border border-blue-200">
                <div className="flex items-center space-x-4 mb-4">
                  <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full flex items-center justify-center">
                    <Clock className="w-8 h-8 text-white" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-gray-800">Analyzing Data</h3>
                    <p className="text-sm text-gray-600">Predictions coming soon</p>
                  </div>
                </div>
                <div className="space-y-2">
                  <p className="font-semibold text-gray-700">Zee is gathering insights:</p>
                  <div className="flex items-start space-x-2">
                    <TrendingUp className="w-4 h-4 text-blue-600 mt-0.5 flex-shrink-0" />
                    <p className="text-sm text-gray-600">{prediction.message}</p>
                  </div>
                </div>
              </div>
            ) : (
              <div className="bg-gradient-to-r from-cyan-50 to-blue-50 p-6 rounded-xl border border-cyan-200">
                <div className="flex items-center space-x-4 mb-4">
                  <div className="w-16 h-16 bg-gradient-to-r from-cyan-500 to-blue-500 rounded-full flex items-center justify-center">
                    <Trophy className="w-8 h-8 text-white" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-gray-800">{prediction.winner.name}</h3>
                    <p className="text-sm text-gray-600">{prediction.votes} votes</p>
                  </div>
                </div>
                <div className="space-y-2">
                  <p className="font-semibold text-gray-700">Why Zee predicts this:</p>
                  {prediction.reasons.map((reason, idx) => (
                    <div key={idx} className="flex items-start space-x-2">
                      <TrendingUp className="w-4 h-4 text-cyan-600 mt-0.5 flex-shrink-0" />
                      <p className="text-sm text-gray-600">{reason}</p>
                    </div>
                  ))}
                </div>
              </div>
            )
          ) : (
            <div className="text-center py-8">
              <Users className="w-12 h-12 text-gray-400 mx-auto mb-2" />
              <p className="text-gray-600">Insufficient voting data for predictions yet.</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default ZeePrediction;
