/* eslint-disable no-unused-vars */
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
import positionData from "../data/positionData";
import { toast } from "react-toastify";

const Contestdetails = ({ isPaidContest, voterFee }) => {
  const { contestId } = useParams();
  const [contest, setContest] = useState(null);
  const [activeTab, setActiveTab] = useState(0);
  const [currentSection, setCurrentSection] = useState(0);
  const [countdown, setCountdown] = useState("");
  const [selectedPositionData, setSelectedPositionData] = useState({});
  const navigate = useNavigate();

  // Simulated contest start and end date/time for countdown
  // These should be replaced with actual values from backend or global state
  useEffect(() => {
    if (!contest) return;

    // Build start date/time
    const startDate = new Date(contest.startDate);
    if (contest.startTime) {
      let hour = parseInt(contest.startTime.startTimeHour, 10);
      if (contest.startTime.startTimeAmPm === "PM" && hour < 12) hour += 12;
      startDate.setHours(
        hour,
        parseInt(contest.startTime.startTimeMinute, 10),
        0,
        0
      );
    }

    // Build end date/time
    const endDate = new Date(contest.endDate);
    if (contest.endTime) {
      let hour = parseInt(contest.endTime.endTimeHour, 10);
      if (contest.endTime.endTimeAmPm === "PM" && hour < 12) hour += 12;
      endDate.setHours(hour, parseInt(contest.endTime.endTimeMinute, 10), 0, 0);
    }

    const contestStartDateTime = startDate.getTime();
    const contestEndDateTime = endDate.getTime();

    const interval = setInterval(() => {
      const now = new Date().getTime();

      if (now < contestStartDateTime) {
        // console.log(contestStartDateTime);
        // Countdown to contest start
        const distance = contestStartDateTime - now;

        const days = Math.floor(distance / (1000 * 60 * 60 * 24));
        const hours = Math.floor(
          (distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
        );
        const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((distance % (1000 * 60)) / 1000);

        setCountdown(` ${days}d ${hours}h ${minutes}m ${seconds}s`);
      } else if (now >= contestStartDateTime && now < contestEndDateTime) {
        // console.log(contestStartDateTime, contestEndDateTime);
        // Countdown to contest end
        const distance = contestEndDateTime - now;

        const days = Math.floor(distance / (1000 * 60 * 60 * 24));
        const hours = Math.floor(
          (distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
        );
        const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((distance % (1000 * 60)) / 1000);

        setCountdown(`${days}d ${hours}h ${minutes}m ${seconds}s`);
      } else {
        // Contest ended
        setCountdown("Contest Ended");
        clearInterval(interval);
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [contest]);

  // console.log(contest);

  useEffect(() => {
    const fetchContest = async () => {
      try {
        const res = await axios.get(`/api/contest/${contestId}`);
        console.log(res);
        setContest(res.data.contest);
      } catch (err) {
        console.error("Failed to fetch contest:", err);
      }
    };
    if (contestId) fetchContest();
  }, [contestId]);

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

  // const contestProgress = 65; // This could be calculated based on time elapsed

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

  // Combine all contestants from all positions and take first 5, include position info
  const contestantDetails = Object.entries(positionData)
    .flatMap(([position, data]) =>
      data.contestants.map((contestant) => ({
        ...contestant,
        position,
      }))
    )
    .slice(0, 5);

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

  function getContestProgress(contest) {
    // Combine start date and time
    const startDate = new Date(contest.startDate);
    const endDate = new Date(contest.endDate);

    // If you have time fields, set hours/minutes
    if (contest.startTime) {
      let hour = parseInt(contest.startTime.startTimeHour, 10);
      if (contest.startTime.startTimeAmPm === "PM" && hour < 12) hour += 12;
      startDate.setHours(
        hour,
        parseInt(contest.startTime.startTimeMinute, 10),
        0,
        0
      );
    }
    if (contest.endTime) {
      let hour = parseInt(contest.endTime.endTimeHour, 10);
      if (contest.endTime.endTimeAmPm === "PM" && hour < 12) hour += 12;
      endDate.setHours(hour, parseInt(contest.endTime.endTimeMinute, 10), 0, 0);
    }

    const now = new Date();

    // If contest hasn't started yet
    if (now < startDate) return 0;
    // If contest is over
    if (now > endDate) return 100;

    const total = endDate - startDate;
    const elapsed = now - startDate;
    return Math.round((elapsed / total) * 100);
  }

  function getTopContestant(position) {
    if (!position || !position.contestants || !position.voters)
      return { name: "No Votes Yet", votes: 0 };
    // Count votes for each contestant
    const voteCounts = {};
    position.voters.forEach((voter) => {
      if (voter.votedFor) {
        voteCounts[voter.votedFor] = (voteCounts[voter.votedFor] || 0) + 1;
      }
    });
    // Find contestant with max votes
    let top = { name: "No Votes Yet", votes: 0 };
    position.contestants.forEach((contestant) => {
      const votes = voteCounts[contestant._id] || 0;
      if (votes > top.votes) {
        top = { name: contestant.name, votes };
      }
    });
    return top;
  }

  const topContestant = getTopContestant(selectedPositionData);

  const handleSectionAction = async () => {
    if (!contest) return;
    let updatedFields = {};

    if (currentData.title === "Start Contest") {
      const now = new Date();
      updatedFields = {
        startDate: now.toISOString().split("T")[0],
        startTime: {
          startTimeHour: now.getHours() % 12 || 12,
          startTimeMinute: now.getMinutes().toString().padStart(2, "0"),
          startTimeAmPm: now.getHours() >= 12 ? "PM" : "AM",
        },
        status: "ongoing",
      };
    } else if (currentData.title === "Pause Contest") {
      updatedFields = {
        status: "pause",
      };
    } else if (currentData.title === "End Contest") {
      const now = new Date();
      updatedFields = {
        endDate: now.toISOString().split("T")[0],
        endTime: {
          endTimeHour: now.getHours() % 12 || 12,
          endTimeMinute: now.getMinutes().toString().padStart(2, "0"),
          endTimeAmPm: now.getHours() >= 12 ? "PM" : "AM",
        },
        status: "completed",
      };
    }

    try {
      await axios.put(`/api/contest/${contest._id}/status`, updatedFields);
      setContest((prev) => ({ ...prev, ...updatedFields }));
      toast.success("Contest updated successfully!");
    } catch (err) {
      console.error("Failed to update contest:", err);
      toast.error("Failed to update contest!");
    }
  };

  return (
    <div className="flex min-h-screen">
      <Sidebar />

      <div className="flex-1 w-full p-6 ml-20">
        {/* Header */}
        <h2 className="text-[30px] text-left font-bold text-gray-900 mb-8">
          Contest
        </h2>

        <div className="relative mb-2  h-65">
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
              <div className="h-50 w-50 rounded-full flex items-center justify-center border-4 border-black overflow-hidden -mt-5 ml-5">
                <img
                  src={contest?.contestLogoImageUrl || LogoImage}
                  alt="Logo"
                  className="w-full h-full object-cover"
                />
              </div>

              {/* Content */}
              <div>
                <h2 className="text-[32px] lg:text-[32px] text-left font-bold text-gray-900 mb-2">
                  {contest?.title || "Contest Name"}
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
                onClick={() => navigate(`/edit-contest/${contestId}`)}
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
                    onClick={() => navigate(`/leaderboards/${contestId}`)}
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
                      {contest ? getContestProgress(contest) : 0}%
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
                      // const top = getTopCandidate(data);
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
                          onClick={() => setSelectedPositionData(data)}
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
                            </div>
                            <div className="text-right">
                              <p className="font-bold text-gray-900">
                                {data?.voters.length || 0}
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
                          {topContestant.name}
                        </p>
                        <p className="text-xs text-pink-600">
                          Leading {topContestant.votes} votes
                        </p>
                      </div>
                    </div>
                  </div>

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
                </div>
              </div>

              {/* Voters Details */}
              <div className="bg-white/80 backdrop-blur-sm border border-[#000000] rounded-3xl p-6 lg:p-8 shadow-xl ">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6 gap-4">
                  <h2 className="text-xl font-bold text-gray-900">
                    Voters Details
                  </h2>
                  <button
                    onClick={() => navigate(`/voters-details/${contestId}`)}
                    className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-teal-900 hover:text-white transition-colors self-start"
                  >
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
                      {contest?.voters && contest.voters.length > 0 ? (
                        contest.voters.map((voter, index) => (
                          <tr key={index}>
                            <td className="py-3 text-left text-gray-700">
                              {voter?.name}
                            </td>
                            <td className="py-3 text-left text-gray-700">
                              {voter?.email}
                            </td>
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td
                            colSpan={2}
                            className="py-6 text-center text-gray-500"
                          >
                            No Voters Yet
                          </td>
                        </tr>
                      )}
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
                  {(() => {
                    const startDate = new Date(contest?.startDate);
                    if (contest?.startTime) {
                      let hour = parseInt(contest.startTime.startTimeHour, 10);
                      if (contest.startTime.startTimeAmPm === "PM" && hour < 12)
                        hour += 12;
                      startDate.setHours(
                        hour,
                        parseInt(contest.startTime.startTimeMinute, 10),
                        0,
                        0
                      );
                    }
                    const endDate = new Date(contest?.endDate);
                    if (contest?.endTime) {
                      let hour = parseInt(contest.endTime.endTimeHour, 10);
                      if (contest.endTime.endTimeAmPm === "PM" && hour < 12)
                        hour += 12;
                      endDate.setHours(
                        hour,
                        parseInt(contest.endTime.endTimeMinute, 10),
                        0,
                        0
                      );
                    }
                    const now = new Date();
                    if (contest?.status === "completed" || now > endDate) {
                      return (
                        <h3 className="text-lg font-bold text-gray-900 mb-2">
                          Contest{" "}
                          <span className="text-orange-600 font-bold">
                            Ended
                          </span>
                        </h3>
                      );
                    } else if (now < startDate) {
                      return (
                        <h3 className="text-lg font-bold text-gray-900 mb-2">
                          Contest{" "}
                          <span className="text-orange-600 font-bold">
                            Starts
                          </span>{" "}
                          In
                        </h3>
                      );
                    } else {
                      return (
                        <h3 className="text-lg font-bold text-gray-900 mb-2">
                          Contest{" "}
                          <span className="text-orange-600 font-bold">
                            Ends
                          </span>{" "}
                          In
                        </h3>
                      );
                    }
                  })()}
                  <p className="text-xl font-semibold text-orange-600">
                    {countdown}
                  </p>
                </div>
              </div>

              {/* Contestant Details */}
              <div className="bg-white/80 w-80 backdrop-blur-sm border border-[#000000] rounded-3xl p-6 shadow-xl">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6 gap-4">
                  <h2 className="text-xl font-bold text-gray-900">
                    Contestant
                  </h2>
                  <button
                    onClick={() => navigate(`/contestant/${contestId}`)}
                    className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-teal-900 hover:text-white transition-colors self-start"
                  >
                    View All Contestants
                  </button>
                </div>

                <div className="space-y-3">
                  {contest?.participants.map((contestant, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between p-3 bg-gray-100 rounded-xl hover:bg-gray-200 transition-colors"
                    >
                      <div
                        onClick={() =>
                          navigate(
                            `/contestantdetails/${
                              contestant.position
                            }/${encodeURIComponent(contestant.name)}`
                          )
                        }
                        className="flex items-center gap-3 cursor-pointer"
                      >
                        {contestant?.image ? (
                          <img
                            src={contestant?.image}
                            alt={contestant.name}
                            className="w-10 h-10 rounded-full object-cover"
                          />
                        ) : (
                          <div className="w-10 h-10 bg-gradient-to-r from-orange-400 to-red-400 rounded-full flex items-center justify-center text-white">
                            {contestant.name.charAt(0)}
                          </div>
                        )}
                        <span className="font-medium text-gray-900">
                          {contestant.name}
                        </span>
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
                  className={`w-full 
                   ${currentData.buttonColor} text-white py-3 rounded-xl 
                   transition-colors font-semibold flex items-center justify-center gap-2`}
                  onClick={handleSectionAction}
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
