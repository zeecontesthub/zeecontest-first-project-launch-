import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { ChevronRight, Trophy, TrendingUp, Users, Clock, AlertCircle, Zap, Flame, Target, History, BarChart3 } from 'lucide-react';

const ZeeClash = ({ contestId }) => {
  const [contest, setContest] = useState(null);
  const [loading, setLoading] = useState(true);
  const [currentClash, setCurrentClash] = useState(null);
  const [clashHistory, setClashHistory] = useState([]);
  const [pollVotes, setPollVotes] = useState({ contestant1: 0, contestant2: 0 });
  const [userVote, setUserVote] = useState(null);
  const [activeTab, setActiveTab] = useState('current'); // 'current' or 'history'
  const [rotationTimer, setRotationTimer] = useState(3600); // 1 hour in seconds

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

  useEffect(() => {
    if (contest && contest.positions && contest.positions.length > 0) {
      generateNewClash();
    }
  }, [contest]);

  useEffect(() => {
    const timer = setInterval(() => {
      setRotationTimer(prev => {
        if (prev <= 1) {
          generateNewClash();
          return 3600; // Reset to 1 hour
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const calculateContestantMetrics = (contestant, position) => {
    // Simplified metrics calculation - in real implementation, this would use historical data
    const growthRate = Math.random() * 50 + 10; // Mock growth rate 10-60%
    const engagement = Math.random() * 100; // Mock engagement 0-100%
    const trend = Math.random() > 0.5 ? 'up' : 'down'; // Mock trend
    const momentum = Math.random() * 100; // Mock momentum 0-100%

    return { growthRate, engagement, trend, momentum };
  };

  const generateNewClash = () => {
    if (!contest || !contest.positions) return;

    // Select a random position
    const randomPosition = contest.positions[Math.floor(Math.random() * contest.positions.length)];
    if (!randomPosition.contestants || randomPosition.contestants.length < 2) return;

    // Select two contestants based on criteria (simplified: random for now)
    const shuffled = [...randomPosition.contestants].sort(() => 0.5 - Math.random());
    const contestant1 = shuffled[0];
    const contestant2 = shuffled[1];

    const metrics1 = calculateContestantMetrics(contestant1, randomPosition.name);
    const metrics2 = calculateContestantMetrics(contestant2, randomPosition.name);

    const newClash = {
      id: Date.now(),
      position: randomPosition.name,
      contestant1: { ...contestant1, metrics: metrics1 },
      contestant2: { ...contestant2, metrics: metrics2 },
      timestamp: new Date(),
      zeeAnalysis: generateZeeAnalysis(contestant1, contestant2, metrics1, metrics2, randomPosition.name)
    };

    // Move current clash to history if exists
    if (currentClash) {
      setClashHistory(prev => [currentClash, ...prev].slice(0, 10)); // Keep last 10
    }

    setCurrentClash(newClash);
    setPollVotes({ contestant1: 0, contestant2: 0 });
    setUserVote(null);
  };

  const generateZeeAnalysis = (c1, c2, m1, m2, positionName) => {
    const momentumLeader = m1.momentum > m2.momentum ? c1.name : c2.name;
    const gap = Math.abs(m1.momentum - m2.momentum);
    const isClose = gap < 20;

    const introductions = [
      `🥊 It's a heated moment in the ${positionName} category — ${c1.name} vs. ${c2.name}! ${c1.name}'s been on a voting streak all morning, while ${c2.name}'s fans are suddenly waking up. Let's see who has the momentum!`,
      `🔥 The crowd's roaring for this one — ${c1.name} versus ${c2.name} in the ${positionName} position! ${momentumLeader} seems to have the edge right now, but anything can happen!`,
      `⚡ A close battle indeed in the ${positionName} category — ${c1.name} and ${c2.name} are neck and neck. I can barely call it!`
    ];

    const analysis = isClose
      ? `${c1.name} has a slight momentum advantage with ${m1.momentum.toFixed(1)}% burst, but ${c2.name} is closing the gap fast with ${m2.momentum.toFixed(1)}% activity. This could flip at any moment!`
      : `${momentumLeader} is dominating with strong momentum, but ${gap > 30 ? 'there\'s still time for a comeback' : 'the race is heating up'}. Keep an eye on those vote trends!`;

    return {
      introduction: introductions[Math.floor(Math.random() * introductions.length)],
      analysis: analysis
    };
  };

  const handleVote = (contestant) => {
    if (userVote) return; // Prevent multiple votes

    setPollVotes(prev => ({
      ...prev,
      [contestant]: prev[contestant] + 1
    }));
    setUserVote(contestant);
  };

  const getPollPercentages = () => {
    const total = pollVotes.contestant1 + pollVotes.contestant2;
    if (total === 0) return { contestant1: 50, contestant2: 50 };

    return {
      contestant1: Math.round((pollVotes.contestant1 / total) * 100),
      contestant2: Math.round((pollVotes.contestant2 / total) * 100)
    };
  };

  const getZeePollComment = () => {
    const percentages = getPollPercentages();
    const leader = percentages.contestant1 > percentages.contestant2 ? currentClash.contestant1.name : currentClash.contestant2.name;
    const leaderPercent = Math.max(percentages.contestant1, percentages.contestant2);

    if (leaderPercent > 60) {
      return `Interesting! ${leaderPercent}% of you believe ${leader} will take it. Let's see if the numbers agree later 👀`;
    } else {
      return `A tight poll! ${leader} has a slim lead with ${leaderPercent}%. This could go either way 🔥`;
    }
  };

  const formatTime = (seconds) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    return `${hours}:${minutes.toString().padStart(2, '0')}`;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-cyan-500"></div>
        <span className="ml-2 text-gray-600">Zee is setting up the clash...</span>
      </div>
    );
  }

  const contestStatus = getContestStatus();

  if (contestStatus === 'not_started') {
    return (
      <div className="text-center py-8">
        <div className="bg-gradient-to-r from-yellow-50 to-orange-50 p-6 rounded-xl border border-yellow-200 max-w-md mx-auto">
          <div className="flex items-center justify-center mb-4">
            <Clock className="w-12 h-12 text-yellow-600" />
          </div>
          <h3 className="text-xl font-bold text-gray-800 mb-2">Contest Not Started</h3>
          <p className="text-gray-600">This contest has not started yet. Live clash will be available once the contest is live!</p>
        </div>
      </div>
    );
  }

  if (contestStatus === 'ended') {
    return (
      <div className="text-center py-8">
        <div className="bg-gradient-to-r from-green-50 to-emerald-50 p-6 rounded-xl border border-green-200 max-w-md mx-auto">
          <div className="flex items-center justify-center mb-4">
            <Trophy className="w-12 h-12 text-green-600" />
          </div>
          <h3 className="text-xl font-bold text-gray-800 mb-2">Contest Ended</h3>
          <p className="text-gray-600">This contest has ended and there are no live clashes. Thanks for using Zee Contest!</p>
        </div>
      </div>
    );
  }

  if (!contest || !currentClash) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-600">No clash data available yet.</p>
      </div>
    );
  }

  const percentages = getPollPercentages();

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center">
        <h2 className="text-3xl font-bold text-gray-900 mb-2">Zee Clash ⚡</h2>
        <p className="text-gray-600">Live AI-powered battle zone</p>
        <div className="flex items-center justify-center space-x-2 mt-2">
          <Clock className="w-4 h-4 text-gray-500" />
          <span className="text-sm text-gray-500">Next clash in: {formatTime(rotationTimer)}</span>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex space-x-1 bg-gray-100 p-1 rounded-lg">
        <button
          onClick={() => setActiveTab('current')}
          className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
            activeTab === 'current' ? 'bg-white text-cyan-600 shadow-sm' : 'text-gray-600 hover:text-gray-800'
          }`}
        >
          Current Clash
        </button>
        <button
          onClick={() => setActiveTab('history')}
          className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
            activeTab === 'history' ? 'bg-white text-cyan-600 shadow-sm' : 'text-gray-600 hover:text-gray-800'
          }`}
        >
          History
        </button>
      </div>

      {activeTab === 'current' && currentClash && (
        <div className="space-y-6 max-h-96 overflow-y-auto">
          {/* Zee's Introduction */}
          <div className="bg-gradient-to-r from-purple-50 to-pink-50 p-6 rounded-xl border border-purple-200">
            <div className="flex items-center space-x-3 mb-4">
              <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center">
                <Zap className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-gray-800">Zee's Commentary</h3>
                <p className="text-sm text-gray-600">AI Battle Analyst</p>
              </div>
            </div>
            <p className="text-gray-700 leading-relaxed">{currentClash.zeeAnalysis.introduction}</p>
          </div>

          {/* Contestant Cards */}
          <div className="grid md:grid-cols-2 gap-4">
            {/* Contestant 1 */}
            <div className="bg-gradient-to-br from-cyan-50 to-blue-50 p-6 rounded-xl border border-cyan-200">
              <div className="flex items-center space-x-4 mb-4">
                <img
                  src={currentClash.contestant1.image || '/placeholder-avatar.png'}
                  alt={currentClash.contestant1.name}
                  className="w-16 h-16 rounded-full object-cover border-2 border-cyan-300"
                />
                <div>
                  <h4 className="text-xl font-bold text-gray-800">{currentClash.contestant1.name}</h4>
                  <p className="text-sm text-gray-600">{currentClash.position}</p>
                </div>
              </div>

              {/* Mini Stats */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Growth Rate</span>
                  <div className="flex items-center space-x-1">
                    <TrendingUp className={`w-4 h-4 ${currentClash.contestant1.metrics.trend === 'up' ? 'text-green-500' : 'text-red-500'}`} />
                    <span className="text-sm font-medium">{currentClash.contestant1.metrics.growthRate.toFixed(1)}%</span>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Engagement</span>
                  <span className="text-sm font-medium">{currentClash.contestant1.metrics.engagement.toFixed(1)}%</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Momentum</span>
                  <div className="w-full bg-gray-200 rounded-full h-2 ml-2">
                    <div
                      className="bg-gradient-to-r from-cyan-500 to-blue-500 h-2 rounded-full"
                      style={{ width: `${currentClash.contestant1.metrics.momentum}%` }}
                    ></div>
                  </div>
                </div>
              </div>
            </div>

            {/* Contestant 2 */}
            <div className="bg-gradient-to-br from-orange-50 to-red-50 p-6 rounded-xl border border-orange-200">
              <div className="flex items-center space-x-4 mb-4">
                <img
                  src={currentClash.contestant2.image || '/placeholder-avatar.png'}
                  alt={currentClash.contestant2.name}
                  className="w-16 h-16 rounded-full object-cover border-2 border-orange-300"
                />
                <div>
                  <h4 className="text-xl font-bold text-gray-800">{currentClash.contestant2.name}</h4>
                  <p className="text-sm text-gray-600">{currentClash.position}</p>
                </div>
              </div>

              {/* Mini Stats */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Growth Rate</span>
                  <div className="flex items-center space-x-1">
                    <TrendingUp className={`w-4 h-4 ${currentClash.contestant2.metrics.trend === 'up' ? 'text-green-500' : 'text-red-500'}`} />
                    <span className="text-sm font-medium">{currentClash.contestant2.metrics.growthRate.toFixed(1)}%</span>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Engagement</span>
                  <span className="text-sm font-medium">{currentClash.contestant2.metrics.engagement.toFixed(1)}%</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Momentum</span>
                  <div className="w-full bg-gray-200 rounded-full h-2 ml-2">
                    <div
                      className="bg-gradient-to-r from-orange-500 to-red-500 h-2 rounded-full"
                      style={{ width: `${currentClash.contestant2.metrics.momentum}%` }}
                    ></div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Zee's Analysis */}
          <div className="bg-gradient-to-r from-green-50 to-emerald-50 p-6 rounded-xl border border-green-200">
            <div className="flex items-center space-x-3 mb-4">
              <Target className="w-6 h-6 text-green-600" />
              <h3 className="text-lg font-bold text-gray-800">Zee's Analysis</h3>
            </div>
            <p className="text-gray-700 leading-relaxed">{currentClash.zeeAnalysis.analysis}</p>
          </div>

          {/* Audience Poll */}
          <div className="bg-gradient-to-r from-indigo-50 to-purple-50 p-6 rounded-xl border border-indigo-200">
            <div className="flex items-center space-x-3 mb-4">
              <BarChart3 className="w-6 h-6 text-indigo-600" />
              <h3 className="text-lg font-bold text-gray-800">Audience Poll</h3>
            </div>
            <p className="text-gray-700 mb-4">Who do you think will win this face-off?</p>

            {/* Poll Buttons */}
            <div className="flex space-x-4 mb-4">
              <button
                onClick={() => handleVote('contestant1')}
                disabled={userVote !== null}
                className={`flex-1 py-3 px-4 rounded-lg font-medium transition-all ${
                  userVote === 'contestant1'
                    ? 'bg-cyan-500 text-white'
                    : userVote
                    ? 'bg-gray-200 text-gray-500 cursor-not-allowed'
                    : 'bg-cyan-100 text-cyan-700 hover:bg-cyan-200'
                }`}
              >
                {currentClash.contestant1.name}
              </button>
              <button
                onClick={() => handleVote('contestant2')}
                disabled={userVote !== null}
                className={`flex-1 py-3 px-4 rounded-lg font-medium transition-all ${
                  userVote === 'contestant2'
                    ? 'bg-orange-500 text-white'
                    : userVote
                    ? 'bg-gray-200 text-gray-500 cursor-not-allowed'
                    : 'bg-orange-100 text-orange-700 hover:bg-orange-200'
                }`}
              >
                {currentClash.contestant2.name}
              </button>
            </div>

            {/* Live Poll Results */}
            <div className="space-y-2">
              <div className="flex justify-between text-sm text-gray-600">
                <span>{currentClash.contestant1.name}: {percentages.contestant1}%</span>
                <span>{currentClash.contestant2.name}: {percentages.contestant2}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-4">
                <div
                  className="bg-gradient-to-r from-cyan-500 to-blue-500 h-4 rounded-l-full"
                  style={{ width: `${percentages.contestant1}%` }}
                ></div>
                <div
                  className="bg-gradient-to-r from-orange-500 to-red-500 h-4 rounded-r-full ml-auto"
                  style={{ width: `${percentages.contestant2}%`, marginLeft: 'auto' }}
                ></div>
              </div>
            </div>

            {/* Zee's Poll Comment */}
            {userVote && (
              <div className="mt-4 p-3 bg-white rounded-lg border">
                <p className="text-sm text-gray-700 italic">{getZeePollComment()}</p>
              </div>
            )}
          </div>
        </div>
      )}

      {activeTab === 'history' && (
        <div className="space-y-4 max-h-96 overflow-y-auto">
          <h3 className="text-xl font-bold text-gray-800">Clash History</h3>
          {clashHistory.length === 0 ? (
            <p className="text-gray-600 text-center py-8">No past clashes yet. Check back after the first rotation!</p>
          ) : (
            clashHistory.map((clash) => (
              <div key={clash.id} className="bg-white p-4 rounded-lg border border-gray-200">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-semibold text-gray-800">{clash.position} Clash</h4>
                  <span className="text-sm text-gray-500">{new Date(clash.timestamp).toLocaleString()}</span>
                </div>
                <div className="flex items-center space-x-4">
                  <div className="flex items-center space-x-2">
                    <Trophy className="w-4 h-4 text-cyan-600" />
                    <span className="text-sm">{clash.contestant1.name}</span>
                  </div>
                  <span className="text-gray-400">vs</span>
                  <div className="flex items-center space-x-2">
                    <Trophy className="w-4 h-4 text-orange-600" />
                    <span className="text-sm">{clash.contestant2.name}</span>
                  </div>
                </div>
                <p className="text-xs text-gray-600 mt-2 italic">{clash.zeeAnalysis.analysis}</p>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
};

export default ZeeClash;
