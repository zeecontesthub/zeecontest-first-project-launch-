import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom';
import Sidebar from '../Components/sidebar';
import BannerImage from '../assets/Rectangle _5189.png';
import LogoImage from '../assets/Ellipse 20.png';
import { Edit, Share2, Trophy, Users, Vote, TrendingUp, Award, Crown, Medal, Target, ChevronLeft } from 'lucide-react';
import { Pie, Bar } from 'react-chartjs-2';
import {
    Chart as ChartJS,
    ArcElement,
    Tooltip,
    Legend,
    CategoryScale,
    LinearScale,
    BarElement,
} from 'chart.js';

import positionData from '../data/positionData';

ChartJS.register(ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement);

// Enhanced vote distribution with more realistic patterns
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

const Leaderboards = () => {
    const navigate = useNavigate();

    const tabs = Object.keys(positionData);
    const [activeTab, setActiveTab] = useState(tabs[0]);

    const { votersCount, contestants: rawContestants } = positionData[activeTab];

    const contestants = useMemo(() => {
        return distributeVotes(votersCount, rawContestants);
    }, [activeTab]);

    const totalVotes = votersCount;

    const totalGlobalVotes = Object.values(positionData).reduce(
        (acc, position) => acc + position.votersCount,
        0
    );

    // Enhanced pie chart config
    const pieData = {
        labels: tabs,
        datasets: [
            {
                label: 'Votes per Position',
                data: tabs.map((tab) => positionData[tab].votersCount),
                backgroundColor: [
                    'rgba(255, 99, 132, 0.8)',
                    'rgba(54, 162, 235, 0.8)',
                    'rgba(255, 206, 86, 0.8)',
                    'rgba(75, 192, 192, 0.8)',
                    'rgba(153, 102, 255, 0.8)',
                ],
                borderColor: [
                    'rgba(255, 99, 132, 1)',
                    'rgba(54, 162, 235, 1)',
                    'rgba(255, 206, 86, 1)',
                    'rgba(75, 192, 192, 1)',
                    'rgba(153, 102, 255, 1)',
                ],
                borderWidth: 3,
                hoverOffset: 8,
            },
        ],
    };

    // Contestant performance chart
    const contestantData = {
        labels: contestants.map(c => c.name),
        datasets: [
            {
                label: 'Votes',
                data: contestants.map(c => c.votes),
                backgroundColor: 'rgba(20, 184, 166, 0.7)',
                borderColor: 'rgba(20, 184, 166, 1)',
                borderWidth: 2,
                borderRadius: 8,
            },
        ],
    };

    const chartOptions = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: {
                position: 'bottom',
                labels: {
                    padding: 15,
                    usePointStyle: true,
                    font: {
                        size: 11,
                    },
                },
            },
            tooltip: {
                backgroundColor: 'rgba(0, 0, 0, 0.8)',
                titleColor: 'white',
                bodyColor: 'white',
                borderColor: 'rgba(255, 255, 255, 0.2)',
                borderWidth: 1,
            },
        },
    };

    const barOptions = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: {
                display: false,
            },
        },
        scales: {
            y: {
                beginAtZero: true,
                grid: {
                    color: 'rgba(0, 0, 0, 0.1)',
                },
            },
            x: {
                grid: {
                    display: false,
                },
            },
        },
    };

    // Calculate engagement metrics
    const mostCompetitive = tabs.reduce((prev, current) =>
        positionData[current].votersCount > positionData[prev].votersCount ? current : prev
    );

    const turnoutRate = ((totalGlobalVotes / (tabs.length * 50)) * 100).toFixed(1);

    return (
        <div className="flex min-h-screen">
            <Sidebar />
            <div className="flex-1 w-full p-6 ml-20">
                <div className="flex items-center gap-4 mb-8">
                    <button
                        onClick={() => navigate('/contest-details')}
                        className="p-2 rounded-full hover:bg-gray-200 transition-colors"
                        aria-label="Back to Contest Details"
                    >
                        <ChevronLeft size={24} />
                    </button>
                    <h2 className="text-[30px] text-left font-bold text-gray-900 mb-0">Leaderboard</h2>
                </div>

                <div>
                    <img src={BannerImage} alt="Contest Banner" className='w-full' />
                </div>

                <div className="relative z-10 backdrop-blur-sm rounded-3xl p-6 lg:p-8">
                    <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
                        <div className="flex items-center gap-6">
                            {/* Logo */}
                            <div className=" rounded-full flex items-center justify-center border-4 border-black overflow-hidden -mt-5 ml-5">
                                <img src={LogoImage} alt="Logo" className="w-full h-full object-cover" />
                            </div>
                            <div>
                                <h2 className="text-[20px] lg:text-[25px] text-left font-bold text-gray-900 mb-2">
                                    Imaginarium Contest ({activeTab} Leaderboard)
                                </h2>
                                <p className="text-gray-600 max-w-lg text-left text-sm lg:text-base">
                                    Real-time voting results and comprehensive analytics for all leadership positions. Track live progress and competition insights.
                                </p>

                                <div className="flex items-center gap-8 mt-4 mr-10">
                                    <div>
                                        <span className="text-3xl lg:text-4xl font-bold text-gray-900">{totalVotes}</span>
                                        <span className="text-gray-600 ml-2 text-sm">Votes for ({activeTab} Position)</span>
                                    </div>
                                    <div>
                                        <span className="text-3xl lg:text-4xl font-bold text-gray-900">{contestants.length}</span>
                                        <span className="text-gray-600 ml-2 text-sm">Contestants</span>
                                    </div>
                                    <div>
                                        <span className="text-3xl lg:text-4xl font-bold text-gray-900">{votersCount}</span>
                                        <span className="text-gray-600 ml-2 text-sm">Voters</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="flex flex-col gap-3 min-w-fit">
                            <button
                                onClick={() => navigate('/edit-contest')}
                                className="flex items-center gap-2 px-4 py-2 border border-[#000000] rounded-lg hover:bg-teal-900 hover:text-white transition-colors text-sm font-medium"
                            >
                                <Edit size={16} />
                                Edit Contest
                            </button>
                            <button className="flex items-center gap-2 px-4 py-2 border border-[#000000] rounded-lg hover:bg-teal-900 hover:text-white transition-colors text-sm font-medium">
                                <Share2 size={16} />
                                Share Voters Link
                            </button>
                        </div>
                    </div>

                    {/* Enhanced Key Metrics Dashboard */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mt-12 mb-8 ">
                        <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-4 shadow-lg border border-gray-200">
                            <div className="flex items-center gap-3">
                                <div className="p-2 bg-blue-100 rounded-xl">
                                    <Vote className="w-5 h-5 text-blue-600" />
                                </div>
                                <div>
                                    <p className="text-xs text-gray-600">Global Votes</p>
                                    <p className="text-xl font-bold text-gray-900">{totalGlobalVotes}</p>
                                </div>
                            </div>
                        </div>

                        <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-4 shadow-lg border border-gray-200">
                            <div className="flex items-center gap-3">
                                <div className="p-2 bg-green-100 rounded-xl">
                                    <Users className="w-5 h-5 text-green-600" />
                                </div>
                                <div>
                                    <p className="text-xs text-gray-600">Positions</p>
                                    <p className="text-xl font-bold text-gray-900">{tabs.length}</p>
                                </div>
                            </div>
                        </div>

                        <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-4 shadow-lg border border-gray-200">
                            <div className="flex items-center gap-3">
                                <div className="p-2 bg-purple-100 rounded-xl">
                                    <TrendingUp className="w-5 h-5 text-purple-600" />
                                </div>
                                <div>
                                    <p className="text-xs text-gray-600">Turnout Rate</p>
                                    <p className="text-xl font-bold text-gray-900">{turnoutRate}%</p>
                                </div>
                            </div>
                        </div>

                        <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-4 shadow-lg border border-gray-200">
                            <div className="flex items-center gap-3">
                                <div className="p-2 bg-orange-100 rounded-xl">
                                    <Target className="w-5 h-5 text-orange-600" />
                                </div>
                                <div>
                                    <p className="text-xs text-gray-600">Most Competitive</p>
                                    <p className="text-sm font-bold text-gray-900">{mostCompetitive}</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Position Tabs */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 mt-12 mb-8">
                        {tabs.map((tab) => (
                            <button
                                key={tab}
                                onClick={() => setActiveTab(tab)}
                                className={`px-6 py-6 rounded-lg font-medium transition-all duration-200 ${activeTab === tab
                                    ? 'bg-orange-500 text-white shadow-lg transform scale-105'
                                    : 'bg-teal-800 text-white hover:bg-teal-700 hover:shadow-md'
                                    }`}
                            >
                                <div className="flex flex-col items-center">
                                    <span className="font-semibold">{tab}</span>
                                    <span className="text-xs opacity-75">({positionData[tab].votersCount} votes)</span>
                                </div>
                            </button>
                        ))}
                    </div>

                    {/* Main Content Grid */}
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        {/* Enhanced Leaderboard */}
                        <div className="lg:col-span-2">
                            <div className="bg-white/80 backdrop-blur-sm rounded-3xl border border-[#000000] p-6 lg:p-8 shadow-xl">
                                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6 gap-4">
                                    <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                                        <Crown className="w-6 h-6 text-yellow-500" />
                                        Leaderboard - {activeTab}
                                    </h2>
                                    <div className="text-right">
                                        <p className="text-sm text-gray-600">Total Votes</p>
                                        <p className="text-2xl font-bold text-teal-600">{totalVotes}</p>
                                    </div>
                                </div>

                                <div className="space-y-6">
                                    {contestants
                                        .sort((a, b) => b.votes - a.votes)
                                        .map((contestant, index) => {
                                            const isWinner = index === 0;
                                            const isRunner = index === 1;
                                            const isThird = index === 2;

                                            let positionStyle = "text-gray-500 font-normal";
                                            if (index === 0) positionStyle = "text-yellow-500 text-[30px] font-bold";
                                            else if (index === 1) positionStyle = "text-gray-400 text-[30px] font-bold";
                                            else if (index === 2) positionStyle = "text-yellow-800 text-[30px] font-bold";

                                            return (
                                                <div
                                                    key={index}
                                                    className={`flex items-center gap-4 p-4 rounded-2xl transition-all duration-200 ${isWinner ? 'bg-gradient-to-r from-yellow-50 to-orange-50 border-2 border-yellow-200' :
                                                        isRunner ? 'bg-gradient-to-r from-gray-50 to-slate-50 border-2 border-gray-200' :
                                                            isThird ? 'bg-gradient-to-r from-orange-50 to-yellow-50 border-2 border-orange-200' :
                                                                'bg-gray-50/50 border border-gray-100'
                                                        }`}
                                                >
                                                    {/* Position Badge */}
                                                    <div className={`flex items-center justify-center w-10 h-10 rounded-full font-bold text-lg ${isWinner ? 'bg-yellow-500 text-white' :
                                                        isRunner ? 'bg-gray-400 text-white' :
                                                            isThird ? 'bg-orange-600 text-white' :
                                                                'bg-gray-300 text-gray-600'
                                                        }`}>
                                                        {isWinner ? <Trophy className="w-5 h-5" /> :
                                                            isRunner ? <Medal className="w-5 h-5" /> :
                                                                isThird ? <Award className="w-5 h-5" /> :
                                                                    index + 1}
                                                    </div>

                                                    {/* Updated Avatar/Image Display */}
                                                    {contestant.image ? (
                                                        <img
                                                            src={contestant.image}
                                                            alt={contestant.name}
                                                            className="w-12 h-12 rounded-full object-cover border-2 border-white shadow-sm"
                                                        />
                                                    ) : (
                                                        <div className="w-12 h-12 bg-gradient-to-r from-orange-400 to-red-400 rounded-full flex items-center justify-center text-white text-xl">
                                                            {contestant.name.charAt(0)}
                                                        </div>
                                                    )}

                                                    <div className="flex-1">
                                                        <div className="flex items-center gap-2 mb-1">
                                                            <h3 className="font-semibold text-left text-gray-900">{contestant.name}</h3>
                                                            {isWinner && <Crown className="w-4 h-4 text-yellow-500" />}
                                                        </div>
                                                        {contestant.party && (
                                                            <p className="text-xs text-gray-600 mb-2">{contestant.party}</p>
                                                        )}
                                                        <div className="flex items-center gap-4">
                                                            <div className="flex-1 bg-gray-200 rounded-full h-3 overflow-hidden">
                                                                <div
                                                                    className={`h-full rounded-full transition-all duration-1000 ${isWinner ? 'bg-gradient-to-r from-yellow-400 to-orange-500' :
                                                                        'bg-gradient-to-r from-teal-500 to-teal-600'
                                                                        }`}
                                                                    style={{ width: `${(contestant.votes / totalVotes) * 100}%` }}
                                                                ></div>
                                                            </div>
                                                            <div className="text-right min-w-fit">
                                                                <span className="text-sm text-gray-600">{contestant.votes} of {totalVotes} Votes</span>
                                                                <p className="text-xs text-gray-500">{contestant.percentage}%</p>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            );
                                        })}
                                </div>
                            </div>
                        </div>

                        {/* Enhanced Analytics Sidebar */}
                        <div className="space-y-6">
                            {/* Enhanced Pie Chart */}
                            <div className="bg-white/90 backdrop-blur-sm rounded-3xl shadow-xl border border-gray-200 p-6">
                                <h4 className="text-lg font-semibold mb-4 flex items-center gap-2">
                                    <div className="w-3 h-3 bg-gradient-to-r from-purple-400 to-pink-400 rounded-full"></div>
                                    Vote Distribution by Position
                                </h4>
                                <div className="h-64">
                                    <Pie data={pieData} options={chartOptions} />
                                </div>
                            </div>

                            {/* Contestant Performance Bar Chart */}
                            <div className="bg-white/90 backdrop-blur-sm rounded-3xl shadow-xl border border-gray-200 p-6">
                                <h4 className="text-lg font-semibold mb-4 flex items-center gap-2">
                                    <div className="w-3 h-3 bg-gradient-to-r from-teal-400 to-blue-400 rounded-full"></div>
                                    {activeTab} Performance
                                </h4>
                                <div className="h-64">
                                    <Bar data={contestantData} options={barOptions} />
                                </div>
                            </div>

                            {/* Enhanced Quick Stats */}
                            <div className="bg-white/90 backdrop-blur-sm rounded-3xl shadow-xl border border-gray-200 p-6">
                                <h4 className="text-lg font-semibold mb-4">Position Insights</h4>
                                <div className="space-y-4">
                                    <div className="flex justify-between items-center p-3 bg-gradient-to-r from-yellow-50 to-orange-50 rounded-lg">
                                        <span className="text-sm text-gray-600">🏆 Leading Candidate</span>
                                        <span className="font-semibold text-gray-900">
                                            {contestants.sort((a, b) => b.votes - a.votes)[0]?.name}
                                        </span>
                                    </div>
                                    <div className="flex justify-between items-center p-3 bg-gradient-to-r from-blue-50 to-teal-50 rounded-lg">
                                        <span className="text-sm text-gray-600">📊 Vote Margin</span>
                                        <span className="font-semibold text-gray-900">
                                            {contestants.sort((a, b) => b.votes - a.votes)[0]?.votes -
                                                contestants.sort((a, b) => b.votes - a.votes)[1]?.votes} votes
                                        </span>
                                    </div>
                                    <div className="flex justify-between items-center p-3 bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg">
                                        <span className="text-sm text-gray-600">👥 Participation</span>
                                        <span className="font-semibold text-teal-600">{votersCount} voters</span>
                                    </div>
                                    <div className="flex justify-between items-center p-3 bg-gradient-to-r from-purple-50 to-pink-50 rounded-lg">
                                        <span className="text-sm text-gray-600">🎯 Candidates</span>
                                        <span className="font-semibold text-gray-900">{contestants.length}</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Leaderboards;