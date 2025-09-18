/* eslint-disable no-unused-vars */
import React, { useState, useMemo, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Sidebar from "../Components/sidebar";
import BannerImage from "../assets/Rectangle _5189.png";
import LogoImage from "../assets/Ellipse 20.png";
import {
  Edit,
  Share2,
  Trophy,
  Users,
  Vote,
  TrendingUp,
  Award,
  Crown,
  Medal,
  Target,
  ChevronLeft,
} from "lucide-react";
import { Pie, Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  BarElement,
} from "chart.js";
import positionData from "../data/positionData";
import axios from "axios";
import VotersLink from "../Components/voterslink";

ChartJS.register(
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  BarElement
);

// const distributeVotes = (totalVotes, contestants) => {
//   const votes = [];
//   let remainingVotes = totalVotes;

//   for (let i = 0; i < contestants?.length; i++) {
//     const isLast = i === contestants?.length - 1;
//     let vote;

//     if (isLast) {
//       vote = remainingVotes;
//     } else {
//       const max = Math.floor((remainingVotes / (contestants?.length - i)) * 1.5);
//       vote = Math.floor(Math.random() * (max + 1));
//     }

//     votes.push(vote);
//     remainingVotes -= vote;
//   }

//   return contestants.map((c, i) => ({
//     ...c,
//     votes: votes[i],
//     percentage: ((votes[i] / totalVotes) * 100).toFixed(1),
//   }));
// };

const Leaderboards = () => {
  const { contestId } = useParams();
  const [contest, setContest] = useState(null);
  const [activeTab, setActiveTab] = useState("");
  const [positionStats, setPositionStats] = useState({
    totalVotes: 0,
    voterCount: 0,
  });
  const [isVotersLinkOpen, setIsVotersLinkOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchContest = async () => {
      try {
        const res = await axios.get(`/api/contest/${contestId}`);
        setContest(res.data.contest);
        // Set first position as default tab
        if (
          res.data.contest.positions &&
          res.data.contest.positions.length > 0
        ) {
          setActiveTab(res.data.contest.positions[0].name);
        }
      } catch (err) {
        console.error("Failed to fetch contest:", err);
      }
    };
    if (contestId) fetchContest();
  }, [contestId]);

  useEffect(() => {
    if (!contest || !activeTab) return;

    // Find the selected position object
    const position = contest.positions?.find((p) => p.name === activeTab);
    if (!position) {
      setPositionStats({ totalVotes: 0, voterCount: 0 });
      return;
    }

    let totalVotes = 0;
    let voterCount = 0;

    if (!contest.isClosedContest) {
      // ✅ OPEN contest
      totalVotes =
        position.voters?.reduce((sum, v) => sum + (v.multiplier || 0), 0) || 0;
      voterCount = position.voters?.length || 0;
    } else {
      // ✅ CLOSED contest
      totalVotes =
        contest.closedContestVoters?.reduce((sum, v) => {
          const count =
            v.votedFor?.filter((vote) => vote.positionTitle === position.name)
              .length || 0;
          return sum + count * (v.multiplier || 0);
        }, 0) || 0;

      // number of unique voters who voted for this position
      voterCount =
        contest.closedContestVoters?.filter((v) =>
          v.votedFor?.some((vote) => vote.positionTitle === position.name)
        ).length || 0;
    }

    setPositionStats({ totalVotes, voterCount });
  }, [activeTab, contest]);

  // Get position data from contest
  const positions = contest?.positions || [];
  const activePosition = positions.find((pos) => pos.name === activeTab);

  // Get contestants and votes for active position
  const contestants = activePosition?.contestants || [];
  const voters = activePosition?.voters || [];
  const totalVotes = voters.length;

  // Calculate votes per contestant
  // contestants: position.contestants
  // contest: full contest object (has isClosedContest, voters arrays, etc.)
  // positionName: current position name

  const contestantVotes = contestants.map((c) => {
    let votes = 0;

    if (!contest.isClosedContest) {
      // 🟢 OPEN CONTEST
      // Count all voters in *this position* whose votedFor matches the candidate
      votes =
        activePosition?.voters?.reduce((total, v) => {
          return v.votedFor?.toString() === c._id.toString()
            ? total + (v.multiplier || 0)
            : total;
        }, 0) || 0;
    } else {
      // 🔒 CLOSED CONTEST
      // Count from contest.closedContestVoters.
      // Each voter may have voted for multiple positions.
      votes =
        contest?.closedContestVoters?.reduce((total, v) => {
          const count =
            v?.votedFor?.filter(
              (vote) =>
                vote.positionTitle === activePosition?.name &&
                vote.votedFor?.toString() === c._id.toString()
            ).length || 0;
          return total + count * (v.multiplier || 0);
        }, 0) || 0;
    }

    return {
      ...c,
      votes,
      percentage: positionStats?.totalVotes
        ? ((votes / positionStats?.totalVotes) * 100).toFixed(1)
        : "0.0",
    };
  });

  const getPositionTotalVotes = (pos, contest) => {
    if (!pos || !contest) return 0;

    if (contest.isClosedContest) {
      // closed: look at contest.closedContestVoters
      return (
        contest.closedContestVoters?.reduce((sum, voter) => {
          const count =
            voter.votedFor?.filter((v) => v.positionTitle === pos.name)
              .length || 0;
          return sum + count * (voter.multiplier || 1);
        }, 0) || 0
      );
    }

    // open: normal position.voters array
    return pos.voters?.reduce((sum, v) => sum + (v.multiplier || 1), 0) || 0;
  };

  // Global stats
  const totalGlobalVotes = useMemo(
    () =>
      contest?.positions?.reduce(
        (sum, p) => sum + getPositionTotalVotes(p, contest),
        0
      ) || 0,
    [contest]
  );

  const turnoutRate = positions.length
    ? ((totalGlobalVotes / (positions.length * 50)) * 100).toFixed(1)
    : "0.0";

  // Most competitive position (most votes)
  const mostCompetitive = useMemo(() => {
    if (!contest?.positions?.length) return "";

    const topPosition = contest.positions.reduce((prev, curr) =>
      getPositionTotalVotes(curr, contest) >
      getPositionTotalVotes(prev, contest)
        ? curr
        : prev
    );

    // Return just the name (string) like your example
    return topPosition?.name || "";
  }, [contest]);
  // Pie chart data
  // ✅ Build the chart data
  /* small palette (will repeat if there are more positions) */
  const PALETTE = [
    "rgba(255, 99, 132, 0.8)",
    "rgba(54, 162, 235, 0.8)",
    "rgba(255, 206, 86, 0.8)",
    "rgba(75, 192, 192, 0.8)",
    "rgba(153, 102, 255, 0.8)",
    "rgba(255, 159, 64, 0.8)",
  ];

  const PALETTE_BORDER = [
    "rgba(255, 99, 132, 1)",
    "rgba(54, 162, 235, 1)",
    "rgba(255, 206, 86, 1)",
    "rgba(75, 192, 192, 1)",
    "rgba(153, 102, 255, 1)",
    "rgba(255, 159, 64, 1)",
  ];

  /* pieData: always returns a valid object (never null) */
  const pieData = useMemo(() => {
    const positions = contest?.positions || [];

    // Build arrays
    const labels = positions.map((p) => p.name);
    const data = positions.map((p) => getPositionTotalVotes(p, contest));

    // Color arrays sized to positions length
    const backgroundColor = positions.map(
      (_, i) => PALETTE[i % PALETTE.length]
    );
    const borderColor = positions.map(
      (_, i) => PALETTE_BORDER[i % PALETTE_BORDER.length]
    );

    return {
      labels,
      datasets: [
        {
          label: "Votes per Position",
          data,
          backgroundColor,
          borderColor,
          borderWidth: 2,
          hoverOffset: 8,
        },
      ],
    };
  }, [contest]); // recompute when contest changes

  // Bar chart data
  const contestantData = {
    labels: contestantVotes.map((c) => c.name),
    datasets: [
      {
        label: "Votes",
        data: contestantVotes.map((c) => c.votes),
        backgroundColor: "rgba(20, 184, 166, 0.7)",
        borderColor: "rgba(20, 184, 166, 1)",
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
        position: "bottom",
        labels: {
          padding: 15,
          usePointStyle: true,
          font: {
            size: 11,
          },
        },
      },
      tooltip: {
        backgroundColor: "rgba(0, 0, 0, 0.8)",
        titleColor: "white",
        bodyColor: "white",
        borderColor: "rgba(255, 255, 255, 0.2)",
        borderWidth: 1,
      },
    },
  };

  const barOptions = {
    ...chartOptions,
    plugins: {
      ...chartOptions.plugins,
      legend: {
        display: false,
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        grid: {
          color: "rgba(0, 0, 0, 0.1)",
        },
      },
      x: {
        grid: {
          display: false,
        },
      },
    },
  };

  // Quick stats
  const sortedContestants = [...contestantVotes].sort(
    (a, b) => b.votes - a.votes
  );

  const leadingCandidate = sortedContestants[0]?.name || "N/A";
  const voteMargin =
    sortedContestants.length > 1
      ? `${sortedContestants[0].votes - sortedContestants[1].votes} votes`
      : "0 votes";

  // Get the voting link for this contest
  const votingLink = `${window.location.origin}/vote/${contestId}`;

  return (
    <div className="flex min-h-screen bg-white overflow-x-hidden lg:gap-[10rem]">
      <Sidebar />
      <div className="flex-1 p-6 md:ml-20 ">
        <div className="flex items-center gap-4 mb-8">
          <button
            onClick={() => navigate(-1)}
            className="p-2 rounded-full hover:bg-gray-200 transition-colors"
            aria-label="Back to Contest Details"
          >
            <ChevronLeft size={24} />
          </button>
          <h2 className="text-[30px] text-left font-bold text-gray-900 mb-0">
            Leaderboard
          </h2>
        </div>

        <div className="relative mb-2  h-65">
          <img
            src={contest?.coverImageUrl || BannerImage}
            alt="Contest Banner"
            className="w-full object-cover rounded-lg h-full absolute inset-0"
          />
        </div>

        <div className="relative z-10 backdrop-blur-sm rounded-3xl p-6 lg:p-8 mt-6">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
            {/* Left Section - Logo and Content */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 sm:gap-6 min-w-0 flex-1">
              {/* Logo */}
              <div className="h-16 w-16 sm:h-20 sm:w-20 lg:h-50 lg:w-50 rounded-full flex items-center justify-center border-4 border-black overflow-hidden flex-shrink-0">
                <img
                  src={contest?.contestLogoImageUrl || LogoImage}
                  alt="Logo"
                  className="w-full h-full object-cover"
                />
              </div>

              {/* Content */}
              <div className="flex-1 min-w-0">
                <h2 className="text-xl sm:text-2xl lg:text-[32px] text-left font-bold text-gray-900 mb-2 break-words">
                  {contest?.title} ({activeTab} Leaderboard)
                </h2>
                <p className="text-gray-600 text-left text-sm sm:text-base break-words">
                  {contest?.description}
                </p>

                {/* Stats */}
                <div className="flex flex-wrap items-center gap-4 sm:gap-6 lg:gap-8 mt-4">
                  <div>
                    <span className="text-xl sm:text-2xl lg:text-3xl xl:text-4xl font-bold text-gray-900">
                      {positionStats?.totalVotes}
                    </span>
                    <span className="text-gray-600 ml-2 text-xs sm:text-sm">
                      Votes for ({activeTab} Position)
                    </span>
                  </div>
                  <div>
                    <span className="text-xl sm:text-2xl lg:text-3xl xl:text-4xl font-bold text-gray-900">
                      {contestants?.length}
                    </span>
                    <span className="text-gray-600 ml-2 text-xs sm:text-sm">
                      Contestants
                    </span>
                  </div>
                  <div>
                    <span className="text-xl sm:text-2xl lg:text-3xl xl:text-4xl font-bold text-gray-900">
                      {positionStats?.voterCount}
                    </span>
                    <span className="text-gray-600 ml-2 text-xs sm:text-sm">
                      Voters
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Section - Action Buttons */}
            <div className="flex flex-col sm:flex-row lg:flex-col gap-3 w-full sm:w-auto lg:min-w-fit">
              <button
                onClick={() => navigate(`/edit-contest/${contestId}`)}
                className="flex items-center justify-center gap-2 px-4 py-2 border border-[#000000] rounded-lg hover:bg-teal-900 hover:text-white transition-colors text-sm font-medium"
              >
                <Edit size={16} />
                Edit Contest
              </button>
              <button
                className="flex items-center justify-center gap-2 px-4 py-2 border border-[#000000] rounded-lg hover:bg-teal-900 hover:text-white transition-colors text-sm font-medium"
                onClick={() => setIsVotersLinkOpen(true)}
              >
                <Share2 size={16} />
                Share Voters Link
              </button>
            </div>
            <VotersLink
              open={isVotersLinkOpen}
              onClose={() => setIsVotersLinkOpen(false)}
              link={votingLink}
            />
          </div>

          {/* Key Metrics Dashboard */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mt-12 mb-8">
            {[
              {
                icon: <Vote className="w-5 h-5 text-blue-600" />,
                bg: "bg-blue-100",
                label: "Global Votes",
                value: totalGlobalVotes,
              },
              {
                icon: <Users className="w-5 h-5 text-green-600" />,
                bg: "bg-green-100",
                label: "Positions",
                value: positions?.length,
              },
              {
                icon: <TrendingUp className="w-5 h-5 text-purple-600" />,
                bg: "bg-purple-100",
                label: "Turnout Rate",
                value: `${turnoutRate}%`,
              },
              {
                icon: <Target className="w-5 h-5 text-orange-600" />,
                bg: "bg-orange-100",
                label: "Most Competitive",
                value: mostCompetitive,
              },
            ].map((metric, index) => (
              <div
                key={index}
                className="bg-white/90 backdrop-blur-sm rounded-2xl p-4 shadow-lg border border-gray-200"
              >
                <div className="flex items-center gap-3">
                  <div className={`p-2 ${metric.bg} rounded-xl`}>
                    {metric.icon}
                  </div>
                  <div>
                    <p className="text-xs text-gray-600">{metric.label}</p>
                    <p className="text-xl font-bold text-gray-900">
                      {metric.value}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Position Tabs */}
          <div className="w-full overflow-x-auto mt-12 mb-8">
            <div className="flex gap-2 sm:gap-4 min-w-max sm:grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 sm:min-w-0">
              {positions.map((pos) => {
                // === 🔹 1️⃣ Calculate each candidate's votes for THIS position ===

                // === 🔹 3️⃣ Total votes for the position (including multiplier) ===
                const totalPositionVotes = !contest.isClosedContest
                  ? pos.voters?.reduce(
                      (sum, v) => sum + (v.multiplier || 0),
                      0
                    ) || 0
                  : contest.closedContestVoters?.reduce((sum, v) => {
                      const count =
                        v.votedFor?.filter(
                          (vote) => vote.positionTitle === pos.name
                        ).length || 0;
                      return sum + count * (v.multiplier || 0);
                    }, 0) || 0;
                return (
                  <button
                    key={pos.name}
                    onClick={() => setActiveTab(pos.name)}
                    className={`px-4 py-4 sm:px-6 sm:py-6 rounded-lg font-medium transition-all duration-200 flex-shrink-0 sm:flex-shrink min-w-[120px] sm:min-w-0 ${
                      activeTab === pos.name
                        ? "bg-orange-500 text-white shadow-lg transform scale-105"
                        : "bg-teal-800 text-white hover:bg-teal-700 hover:shadow-md"
                    }`}
                  >
                    <div className="flex flex-col items-center">
                      <span className="font-semibold text-sm sm:text-base truncate max-w-full">
                        {pos.name}
                      </span>
                      <span className="text-xs opacity-75 whitespace-nowrap">
                        ({totalPositionVotes || 0} votes)
                      </span>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Main Content Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Leaderboard */}
            <div className="lg:col-span-2">
              <div className="bg-white/80 backdrop-blur-sm rounded-3xl border border-[#000000] p-6 lg:p-8 shadow-xl">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6 gap-4">
                  <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                    <Crown className="w-6 h-6 text-yellow-500" />
                    Leaderboard - {activeTab}
                  </h2>
                  <div className="text-right">
                    <p className="text-sm text-gray-600">Total Votes</p>
                    <p className="text-2xl font-bold text-teal-600">
                      {positionStats?.totalVotes}
                    </p>
                  </div>
                </div>

                <div className="space-y-4 sm:space-y-6">
                  {contestantVotes
                    .sort((a, b) => b.votes - a.votes)
                    .map((contestant, index) => {
                      const isWinner = index === 0;
                      const isRunner = index === 1;
                      const isThird = index === 2;

                      return (
                        <div
                          key={index}
                          className={`flex items-center gap-2 sm:gap-4 p-3 sm:p-4 rounded-2xl transition-all duration-200 ${
                            isWinner
                              ? "bg-gradient-to-r from-yellow-50 to-orange-50 border-2 border-yellow-200"
                              : isRunner
                              ? "bg-gradient-to-r from-gray-50 to-slate-50 border-2 border-gray-200"
                              : isThird
                              ? "bg-gradient-to-r from-orange-50 to-yellow-50 border-2 border-orange-200"
                              : "bg-gray-50/50 border border-gray-100"
                          }`}
                        >
                          <div
                            className={`flex items-center justify-center w-8 h-8 sm:w-10 sm:h-10 rounded-full font-bold text-sm sm:text-lg flex-shrink-0 ${
                              isWinner
                                ? "bg-yellow-500 text-white"
                                : isRunner
                                ? "bg-gray-400 text-white"
                                : isThird
                                ? "bg-orange-600 text-white"
                                : "bg-gray-300 text-gray-600"
                            }`}
                          >
                            {isWinner ? (
                              <Trophy className="w-4 h-4 sm:w-5 sm:h-5" />
                            ) : isRunner ? (
                              <Medal className="w-4 h-4 sm:w-5 sm:h-5" />
                            ) : isThird ? (
                              <Award className="w-4 h-4 sm:w-5 sm:h-5" />
                            ) : (
                              index + 1
                            )}
                          </div>

                          {contestant.image ? (
                            <img
                              src={contestant.image}
                              alt={contestant.name}
                              className="w-10 h-10 sm:w-12 sm:h-12 rounded-full object-cover border-2 border-white shadow-sm flex-shrink-0"
                            />
                          ) : (
                            <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-r from-orange-400 to-red-400 rounded-full flex items-center justify-center text-white text-lg sm:text-xl flex-shrink-0">
                              {contestant.name.charAt(0)}
                            </div>
                          )}

                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 mb-1">
                              <h3 className="font-semibold text-left text-gray-900 text-sm sm:text-base truncate">
                                {contestant.name}
                              </h3>
                              {isWinner && (
                                <Crown className="w-3 h-3 sm:w-4 sm:h-4 text-yellow-500 flex-shrink-0" />
                              )}
                            </div>
                            {contestant.party && (
                              <p className="text-xs text-gray-600 mb-2 truncate">
                                {contestant.party}
                              </p>
                            )}
                            <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4">
                              <div className="flex-1 bg-gray-200 rounded-full h-2 sm:h-3 overflow-hidden">
                                <div
                                  className={`h-full rounded-full transition-all duration-1000 ${
                                    isWinner
                                      ? "bg-gradient-to-r from-yellow-400 to-orange-500"
                                      : "bg-gradient-to-r from-teal-500 to-teal-600"
                                  }`}
                                  style={{
                                    width: `${
                                      positionStats?.totalVotes
                                        ? (contestant.votes /
                                            positionStats?.totalVotes) *
                                          100
                                        : 0
                                    }%`,
                                  }}
                                ></div>
                              </div>
                              <div className="text-left sm:text-right flex-shrink-0">
                                <span className="text-xs sm:text-sm text-gray-600 block">
                                  {contestant.votes} of{" "}
                                  {positionStats?.totalVotes} votes
                                </span>
                                <p className="text-xs text-gray-500">
                                  {contestant.percentage}%
                                </p>
                              </div>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                </div>
              </div>
            </div>

            {/* Analytics Sidebar */}
            <div className="space-y-6">
              {/* Pie Chart */}
              <div className="bg-white/90 backdrop-blur-sm rounded-3xl shadow-xl border border-gray-200 p-6">
                <h4 className="text-lg font-semibold mb-4 flex items-center gap-2">
                  <div className="w-3 h-3 bg-gradient-to-r from-purple-400 to-pink-400 rounded-full"></div>
                  Vote Distribution by Position
                </h4>
                <div className="h-64">
                  <Pie data={pieData} options={chartOptions} />
                </div>
              </div>

              {/* Bar Chart */}
              <div className="bg-white/90 backdrop-blur-sm rounded-3xl shadow-xl border border-gray-200 p-6">
                <h4 className="text-lg font-semibold mb-4 flex items-center gap-2">
                  <div className="w-3 h-3 bg-gradient-to-r from-teal-400 to-blue-400 rounded-full"></div>
                  {activeTab} Performance
                </h4>
                <div className="h-64">
                  <Bar data={contestantData} options={barOptions} />
                </div>
              </div>

              {/* Quick Stats */}
              <div className="bg-white/90 backdrop-blur-sm rounded-3xl shadow-xl border border-gray-200 p-6">
                <h4 className="text-lg font-semibold mb-4">
                  Position Insights
                </h4>
                <div className="space-y-4">
                  {[
                    {
                      label: "🏆 Leading Candidate",
                      value: leadingCandidate,
                      bg: "from-yellow-50 to-orange-50",
                    },
                    {
                      label: "📊 Vote Margin",
                      value: voteMargin,
                      bg: "from-blue-50 to-teal-50",
                    },
                    {
                      label: "👥 Participation",
                      value: `${positionStats?.voterCount} voters`,
                      bg: "from-green-50 to-emerald-50",
                    },
                    {
                      label: "🎯 Candidates",
                      value: contestants?.length,
                      bg: "from-purple-50 to-pink-50",
                    },
                  ].map((stat, index) => (
                    <div
                      key={index}
                      className={`flex justify-between items-center p-3 bg-gradient-to-r ${stat.bg} rounded-lg`}
                    >
                      <span className="text-sm text-gray-600">
                        {stat.label}
                      </span>
                      <span className="font-semibold text-gray-900">
                        {stat.value}
                      </span>
                    </div>
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

export default Leaderboards;
