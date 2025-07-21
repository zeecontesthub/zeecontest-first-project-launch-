import React, { useState, useEffect } from 'react';
import { Edit, Eye, Share2 } from 'lucide-react';
import Sidebar from '../Components/sidebar';
import BannerImage from '../assets/Rectangle _5189.png';
import LogoImage from '../assets/Ellipse 20.png';
import { ChevronLeft, ChevronRight, Play, Pause, Square, Trophy, Medal, Award, TrendingUp, Users, Target, Crown } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import positionData from '../data/positionData';



const Contestdetails = ({ isPaidContest, voterFee }) => {
  const [activeTab, setActiveTab] = useState(0);
  const [currentSection, setCurrentSection] = useState(0);
  const [countdown, setCountdown] = useState('');
  const navigate = useNavigate();

  const totalGlobalVotes = Object.values(positionData).reduce((acc, pos) => acc + pos.votersCount, 0);
  const totalContestants = Object.values(positionData).reduce((acc, pos) => acc + pos.contestants.length, 0);
  const totalPositions = Object.keys(positionData).length;
  const mostCompetitive = Object.entries(positionData).reduce((prev, current) =>
    current[1].votersCount > prev[1].votersCount ? current : prev
  );

  const accountBalance = isPaidContest ? totalGlobalVotes * (parseFloat(voterFee) || 0) : null;

  // Simulated contest start and end date/time for countdown
  // These should be replaced with actual values from backend or global state
  const contestStartDateTime = new Date('July 10, 2025 00:00:00').getTime();
  const contestEndDateTime = new Date('July 15, 2025 00:00:00').getTime();

  useEffect(() => {
    const interval = setInterval(() => {
      const now = new Date().getTime();

      if (now < contestStartDateTime) {
        // Countdown to contest start
        const distance = contestStartDateTime - now;

        const days = Math.floor(distance / (1000 * 60 * 60 * 24));
        const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((distance % (1000 * 60)) / 1000);

        setCountdown(` ${days}d ${hours}h ${minutes}m ${seconds}s`);
      } else if (now >= contestStartDateTime && now < contestEndDateTime) {
        // Countdown to contest end
        const distance = contestEndDateTime - now;

        const days = Math.floor(distance / (1000 * 60 * 60 * 24));
        const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((distance % (1000 * 60)) / 1000);

        setCountdown(`${days}d ${hours}h ${minutes}m ${seconds}s`);
      } else {
        // Contest ended
        setCountdown('Contest Ended');
        clearInterval(interval);
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [contestStartDateTime, contestEndDateTime]);

  // Calculate participation metrics
  const avgParticipation = (totalGlobalVotes / (totalPositions * 50) * 100).toFixed(1);
  const contestProgress = 65; // This could be calculated based on time elapsed


  const sections = [
    {
      title: "Start Contest",
      buttonText: "Start Contest",
      buttonColor: "bg-green-600 hover:bg-green-700",
      icon: <Play size={20} />,
      description: "Begin the voting process for all voters before the start time"
    },
    {
      title: "Pause Contest",
      buttonText: "Pause Contest",
      buttonColor: "bg-yellow-600 hover:bg-yellow-700",
      icon: <Pause size={20} />,
      description: "Temporarily halt the voting process"
    },
    {
      title: "End Contest",
      buttonText: "End Contest",
      buttonColor: "bg-red-600 hover:bg-red-700",
      icon: <Square size={20} />,
      description: "Permanently stop the contest and finalize results"
    }
  ];

  const nextSection = () => {
    setCurrentSection((prev) => (prev + 1) % sections.length);
  };

  const prevSection = () => {
    setCurrentSection((prev) => (prev - 1 + sections.length) % sections.length);
  };

  const goToSection = (index) => {
    setCurrentSection(index);
  };

  const currentData = sections[currentSection];

  const contestants = [
    { name: 'Jakeayodeji', votes: 40, avatar: '👨‍🎨' },
    { name: 'Johnson', votes: 32, avatar: '👨‍🎨' },
    { name: 'Fuad', votes: 20, avatar: '👨‍🎨' },
    { name: 'David', votes: 15, avatar: '👨‍🎨' },
    { name: 'Emmanuel', votes: 10, avatar: '👨‍🎨' }
  ];

  // Combine all contestants from all positions and take first 5, include position info
  const contestantDetails = Object.entries(positionData)
    .flatMap(([position, data]) =>
      data.contestants.map(contestant => ({
        ...contestant,
        position
      }))
    )
    .slice(0, 5);

  const voterDetails = [
    { fullName: 'Keji-Ayodeji Eniibukun', email: 'jakeayodeji@gmail.com' },
    { fullName: 'Keji-Ayodeji Eniibukun', email: 'jakeayodeji@gmail.com' },
    { fullName: 'Keji-Ayodeji Eniibukun', email: 'jakeayodeji@gmail.com' },
    { fullName: 'Keji-Ayodeji Eniibukun', email: 'jakeayodeji@gmail.com' },
    { fullName: 'Keji-Ayodeji Eniibukun', email: 'jakeayodeji@gmail.com' },
    { fullName: 'Keji-Ayodeji Eniibukun', email: 'jakeayodeji@gmail.com' }
  ];

  return (
    <div className="flex min-h-screen">
      <Sidebar />

      <div className="flex-1 w-full p-6 ml-20">
        {/* Header */}
        <h2 className="text-[30px] text-left font-bold text-gray-900 mb-8">Contest</h2>

        <div>
          <img
            src={BannerImage}
            alt="Contest Banner"
            className='w-full'
          />
        </div>

        {/* Main Header Content */}
        <div className="relative z-10  backdrop-blur-sm rounded-3xl p-6 lg:p-8">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
            {/* Left Section - Logo and Content */}
            <div className="flex items-center gap-6">
              {/* Logo */}
              <div className=" rounded-full flex items-center justify-center border-4 border-black overflow-hidden -mt-5 ml-5">
                <img src={LogoImage} alt="Logo" className="w-full h-full object-cover" />
              </div>

              {/* Content */}
              <div>
                <h2 className="text-[32px] lg:text-[32px] text-left font-bold text-gray-900 mb-2">
                  Imaginarium Contest
                </h2>
                <p className="text-gray-600 max-w-lg text-left text-sm lg:text-base">
                  Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
                </p>

                {/* Stats */}
                <div className="flex items-center gap-8 mt-4">
                  <div>
                    <span className="text-3xl lg:text-4xl font-bold text-gray-900">{totalGlobalVotes}</span>
                    <span className="text-gray-600 ml-2 text-sm">Total Votes</span>
                  </div>
                  <div>
                    <span className="text-3xl lg:text-4xl font-bold text-gray-900">{totalContestants}</span>
                    <span className="text-gray-600 ml-2 text-sm">Contestant</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Section - Action Buttons */}
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

          <div className="grid grid-cols-1 xl:grid-cols-3 gap-8 mt-10">
            {/* Left Column - Leaderboard and Voters */}
            <div className="xl:col-span-2 space-y-8">
              {/* Leaderboard */}
              <div className="bg-white/80 backdrop-blur-sm rounded-3xl border border-[#000000] p-6 lg:p-8 shadow-xl">
                {/* Header */}
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6 gap-4">
                  <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                    <Trophy className="w-5 h-5 text-yellow-500" />
                    Leaderboard
                  </h2>
                  <button
                    onClick={() => navigate('/leaderboards')}
                    className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-teal-900 hover:text-white transition-colors"
                  >
                    View Full Leaderboard
                  </button>
                </div>

                {/* Key Metrics Grid */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                  <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-4 rounded-xl text-center">
                    <div className="w-10 h-10 mx-auto mb-2 bg-blue-500 rounded-full flex items-center justify-center">
                      <Users className="w-5 h-5 text-white" />
                    </div>
                    <p className="text-2xl font-bold text-blue-700">{totalGlobalVotes}</p>
                    <p className="text-xs text-blue-600">Total Votes</p>
                  </div>

                  <div className="bg-gradient-to-br from-green-50 to-green-100 p-4 rounded-xl text-center">
                    <div className="w-10 h-10 mx-auto mb-2 bg-green-500 rounded-full flex items-center justify-center">
                      <Target className="w-5 h-5 text-white" />
                    </div>
                    <p className="text-2xl font-bold text-green-700">{totalPositions}</p>
                    <p className="text-xs text-green-600">Positions</p>
                  </div>

                  <div className="bg-gradient-to-br from-purple-50 to-purple-100 p-4 rounded-xl text-center">
                    <div className="w-10 h-10 mx-auto mb-2 bg-purple-500 rounded-full flex items-center justify-center">
                      <TrendingUp className="w-5 h-5 text-white" />
                    </div>
                    <p className="text-2xl font-bold text-purple-700">{avgParticipation}%</p>
                    <p className="text-xs text-purple-600">Participation</p>
                  </div>

                  <div className="bg-gradient-to-br from-orange-50 to-orange-100 p-4 rounded-xl text-center">
                    <div className="w-10 h-10 mx-auto mb-2 bg-orange-500 rounded-full flex items-center justify-center">
                      <Trophy className="w-5 h-5 text-white" />
                    </div>
                    <p className="text-2xl font-bold text-orange-700">{contestProgress}%</p>
                    <p className="text-xs text-orange-600">Progress</p>
                  </div>
                </div>

                {/* Top Performers Snapshot */}
                <div className="mb-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                    <Crown className="w-5 h-5 text-yellow-500" />
                    Current Leaders by Position
                  </h3>

                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                    {Object.entries(positionData).slice(0, 3).map(([position, data], index) => (
                      <div
                        key={position}
                        className={`p-4 rounded-xl cursor-pointer transition-all hover:shadow-md ${index === 0 ? 'bg-gradient-to-r from-yellow-50 to-orange-50 border-2 border-yellow-200' :
                          index === 1 ? 'bg-gradient-to-r from-gray-50 to-slate-50 border-2 border-gray-200' :
                            'bg-gradient-to-r from-amber-50 to-orange-50 border-2 border-amber-200'
                          }`}
                        onClick={() => console.log('Navigate to /leaderboards')}
                      >
                        <div className="flex items-center gap-3">
                          <div className={`w-8 h-8 rounded-full flex items-center justify-center ${index === 0 ? 'bg-yellow-500 text-white' :
                            index === 1 ? 'bg-gray-400 text-white' :
                              'bg-amber-600 text-white'
                            }`}>
                            {index === 0 ? <Trophy className="w-4 h-4" /> :
                              index === 1 ? <Medal className="w-4 h-4" /> :
                                <Award className="w-4 h-4" />}
                          </div>
                          <div className="flex-1">
                            <p className="font-semibold text-gray-900 text-sm">{position}</p>
                            <p className="text-xs text-gray-600">{data.topCandidate}</p>
                          </div>
                          <div className="text-right">
                            <p className="font-bold text-gray-900">{data.topVotes}</p>
                            <p className="text-xs text-gray-500">votes</p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Competition Highlights */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="bg-gradient-to-r from-teal-50 to-cyan-50 p-4 rounded-xl">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-teal-500 rounded-full flex items-center justify-center">
                        <TrendingUp className="w-5 h-5 text-white" />
                      </div>
                      <div>
                        <p className="text-sm text-teal-600 font-medium">Most Competitive</p>
                        <p className="text-lg font-bold text-teal-800">{mostCompetitive[0]}</p>
                        <p className="text-xs text-teal-600">{mostCompetitive[1].votersCount} total votes</p>
                      </div>
                    </div>
                  </div>

                  <div className="bg-gradient-to-r from-pink-50 to-rose-50 p-4 rounded-xl">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-pink-500 rounded-full flex items-center justify-center">
                        <Crown className="w-5 h-5 text-white" />
                      </div>
                      <div>
                        <p className="text-sm text-pink-600 font-medium">Overall Leader</p>
                        <p className="text-lg font-bold text-pink-800">{mostCompetitive[1].topCandidate}</p>
                        <p className="text-xs text-pink-600">Leading {mostCompetitive[0]} race</p>
                      </div>
                    </div>
                  </div>
                </div>

              </div>

              {/* Voters Details */}
              <div className="bg-white/80 backdrop-blur-sm border border-[#000000] rounded-3xl p-6 lg:p-8 shadow-xl ">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6 gap-4">
                  <h2 className="text-xl font-bold text-gray-900">Voters Details</h2>
<button
  onClick={() => navigate('/voters-details')}
  className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-teal-900 hover:text-white transition-colors self-start"
>
  View Full Voters Details
</button>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-gray-200">
                        <th className="text-left py-3 text-gray-900 font-semibold">Voters Full Name</th>
                        <th className="text-left py-3 text-gray-900 font-semibold">Voters Email</th>
                      </tr>
                    </thead>
                    <tbody>
                      {voterDetails.map((voter, index) => (
                        <tr key={index}>
                          <td className="py-3 text-left text-gray-700">{voter.fullName}</td>
                          <td className="py-3 text-left  text-gray-700">{voter.email}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>

            {/* Right Column - Contest Info and Actions */}
            <div className="space-y-8">
              {/* Contest Timing */}
              <div className="bg-white/80 w-80  backdrop-blur-sm border border-[#000000] rounded-3xl p-6 shadow-xl">
                <div className="text-center">
                  <h3 className="text-lg font-bold text-gray-900 mb-2">Contest Starts In</h3>
                  <p className="text-xl font-semibold text-orange-600">{countdown}</p>
                </div>
              </div>

              {/* Contestant Details */}
              <div className="bg-white/80 w-80 backdrop-blur-sm border border-[#000000] rounded-3xl p-6 shadow-xl">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6 gap-4">
                  <h2 className="text-xl font-bold text-gray-900">Contestant</h2>
                  <button
                    onClick={() => navigate('/contestant')}
                    className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-teal-900 hover:text-white transition-colors self-start">
                    View All Contestants
                  </button>
                </div>

                <div className="space-y-3">
                  {contestantDetails.map((contestant, index) => (
                    <div key={index} className="flex items-center justify-between p-3 bg-gray-100 rounded-xl hover:bg-gray-200 transition-colors">
                      <div
                        onClick={() => navigate(`/contestantdetails/${contestant.position}/${encodeURIComponent(contestant.name)}`)}
                        className="flex items-center gap-3 cursor-pointer"
                      >
                        {contestant.image ? (
                          <img
                            src={contestant.image}
                            alt={contestant.name}
                            className="w-10 h-10 rounded-full object-cover"
                          />
                        ) : (
                          <div className="w-10 h-10 bg-gradient-to-r from-orange-400 to-red-400 rounded-full flex items-center justify-center text-white">
                            {contestant.name.charAt(0)}
                          </div>
                        )}
                        <span className="font-medium text-gray-900">{contestant.name}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* End Contest */}
              <div className="bg-white/80 w-80  backdrop-blur-sm border border-[#000000] rounded-3xl p-6 shadow-xl">
                {/* Header with Navigation */}
                <div className="flex items-center justify-between mb-4">
                  <button
                    onClick={prevSection}
                    className="p-2 rounded-full bg-gray-100 hover:bg-gray-200 transition-colors"
                  >
                    <ChevronLeft size={20} className="text-gray-600" />
                  </button>

                  <h3 className="text-lg font-bold text-gray-900 text-center flex-1">
                    {currentData.title}
                  </h3>

                  <button
                    onClick={nextSection}
                    className="p-2 rounded-full bg-gray-100 hover:bg-gray-200 transition-colors"
                  >
                    <ChevronRight size={20} className="text-gray-600" />
                  </button>
                </div>

                {/* Description */}
                <p className="text-sm text-gray-600 text-center mb-6">
                  {currentData.description}
                </p>

                {/* Action Button */}
                <button
                  className={`w-full ${currentData.buttonColor} text-white py-3 rounded-xl transition-colors font-semibold flex items-center justify-center gap-2`}
                >
                  {currentData.icon}
                  {currentData.buttonText}
                </button>

                {/* Navigation Dots */}
                <div className="flex justify-center mt-4 gap-2">
                  {sections.map((_, index) => (
                    <button
                      key={index}
                      onClick={() => goToSection(index)}
                      className={`w-3 h-3 rounded-full transition-colors ${index === currentSection
                        ? 'bg-orange-400'
                        : 'bg-gray-300 hover:bg-gray-400'
                        }`}
                    />
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Contestdetails;
