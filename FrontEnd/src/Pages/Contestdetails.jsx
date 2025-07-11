import React, { useEffect, useState } from "react";
import { Edit, Eye, Share2 } from "lucide-react";
import Sidebar from "../Components/sidebar";
import BannerImage from "../assets/Rectangle _5189.png";
import LogoImage from "../assets/Ellipse 20.png";
import {
  ChevronLeft,
  ChevronRight,
  Play,
  Pause,
  Square,
  Trophy,
  Medal,
  Award,
  TrendingUp,
  Users,
  Target,
  Crown,
} from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";

// import positionData from "../data/positionData";
import axios from "axios";

const Contestdetails = () => {
  const { contestId } = useParams();
  const [contest, setContest] = useState(null);

  console.log(contest);

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

  // eslint-disable-next-line no-unused-vars
  const [activeTab, setActiveTab] = useState(0);
  const [currentSection, setCurrentSection] = useState(0);
  const navigate = useNavigate();

  // const totalGlobalVotes = Object.values(positionData).reduce(
  //   (acc, pos) => acc + pos.votersCount,
  //   0
  // );
  // const totalContestants = Object.values(positionData).reduce(
  //   (acc, pos) => acc + pos.contestants.length,
  //   0
  // );
  // const totalPositions = Object.keys(positionData).length;
  // const mostCompetitive = Object.entries(positionData).reduce((prev, current) =>
  //   current[1].votersCount > prev[1].votersCount ? current : prev
  // );

  // Calculate participation metrics
  const avgParticipation = (
    ((contest?.voters?.length || 0) / (contest?.positions?.length * 50)) *
    100
  ).toFixed(1);

  const contestProgress = 65; // This could be calculated based on time elapsed

  const sections = [
    {
      title: "Start Contest",
      buttonText: "Start Contest",
      buttonColor: "bg-green-600 hover:bg-green-700",
      icon: <Play size={20} />,
      description:
        "Begin the voting process for all voters before the start time",
    },
    {
      title: "Pause Contest",
      buttonText: "Pause Contest",
      buttonColor: "bg-yellow-600 hover:bg-yellow-700",
      icon: <Pause size={20} />,
      description: "Temporarily halt the voting process",
    },
    {
      title: "End Contest",
      buttonText: "End Contest",
      buttonColor: "bg-red-600 hover:bg-red-700",
      icon: <Square size={20} />,
      description: "Permanently stop the contest and finalize results",
    },
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

  // eslint-disable-next-line no-unused-vars
  const contestants = [
    { name: "Jakeayodeji", votes: 40, avatar: "👨‍🎨" },
    { name: "Johnson", votes: 32, avatar: "👨‍🎨" },
    { name: "Fuad", votes: 20, avatar: "👨‍🎨" },
    { name: "David", votes: 15, avatar: "👨‍🎨" },
    { name: "Emmanuel", votes: 10, avatar: "👨‍🎨" },
  ];

  // Combine all contestants from all positions and take first 5
  // const contestantDetails = Object.values(positionData)
  //   .flatMap((position) => position.contestants)
  //   .slice(0, 5);

  // const voterDetails = [
  //   { fullName: "Keji-Ayodeji Eniibukun", email: "jakeayodeji@gmail.com" },
  //   { fullName: "Keji-Ayodeji Eniibukun", email: "jakeayodeji@gmail.com" },
  //   { fullName: "Keji-Ayodeji Eniibukun", email: "jakeayodeji@gmail.com" },
  //   { fullName: "Keji-Ayodeji Eniibukun", email: "jakeayodeji@gmail.com" },
  //   { fullName: "Keji-Ayodeji Eniibukun", email: "jakeayodeji@gmail.com" },
  //   { fullName: "Keji-Ayodeji Eniibukun", email: "jakeayodeji@gmail.com" },
  // ];

  // Utility to get top candidate for a position
  function getTopCandidate(position) {
    if (!position || !position.contestants || !position.voters)
      return { name: "N/A", votes: 0 };

    // Count votes for each contestant
    const voteCounts = {};
    position.voters.forEach((voter) => {
      if (voter.votedFor) {
        voteCounts[voter.votedFor] = (voteCounts[voter.votedFor] || 0) + 1;
      }
    });

    // Find contestant with max votes
    let top = { name: "N/A", votes: 0 };
    position.contestants.forEach((contestant) => {
      const votes = voteCounts[contestant._id] || 0;
      if (votes > top.votes) {
        top = { name: contestant.name, votes };
      }
    });

    return top;
  }

  function getPositionTotalVotes(position) {
    if (!position || !position.voters) return 0;
    return position.voters.length;
  }

  const mostCompetitive = React.useMemo(() => {
    if (!contest?.positions || contest.positions.length === 0) return null;
    // Find the position with the highest number of votes
    return contest.positions.reduce((prev, curr) =>
      getPositionTotalVotes(curr) > getPositionTotalVotes(prev) ? curr : prev
    );
  }, [contest]);

  function formatDate(dateString) {
    if (!dateString) return "";
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  }

  return (
    <div className="flex min-h-screen">
      <Sidebar />

      <div className="flex-1 w-full p-6">
        {/* Header */}
        <h2 className="text-[30px] text-left font-bold text-gray-900 mb-8">
          Contest
        </h2>

        <div className="relative mb-8  h-45">
          <img
            src={contest?.coverImageUrl || BannerImage}
            alt="Contest Banner"
            className="w-full object-cover rounded-lg h-full absolute inset-0"
          />
        </div>

        {/* Main Header Content */}
        <div className="relative z-10  backdrop-blur-sm rounded-3xl p-6 lg:p-8">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
            {/* Left Section - Logo and Content */}
            <div className="flex items-center gap-6">
              {/* Logo */}
              <div className="w-20 h-20 lg:w-60 lg:h-60 rounded-full flex items-center justify-center border-4 border-black overflow-hidden -mt-30 ml-20">
                <img
                  src={contest?.contestLogoImageUrl}
                  alt="Logo"
                  className="w-full h-full object-cover"
                />
              </div>

              {/* Content */}
              <div>
                <h2 className="text-[32px] lg:text-[32px] text-left font-bold text-gray-900 mb-2">
                  {contest?.Contest || "Contest Name"}
                </h2>
                <p className="text-gray-600 max-w-lg text-left text-sm lg:text-base">
                  {contest?.description ||
                    "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua."}
                </p>

                {/* Stats */}
                <div className="flex items-center gap-8 mt-4">
                  <div>
                    <span className="text-3xl lg:text-4xl font-bold text-gray-900">
                      {contest?.voters?.length || 0}
                    </span>
                    <span className="text-gray-600 ml-2 text-sm">
                      Total Votes
                    </span>
                  </div>
                  <div>
                    <span className="text-3xl lg:text-4xl font-bold text-gray-900">
                      {contest?.participants?.length || 0}
                    </span>
                    <span className="text-gray-600 ml-2 text-sm">
                      Contestant
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Section - Action Buttons */}
            <div className="flex flex-col gap-3 min-w-fit">
              <button
                onClick={() => navigate("/edit-contest")}
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
                    onClick={() => navigate("/leaderboards")}
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
                    <p className="text-2xl font-bold text-blue-700">
                      {contest?.voters?.length || 0}
                    </p>
                    <p className="text-xs text-blue-600">Total Votes</p>
                  </div>

                  <div className="bg-gradient-to-br from-green-50 to-green-100 p-4 rounded-xl text-center">
                    <div className="w-10 h-10 mx-auto mb-2 bg-green-500 rounded-full flex items-center justify-center">
                      <Target className="w-5 h-5 text-white" />
                    </div>
                    <p className="text-2xl font-bold text-green-700">
                      {contest?.positions?.length || 0}
                    </p>
                    <p className="text-xs text-green-600">Positions</p>
                  </div>

                  <div className="bg-gradient-to-br from-purple-50 to-purple-100 p-4 rounded-xl text-center">
                    <div className="w-10 h-10 mx-auto mb-2 bg-purple-500 rounded-full flex items-center justify-center">
                      <TrendingUp className="w-5 h-5 text-white" />
                    </div>
                    <p className="text-2xl font-bold text-purple-700">
                      {avgParticipation || 0}%
                    </p>
                    <p className="text-xs text-purple-600">Participation</p>
                  </div>

                  <div className="bg-gradient-to-br from-orange-50 to-orange-100 p-4 rounded-xl text-center">
                    <div className="w-10 h-10 mx-auto mb-2 bg-orange-500 rounded-full flex items-center justify-center">
                      <Trophy className="w-5 h-5 text-white" />
                    </div>
                    <p className="text-2xl font-bold text-orange-700">
                      {contestProgress}%
                    </p>
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
                    {contest?.positions.slice(0, 3).map((data, index) => {
                      const top = getTopCandidate(data);
                      return (
                        <div
                          key={data?._id}
                          className={`p-4 rounded-xl cursor-pointer transition-all hover:shadow-md ${
                            index === 0
                              ? "bg-gradient-to-r from-yellow-50 to-orange-50 border-2 border-yellow-200"
                              : index === 1
                              ? "bg-gradient-to-r from-gray-50 to-slate-50 border-2 border-gray-200"
                              : "bg-gradient-to-r from-amber-50 to-orange-50 border-2 border-amber-200"
                          }`}
                          onClick={() =>
                            console.log("Navigate to /leaderboards")
                          }
                        >
                          <div className="flex items-center gap-3">
                            <div
                              className={`w-8 h-8 rounded-full flex items-center justify-center ${
                                index === 0
                                  ? "bg-yellow-500 text-white"
                                  : index === 1
                                  ? "bg-gray-400 text-white"
                                  : "bg-amber-600 text-white"
                              }`}
                            >
                              {index === 0 ? (
                                <Trophy className="w-4 h-4" />
                              ) : index === 1 ? (
                                <Medal className="w-4 h-4" />
                              ) : (
                                <Award className="w-4 h-4" />
                              )}
                            </div>
                            <div className="flex-1">
                              <p className="font-semibold text-gray-900 text-sm">
                                {data.name}
                              </p>
                              <p className="text-xs text-gray-600">
                                {top.name}
                              </p>
                            </div>
                            <div className="text-right">
                              <p className="font-bold text-gray-900">
                                {top?.votes}
                              </p>
                              <p className="text-xs text-gray-500">votes</p>
                            </div>
                          </div>
                        </div>
                      );
                    })}
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
                        <p className="text-sm text-teal-600 font-medium">
                          Most Competitive
                        </p>
                        <p className="text-lg font-bold text-teal-800">
                          {mostCompetitive?.name || "N/A"}
                        </p>
                        <p className="text-xs text-teal-600">
                          {getPositionTotalVotes(mostCompetitive)} total votes
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="bg-gradient-to-r from-pink-50 to-rose-50 p-4 rounded-xl">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-pink-500 rounded-full flex items-center justify-center">
                        <Crown className="w-5 h-5 text-white" />
                      </div>
                      <div>
                        <p className="text-sm text-pink-600 font-medium">
                          Overall Leader
                        </p>
                        <p className="text-lg font-bold text-pink-800">
                          {mostCompetitive?.name || "N/A"}
                        </p>
                        <p className="text-xs text-pink-600">
                          Leading {mostCompetitive?.voters.length || 0} race
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Voters Details */}
              <div className="bg-white/80 backdrop-blur-sm border border-[#000000] rounded-3xl p-6 lg:p-8 shadow-xl ">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6 gap-4">
                  <h2 className="text-xl font-bold text-gray-900">
                    Voters Details
                  </h2>
                  <button className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-teal-900 hover:text-white transition-colors self-start">
                    View Full Voters Details
                  </button>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-gray-200">
                        <th className="text-left py-3 text-gray-900 font-semibold">
                          Voters Full Name
                        </th>
                        <th className="text-left py-3 text-gray-900 font-semibold">
                          Voters Email
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {contest?.voters.map((voter, index) => (
                        <tr key={index}>
                          <td className="py-3 text-left text-gray-700">
                            {voter?.name}
                          </td>
                          <td className="py-3 text-left  text-gray-700">
                            {voter?.email}
                          </td>
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
              <div className="bg-white/80 backdrop-blur-sm border border-[#000000] rounded-3xl p-6 shadow-xl">
                <div className="grid grid-cols-2 gap-6">
                  <div>
                    <h3 className="text-sm text-left text-gray-600 mb-1">
                      Start Date
                    </h3>
                    <p className="text-lg text-left font-bold text-gray-900">
                      {formatDate(contest?.startDate)}
                    </p>
                  </div>
                  <div>
                    <h3 className="text-sm text-left text-gray-600 mb-1">
                      Start Time
                    </h3>
                    <p className="text-lg text-left font-bold text-gray-900">
                      {contest?.startTime
                        ? `${contest.startTime.startTimeHour || "00"}:${
                            contest.startTime.startTimeMinute || "00"
                          } ${contest.startTime.startTimeAmPm || "AM"}`
                        : "N/A"}
                    </p>
                  </div>
                  <div>
                    <h3 className="text-sm text-left text-gray-600 mb-1">
                      End Date
                    </h3>
                    <p className="text-lg text-left font-bold text-gray-900">
                      {formatDate(contest?.endDate)}
                    </p>
                  </div>
                  <div>
                    <h3 className="text-sm text-left text-gray-600 mb-1">
                      End Time
                    </h3>
                    <p className="text-lg text-left font-bold text-gray-900">
                      {contest?.endTime
                        ? `${contest.endTime.endTimeHour || "00"}:${
                            contest.endTime.endTimeMinute || "00"
                          } ${contest.endTime.endTimeAmPm || "AM"}`
                        : "N/A"}
                    </p>
                  </div>
                </div>
              </div>

              {/* Contestant Details */}
              <div className="bg-white/80 backdrop-blur-sm border border-[#000000] rounded-3xl p-6 shadow-xl">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6 gap-4">
                  <h2 className="text-xl font-bold text-gray-900">
                    Contestant
                  </h2>
                  <button className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-teal-900 hover:text-white transition-colors self-start">
                    View All Contestants
                  </button>
                </div>

                <div className="space-y-3">
                  {contest?.participants.map((contestant, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between p-3 bg-gray-100 rounded-xl hover:bg-gray-200 transition-colors"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-gradient-to-r from-orange-400 to-red-400 rounded-full flex items-center justify-center text-white">
                          {/* {contestant.avatar} */}👨‍🎨
                        </div>
                        <span className="font-medium text-gray-900">
                          {contestant.name}
                        </span>
                      </div>
                      <div className="w-8 h-8 bg-orange-500 rounded-full flex items-center justify-center text-white">
                        <ChevronRight size={16} />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* End Contest */}
              <div className="bg-white/80 backdrop-blur-sm border border-[#000000] rounded-3xl p-6 shadow-xl">
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
                      className={`w-3 h-3 rounded-full transition-colors ${
                        index === currentSection
                          ? "bg-orange-400"
                          : "bg-gray-300 hover:bg-gray-400"
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
