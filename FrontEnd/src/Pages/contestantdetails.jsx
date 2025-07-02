import React, { useState, useMemo, useEffect } from 'react';
import Sidebar from '../Components/sidebar';
import { useNavigate, useParams } from 'react-router-dom';
import { Edit, Share2, TrendingUp, TrendingDown, Clock, Target, Users, Trophy, ChevronLeft, Crown, Medal, Award, AlertTriangle } from "lucide-react";

// Import your position data (same as leaderboard)
import positionData from '../data/positionData';

const ContestantDetails = () => {
    const navigate = useNavigate();
    const { position, contestantId } = useParams(); // Get position and contestant ID from URL
    const [showRemoveModal, setShowRemoveModal] = useState(false);
    const [timeRemaining, setTimeRemaining] = useState('');

    // Dynamic vote distribution function (same as leaderboard)
    const distributeVotes = (totalVotes, contestants) => {
        const votes = [];
        let remainingVotes = totalVotes;

        for (let i = 0; i < contestants.length; i++) {
            const isLast = i === contestants.length - 1;
            let vote;

            if (isLast) {
                vote = remainingVotes;
            } else {
                const max = Math.floor(remainingVotes / (contestants.length - i) * 1.5);
                vote = Math.floor(Math.random() * (max + 1));
            }

            votes.push(vote);
            remainingVotes -= vote;
        }

        return contestants.map((c, i) => ({
            ...c,
            votes: votes[i],
            percentage: ((votes[i] / totalVotes) * 100).toFixed(1)
        }));
    };

    // Get current position data or default to first position
    const currentPosition = position || Object.keys(positionData)[0];
    const positionInfo = positionData[currentPosition];

    // Generate dynamic contestant data
    const allContestants = useMemo(() => {
        if (!positionInfo) return [];
        return distributeVotes(positionInfo.votersCount, positionInfo.contestants)
            .sort((a, b) => b.votes - a.votes)
            .map((contestant, index) => ({
                ...contestant,
                rank: index + 1,
                trend: Math.random() > 0.5 ? (Math.random() > 0.5 ? 'up' : 'down') : 'stable',
                momentum: Math.floor(Math.random() * 10) - 5, // -5 to +5 change
                dailyVotes: Array.from({length: 7}, () => Math.floor(Math.random() * 5))
            }));
    }, [currentPosition, positionInfo]);

    // Find current contestant (by ID or default to first contestant)
    const currentContestant = useMemo(() => {
        if (contestantId) {
            return allContestants.find(c => c.id === contestantId) || allContestants[0];
        }
        return allContestants[0];
    }, [allContestants, contestantId]);

    // Calculate dynamic metrics
    const dynamicMetrics = useMemo(() => {
        if (!currentContestant || !allContestants.length) return {};

        const totalVotes = positionInfo?.votersCount || 0;
        const leadingCandidate = allContestants[0];
        const nextRankCandidate = allContestants.find(c => c.rank === currentContestant.rank - 1);
        
        const contestProgress = Math.floor(Math.random() * 40) + 40; // 40-80% progress
        const votesToNextRank = nextRankCandidate ? nextRankCandidate.votes - currentContestant.votes + 1 : 0;
        const votesToWin = leadingCandidate && leadingCandidate.id !== currentContestant.id 
            ? leadingCandidate.votes - currentContestant.votes + 1 
            : 0;
        
        const winningProbability = Math.max(5, Math.min(95, 
            currentContestant.rank === 1 ? 85 : 
            currentContestant.rank <= 3 ? 60 - (currentContestant.rank * 10) :
            Math.max(5, 40 - (currentContestant.rank * 5))
        ));

        return {
            totalVotes,
            contestProgress,
            votesToNextRank,
            votesToWin,
            winningProbability,
            totalCandidates: allContestants.length
        };
    }, [currentContestant, allContestants, positionInfo]);

    // Dynamic time remaining calculation
    useEffect(() => {
        const updateTimeRemaining = () => {
            const endDate = new Date();
            endDate.setDate(endDate.getDate() + Math.floor(Math.random() * 5) + 1); // 1-5 days
            endDate.setHours(endDate.getHours() + Math.floor(Math.random() * 24));
            
            const now = new Date();
            const diff = endDate - now;
            
            if (diff > 0) {
                const days = Math.floor(diff / (1000 * 60 * 60 * 24));
                const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
                setTimeRemaining(`${days} days, ${hours} hours`);
            } else {
                setTimeRemaining('Contest ended');
            }
        };

        updateTimeRemaining();
        const interval = setInterval(updateTimeRemaining, 60000); // Update every minute
        
        return () => clearInterval(interval);
    }, []);

    // Performance data for the current contestant
    const performanceData = useMemo(() => {
        if (!currentContestant) return [];
        
        const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
        return days.map((day, index) => ({
            day,
            votes: currentContestant.dailyVotes?.[index] || Math.floor(Math.random() * 5)
        }));
    }, [currentContestant]);

    // Get strategic recommendations based on current position
    const getStrategicRecommendation = () => {
        if (!currentContestant) return { action: 'Share Your Link!', description: 'Get more votes to climb the leaderboard.' };
        
        const rank = currentContestant.rank;
        if (rank === 1) {
            return { action: 'Maintain Leadership!', description: 'Keep engaging supporters to secure your lead.' };
        } else if (rank <= 3) {
            return { action: 'Push for the Top!', description: `Get ${dynamicMetrics.votesToWin} more votes to take the lead.` };
        } else if (rank <= 5) {
            return { action: 'Enter Top 3!', description: `Get ${dynamicMetrics.votesToNextRank} more votes to reach rank #${rank - 1}.` };
        } else {
            return { action: 'Boost Your Campaign!', description: 'Share your link and mobilize supporters to climb higher.' };
        }
    };

    const strategicRecommendation = getStrategicRecommendation();

    // Handle contestant removal
    const handleRemoveContestant = () => {
        setShowRemoveModal(false);
        // In a real app, this would make an API call to remove the contestant
        navigate('/contest-details');
    };

    if (!currentContestant) {
        return (
            <div className="flex min-h-screen">
                <Sidebar />
                <div className="flex-1 w-full p-6 flex items-center justify-center">
                    <div className="text-center">
                        <AlertTriangle className="w-16 h-16 text-yellow-500 mx-auto mb-4" />
                        <h2 className="text-2xl font-bold text-gray-900 mb-2">Contestant Not Found</h2>
                        <p className="text-gray-600 mb-4">The requested contestant could not be found.</p>
                        <button
                            onClick={() => navigate('/contest-details')}
                            className="px-4 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition-colors"
                        >
                            Back to Contest Details
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="flex min-h-screen">
            <Sidebar />
            <div className="flex-1 w-full p-6">
                {/* Dynamic Header */}
                <div className="flex items-center mb-8 gap-4">
                    <button
                        onClick={() => navigate('/contest-details')}
                        className="p-2 rounded-full hover:bg-gray-200 transition-colors"
                        aria-label="Back to Contest Details"
                    >
                        <ChevronLeft size={24} />
                    </button>
                    <h2 className="text-[30px] text-left font-bold text-gray-900">
                        {currentContestant.name} - {currentPosition} Candidate
                    </h2>
                </div>

                <div className="mx-auto p-6 bg-gray-50 min-h-screen">
                    {/* Dynamic Profile Section */}
                    <div className="bg-white rounded-lg p-6 mb-6 shadow-sm">
                        <div className="flex items-start gap-6">
                            <div className="w-32 h-32 rounded-full overflow-hidden flex-shrink-0 bg-gradient-to-r from-orange-400 to-red-400 flex items-center justify-center text-white text-4xl font-bold">
                                {currentContestant.avatar || currentContestant.name.charAt(0)}
                            </div>

                            <div className="flex-1">
                                <div className="flex items-center gap-3 mb-3">
                                    <h1 className="text-3xl text-left font-bold text-gray-900">{currentContestant.name}</h1>
                                    {currentContestant.rank === 1 && <Crown className="w-8 h-8 text-yellow-500" />}
                                    {currentContestant.rank === 2 && <Medal className="w-8 h-8 text-gray-400" />}
                                    {currentContestant.rank === 3 && <Award className="w-8 h-8 text-orange-600" />}
                                </div>
                                
                                <p className="text-gray-500 text-left mb-6 leading-relaxed">
                                    {currentContestant.bio || "Dedicated candidate committed to excellence and positive change in leadership."}
                                </p>

                                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                                    <div className="text-center">
                                        <div className="text-3xl font-bold text-gray-900">{currentContestant.votes}</div>
                                        <div className="text-sm text-gray-600">Total Votes</div>
                                    </div>
                                    <div className="text-center">
                                        <div className={`text-3xl font-bold ${
                                            currentContestant.rank === 1 ? 'text-yellow-600' :
                                            currentContestant.rank === 2 ? 'text-gray-600' :
                                            currentContestant.rank === 3 ? 'text-orange-600' : 'text-gray-600'
                                        }`}>
                                            #{currentContestant.rank}
                                        </div>
                                        <div className="text-sm text-gray-600">Current Rank</div>
                                    </div>
                                    <div className="text-center flex items-center justify-center">
                                        {currentContestant.trend === "up" ? (
                                            <TrendingUp className="text-green-500 w-8 h-8" />
                                        ) : currentContestant.trend === "down" ? (
                                            <TrendingDown className="text-red-500 w-8 h-8" />
                                        ) : (
                                            <div className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center">
                                                <div className="w-4 h-1 bg-gray-600 rounded"></div>
                                            </div>
                                        )}
                                        <div className="ml-2">
                                            <div className="text-sm font-medium">
                                                {currentContestant.momentum > 0 ? '+' : ''}{currentContestant.momentum}
                                            </div>
                                            <div className="text-xs text-gray-600">24h change</div>
                                        </div>
                                    </div>
                                    <div className="text-center">
                                        <div className="text-3xl font-bold text-blue-600">{currentContestant.percentage}%</div>
                                        <div className="text-sm text-gray-600">Vote Share</div>
                                    </div>
                                </div>

                                <div className="flex flex-wrap gap-6 mb-6 text-sm">
                                    <div>
                                        <span className="text-gray-600">Contest: </span>
                                        <span className="font-semibold text-gray-900">Imaginarium Contest</span>
                                    </div>
                                    <div>
                                        <span className="text-gray-600">Position: </span>
                                        <span className="font-semibold text-gray-900">{currentPosition}</span>
                                    </div>
                                    {currentContestant.party && (
                                        <div>
                                            <span className="text-gray-600">Party: </span>
                                            <span className="font-semibold text-gray-900">{currentContestant.party}</span>
                                        </div>
                                    )}
                                </div>

                                <div className="flex gap-3">
                                    <button className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors">
                                        <Edit size={16} />
                                        Edit Details
                                    </button>
                                    <button className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors">
                                        <Share2 size={16} />
                                        Share Candidate Link
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
                        {/* Dynamic Performance Dashboard */}
                        <div className="bg-white rounded-lg p-6 shadow-sm">
                            <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center gap-2">
                                <Target className="w-5 h-5" />
                                Performance Analytics
                            </h2>
                            <div className="space-y-4">
                                <div className="flex justify-between items-center text-sm text-gray-600 mb-2">
                                    <span>Daily Vote Progress</span>
                                    <span>Last 7 days</span>
                                </div>
                                <div className="flex items-end gap-2 h-32">
                                    {performanceData.map((day, index) => {
                                        const maxVotes = Math.max(...performanceData.map(d => d.votes), 1);
                                        return (
                                            <div key={index} className="flex-1 flex flex-col items-center">
                                                <div
                                                    className="bg-teal-600 rounded-t w-full min-h-[4px] transition-all duration-300"
                                                    style={{ height: `${(day.votes / maxVotes) * 100}%` }}
                                                ></div>
                                                <div className="text-xs text-gray-500 mt-2">{day.day}</div>
                                                <div className="text-xs font-medium">{day.votes}</div>
                                            </div>
                                        );
                                    })}
                                </div>
                                <div className="text-center text-sm text-gray-600">
                                    Total this week: {performanceData.reduce((sum, day) => sum + day.votes, 0)} votes
                                </div>
                            </div>
                        </div>

                        {/* Dynamic Contest Progress */}
                        <div className="bg-white rounded-lg p-6 shadow-sm">
                            <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center gap-2">
                                <Clock className="w-5 h-5" />
                                Contest Status
                            </h2>
                            <div className="space-y-4">
                                <div className="flex justify-between items-center">
                                    <span className="text-gray-600">Time Remaining</span>
                                    <span className="font-semibold text-orange-600">{timeRemaining}</span>
                                </div>
                                <div className="w-full bg-gray-200 rounded-full h-3">
                                    <div
                                        className="bg-orange-500 h-3 rounded-full transition-all duration-300"
                                        style={{ width: `${dynamicMetrics.contestProgress}%` }}
                                    ></div>
                                </div>
                                <div className="text-sm text-gray-600 text-center">
                                    Contest {dynamicMetrics.contestProgress}% Complete
                                </div>

                                <div className="grid grid-cols-2 gap-4 mt-4">
                                    <div className="text-center p-3 bg-gray-50 rounded-lg">
                                        <div className="text-lg font-bold text-gray-900">{dynamicMetrics.totalCandidates}</div>
                                        <div className="text-xs text-gray-600">Total Candidates</div>
                                    </div>
                                    <div className="text-center p-3 bg-gray-50 rounded-lg">
                                        <div className="text-lg font-bold text-gray-900">{dynamicMetrics.totalVotes}</div>
                                        <div className="text-xs text-gray-600">Total Votes Cast</div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Dynamic Competitive Analysis */}
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
                        {/* Dynamic Gap Analysis */}
                        <div className="bg-white rounded-lg p-6 shadow-sm">
                            <h3 className="text-lg font-semibold text-gray-900 mb-4">Gap Analysis</h3>
                            <div className="space-y-3">
                                {currentContestant.rank > 1 && (
                                    <div className="flex justify-between items-center p-3 bg-yellow-50 rounded-lg">
                                        <span className="text-sm text-gray-600">To Next Rank</span>
                                        <span className="font-bold text-yellow-700">+{dynamicMetrics.votesToNextRank} votes</span>
                                    </div>
                                )}
                                {currentContestant.rank !== 1 && (
                                    <div className="flex justify-between items-center p-3 bg-green-50 rounded-lg">
                                        <span className="text-sm text-gray-600">To 1st Place</span>
                                        <span className="font-bold text-green-700">+{dynamicMetrics.votesToWin} votes</span>
                                    </div>
                                )}
                                {currentContestant.rank === 1 && (
                                    <div className="flex justify-between items-center p-3 bg-gold-50 rounded-lg">
                                        <span className="text-sm text-gray-600">🏆 Leading!</span>
                                        <span className="font-bold text-yellow-700">Keep it up!</span>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Dynamic Win Probability */}
                        <div className="bg-white rounded-lg p-6 shadow-sm">
                            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                                <Trophy className="w-5 h-5" />
                                Win Probability
                            </h3>
                            <div className="text-center">
                                <div className={`text-3xl font-bold mb-2 ${
                                    dynamicMetrics.winningProbability > 70 ? 'text-green-600' :
                                    dynamicMetrics.winningProbability > 40 ? 'text-yellow-600' : 'text-red-600'
                                }`}>
                                    {Math.round(dynamicMetrics.winningProbability)}%
                                </div>
                                <div className="w-full bg-gray-200 rounded-full h-2 mb-3">
                                    <div
                                        className={`h-2 rounded-full transition-all duration-300 ${
                                            dynamicMetrics.winningProbability > 70 ? 'bg-green-600' :
                                            dynamicMetrics.winningProbability > 40 ? 'bg-yellow-600' : 'bg-red-600'
                                        }`}
                                        style={{ width: `${dynamicMetrics.winningProbability}%` }}
                                    ></div>
                                </div>
                                <p className="text-sm text-gray-600">
                                    {dynamicMetrics.winningProbability > 70 ? "Excellent chance of winning!" : 
                                     dynamicMetrics.winningProbability > 40 ? "Competitive position!" : 
                                     "Keep pushing for more votes!"}
                                </p>
                            </div>
                        </div>

                        {/* Dynamic Recommendation */}
                        <div className="bg-white rounded-lg p-6 shadow-sm">
                            <h3 className="text-lg font-semibold text-gray-900 mb-4">Recommended Action</h3>
                            <div className="p-4 bg-blue-50 rounded-lg">
                                <div className="text-sm font-medium text-blue-900 mb-2">{strategicRecommendation.action}</div>
                                <div className="text-xs text-blue-700">{strategicRecommendation.description}</div>
                            </div>
                        </div>
                    </div>

                    {/* Dynamic Position Competition */}
                    <div className="bg-white rounded-lg p-6 mb-6 shadow-sm">
                        <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center gap-2">
                            <Users className="w-5 h-5" />
                            {currentPosition} Race Standings
                        </h2>
                        <div className="space-y-3">
                            {allContestants.map((candidate, index) => (
                                <div
                                    key={candidate.id || index}
                                    className={`flex items-center gap-4 p-3 rounded-lg transition-all duration-200 ${
                                        candidate.id === currentContestant.id ? 
                                        'bg-gradient-to-r from-yellow-50 to-orange-50 border-2 border-yellow-200 transform scale-102' : 
                                        'bg-gray-50 hover:bg-gray-100'
                                    }`}
                                >
                                    <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
                                        index === 0 ? 'bg-yellow-500 text-white' :
                                        index === 1 ? 'bg-gray-400 text-white' :
                                        index === 2 ? 'bg-orange-500 text-white' : 'bg-gray-300 text-gray-700'
                                    }`}>
                                        {candidate.rank}
                                    </div>

                                    <div className="w-8 h-8 bg-gradient-to-r from-orange-400 to-red-400 rounded-full flex items-center justify-center text-white text-sm font-bold">
                                        {candidate.avatar || candidate.name.charAt(0)}
                                    </div>

                                    <div className="flex-1">
                                        <div className="flex items-center gap-2">
                                            <div className="font-semibold text-gray-900">{candidate.name}</div>
                                            {candidate.id === currentContestant.id && (
                                                <span className="text-xs bg-yellow-200 text-yellow-800 px-2 py-1 rounded-full">You</span>
                                            )}
                                        </div>
                                        <div className="text-sm text-gray-600">{candidate.votes} votes • {candidate.percentage}%</div>
                                    </div>

                                    <div className="flex items-center gap-2">
                                        {candidate.trend === "up" && <TrendingUp className="w-4 h-4 text-green-500" />}
                                        {candidate.trend === "down" && <TrendingDown className="w-4 h-4 text-red-500" />}
                                        {candidate.trend === "stable" && <div className="w-4 h-4 flex items-center justify-center"><div className="w-3 h-0.5 bg-gray-400 rounded"></div></div>}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Position Selector */}
                    <div className="bg-white rounded-lg p-6 mb-6 shadow-sm">
                        <h2 className="text-xl font-semibold text-gray-900 mb-4">View Other Positions</h2>
                        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3">
                            {Object.keys(positionData).map((pos) => (
                                <button
                                    key={pos}
                                    onClick={() => navigate(`/contestant-details/${pos}/${currentContestant.id}`)}
                                    className={`p-3 rounded-lg font-medium transition-all duration-200 ${
                                        pos === currentPosition
                                            ? 'bg-teal-600 text-white'
                                            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                    }`}
                                >
                                    <div className="text-sm">{pos}</div>
                                    <div className="text-xs opacity-75">({positionData[pos].votersCount} votes)</div>
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Remove Contestant Section */}
                    <div className="bg-white rounded-lg p-6 shadow-sm border-2 border-red-100">
                        <h2 className="text-xl font-semibold text-red-800 mb-4 flex items-center gap-2">
                            <AlertTriangle className="w-5 h-5" />
                            Danger Zone
                        </h2>
                        <p className="text-gray-600 mb-4">
                            Removing this contestant will permanently delete their profile and all associated votes. This action cannot be undone.
                        </p>
                        <button
                            onClick={() => setShowRemoveModal(true)}
                            className="w-full bg-red-600 hover:bg-red-700 text-white font-medium py-4 px-6 rounded-lg transition-colors"
                        >
                            Remove {currentContestant.name}
                        </button>
                    </div>

                    {/* Enhanced Modal */}
                    {showRemoveModal && (
                        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
                            <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4 shadow-2xl">
                                <div className="flex items-center gap-3 mb-4">
                                    <AlertTriangle className="w-8 h-8 text-red-500" />
                                    <h3 className="text-lg font-semibold text-gray-900">Confirm Removal</h3>
                                </div>
                                <p className="text-gray-600 mb-6">
                                    Are you sure you want to remove <strong>{currentContestant.name}</strong> from the {currentPosition} position? 
                                    This will delete their {currentContestant.votes} votes and cannot be undone.
                                </p>
                                <div className="flex gap-3 justify-end">
                                    <button
                                        onClick={() => setShowRemoveModal(false)}
                                        className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        onClick={handleRemoveContestant}
                                        className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors"
                                    >
                                        Remove Contestant
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ContestantDetails;