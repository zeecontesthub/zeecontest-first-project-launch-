/* eslint-disable no-unused-vars */
import React, { useEffect, useMemo, useState } from 'react';
import { Edit, Eye, Share2 } from 'lucide-react';
import Sidebar from '../Components/sidebar';
import BannerImage from '../assets/Rectangle _5189.png';
import LogoImage from '../assets/Ellipse 20.png';
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
} from 'lucide-react';

import { FaInstagram, FaGlobe } from 'react-icons/fa';
import { FaXTwitter } from 'react-icons/fa6';
import { useNavigate, useParams } from 'react-router-dom';

// import positionData from "../data/positionData";
import axios from 'axios';
import positionData from '../data/positionData';
import { toast } from 'react-toastify';
import VotersLink from '../Components/voterslink';
import ContestActionConfirm from '../Components/ContestActionConfirm';

// eslint-disable-next-line no-unused-vars
const Contestdetails = ({ isPaidContest, voterFee }) => {
  const { contestId } = useParams();
  const [contest, setContest] = useState(null);
  // const [activeTab, setActiveTab] = useState(0);
  const [currentSection, setCurrentSection] = useState(0);
  const [countdown, setCountdown] = useState('');
  // eslint-disable-next-line no-unused-vars
  const [selectedPositionData, setSelectedPositionData] = useState({});
  const [isVotersLinkOpen, setIsVotersLinkOpen] = useState(false);
  const [isActionConfirmOpen, setIsActionConfirmOpen] = useState(false);
  const [pendingAction, setPendingAction] = useState(null);
  const navigate = useNavigate();
  // const [positionData, setPositionData] = useState({});

  const socialLinks = {
    instagram: 'https://www.instagram.com/your-username',
    x: 'https://x.com/your-username',
    website: 'https://www.your-website.com',
  };

  useEffect(() => {
    if (!contest) return;

    // Build start date/time
    const startDate = new Date(contest.startDate);
    if (contest.startTime) {
      let hour = parseInt(contest.startTime.startTimeHour, 10);
      if (contest.startTime.startTimeAmPm === 'PM' && hour < 12) hour += 12;
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
      if (contest.endTime.endTimeAmPm === 'PM' && hour < 12) hour += 12;
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
        setCountdown('Contest Ended');
        clearInterval(interval);
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [contest]);

  useEffect(() => {
    const fetchContest = async () => {
      try {
        const res = await axios.get(`/api/contest/${contestId}`);
        console.log(res);
        setContest(res.data.contest);
      } catch (err) {
        console.error('Failed to fetch contest:', err);
      }
    };
    if (contestId) fetchContest();
  }, [contestId]);

  const sections = [
    {
      title: 'Start Contest',
      buttonText: 'Start Contest',
      buttonColor: 'bg-green-600 hover:bg-green-700',
      icon: <Play size={20} />,
      description:
        'Begin the voting process for all voters before the start time',
    },
    {
      title: 'Pause Contest',
      buttonText: 'Pause Contest',
      buttonColor: 'bg-yellow-600 hover:bg-yellow-700',
      icon: <Pause size={20} />,
      description: 'Temporarily halt the voting process',
    },
    {
      title: 'End Contest',
      buttonText: 'End Contest',
      buttonColor: 'bg-red-600 hover:bg-red-700',
      icon: <Square size={20} />,
      description: 'Permanently stop the contest and finalize results',
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

  // Combine all contestants from all positions and take first 5, include position info
  const contestantDetails = Object.entries(positionData)
    .flatMap(([position, data]) =>
      data.contestants.map((contestant) => ({
        ...contestant,
        position,
      }))
    )
    .slice(0, 5);

  // Utility to get top candidate for a position
  function getTopCandidate(position) {
    if (!position || !position.contestants || !position.voters)
      return { name: 'N/A', votes: 0 };

    // Count votes for each contestant
    const voteCounts = {};
    position.voters.forEach((voter) => {
      if (voter.votedFor) {
        voteCounts[voter.votedFor] = (voteCounts[voter.votedFor] || 0) + 1;
      }
    });

    // Find contestant with max votes
    let top = { name: 'N/A', votes: 0 };
    position.contestants.forEach((contestant) => {
      const votes = voteCounts[contestant?._id] || 0;
      if (votes > top.votes) {
        top = { name: contestant?.name, votes };
      }
    });

    return top;
  }

  function formatDate(dateString) {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  }

  function getContestProgress(contest) {
    // Combine start date and time
    const startDate = new Date(contest.startDate);
    const endDate = new Date(contest.endDate);

    // If you have time fields, set hours/minutes
    if (contest.startTime) {
      let hour = parseInt(contest.startTime.startTimeHour, 10);
      if (contest.startTime.startTimeAmPm === 'PM' && hour < 12) hour += 12;
      startDate.setHours(
        hour,
        parseInt(contest.startTime.startTimeMinute, 10),
        0,
        0
      );
    }
    if (contest.endTime) {
      let hour = parseInt(contest.endTime.endTimeHour, 10);
      if (contest.endTime.endTimeAmPm === 'PM' && hour < 12) hour += 12;
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

  // Modified handleSectionAction to show confirmation popup
  const handleSectionAction = () => {
    setPendingAction(currentData.title);
    setIsActionConfirmOpen(true);
  };

  // Actual action handler after confirmation
  const handleConfirmedAction = async () => {
    if (!contest) return;
    let updatedFields = {};
    const now = new Date();

    // Helper to return midnight UTC ISO string
    const getUTCMidnightISO = (date) => {
      return new Date(
        Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate())
      ).toISOString();
    };

    if (currentData.title === 'Start Contest') {
      updatedFields = {
        startDate: getUTCMidnightISO(now), // "2025-08-24T00:00:00.000Z"
        startTime: {
          startTimeHour: now.getHours() % 12 || 12,
          startTimeMinute: now.getMinutes().toString().padStart(2, '0'),
          startTimeAmPm: now.getHours() >= 12 ? 'PM' : 'AM',
        },
        status: 'ongoing',
      };
    } else if (pendingAction === 'Pause Contest') {
      updatedFields = {
        status: 'pause',
      };
    } else if (currentData.title === 'End Contest') {
      updatedFields = {
        endDate: getUTCMidnightISO(now), // "2025-08-24T00:00:00.000Z"
        endTime: {
          endTimeHour: now.getHours() % 12 || 12,
          endTimeMinute: now.getMinutes().toString().padStart(2, '0'),
          endTimeAmPm: now.getHours() >= 12 ? 'PM' : 'AM',
        },
        status: 'completed',
      };
    }

    console.log(updatedFields);

    try {
      await axios.put(`/api/contest/${contest._id}/status`, updatedFields);
      setContest((prev) => ({ ...prev, ...updatedFields }));
      toast.success('Contest updated successfully!');
    } catch (err) {
      console.error('Failed to update contest:', err);
      toast.error('Failed to update contest!');
    }
    setIsActionConfirmOpen(false);
    setPendingAction(null);
  };

  // Flatten all contestants from all positions
  const allContestants =
    contest?.positions?.flatMap((pos) =>
      pos.contestants?.map((contestant) => ({
        ...contestant,
        position: pos.name,
      }))
    ) || [];

  useEffect(() => {
    if (!contest || contest.status === 'completed') return;

    // Build end datetime
    let endDate = new Date(contest.endDate); // already ISO midnight
    if (contest.endTime) {
      let hour = parseInt(contest.endTime.endTimeHour, 10);
      let minute = parseInt(contest.endTime.endTimeMinute, 10);

      if (contest.endTime.endTimeAmPm === 'PM' && hour < 12) hour += 12;
      if (contest.endTime.endTimeAmPm === 'AM' && hour === 12) hour = 0;

      endDate.setHours(hour, minute, 0, 0);
    }

    const checkIfEnded = async () => {
      const now = new Date();

      if (now >= endDate) {
        try {
          await axios.put(`/api/contest/${contest._id}/status`, {
            status: 'completed',
          });
          setContest((prev) => ({ ...prev, status: 'completed' }));
          console.log('Contest marked as completed automatically.');
        } catch (err) {
          console.error('Failed to update contest:', err);
        }
      }
    };

    // Check immediately and then every 2 minute
    checkIfEnded();
    const interval = setInterval(checkIfEnded, 120 * 1000);

    return () => clearInterval(interval);
  }, [contest]);

  const [votingLink, setVotingLink] = useState(
    `${window?.location?.origin}/vote/${contestId}`
  );

  // ✅ Total votes for a given position
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

  // ✅ Highest-voted contestant for a given position
  const getTopContestant = (pos, contest) => {
    if (!pos?.contestants || !contest)
      return { name: 'No Votes Yet', votes: 0 };

    const voteMap = {};

    if (contest.isClosedContest) {
      contest.closedContestVoters?.forEach((voter) => {
        const matches = voter.votedFor?.filter(
          (v) => v.positionTitle === pos.name
        );
        matches?.forEach((match) => {
          voteMap[match.votedFor] =
            (voteMap[match.votedFor] || 0) + (voter.multiplier || 1);
        });
      });
    } else {
      pos.voters?.forEach((v) => {
        if (v.votedFor) {
          voteMap[v.votedFor] =
            (voteMap[v.votedFor] || 0) + (v.multiplier || 1);
        }
      });
    }

    let top = { name: 'No Votes Yet', votes: 0 };
    pos.contestants.forEach((c) => {
      const votes = voteMap[c._id] || 0;
      if (votes > top.votes) top = { name: c.name, votes };
    });

    return top;
  };

  /* ---------------- Derived Counts ---------------- */
  // Overall top contestant across *all* positions
  const topContestant = useMemo(() => {
    if (!contest?.positions) return { name: 'No Votes Yet', votes: 0 };

    const counts = {};
    const names = {};

    contest.positions.forEach((p) =>
      p.contestants?.forEach((c) => (names[c._id] = c.name))
    );

    if (contest.isClosedContest) {
      contest.closedContestVoters?.forEach((voter) => {
        voter.votedFor?.forEach((vote) => {
          counts[vote.votedFor] =
            (counts[vote.votedFor] || 0) + (voter.multiplier || 1);
        });
      });
    } else {
      contest.positions.forEach((p) => {
        p.voters?.forEach((v) => {
          counts[v.votedFor] = (counts[v.votedFor] || 0) + (v.multiplier || 1);
        });
      });
    }

    let topId = null,
      max = 0;
    for (const [id, v] of Object.entries(counts)) {
      if (v > max) {
        max = v;
        topId = id;
      }
    }

    return topId
      ? { name: names[topId], votes: max }
      : { name: 'No Votes Yet', votes: 0 };
  }, [contest]);

  // Most competitive position
  const mostCompetitive = useMemo(() => {
    if (!contest?.positions?.length) return null;
    return contest.positions.reduce((a, b) =>
      getPositionTotalVotes(b, contest) > getPositionTotalVotes(a, contest)
        ? b
        : a
    );
  }, [contest]);

  // Total votes across the contest
  const totalVotes = useMemo(
    () =>
      contest?.positions?.reduce(
        (sum, p) => sum + getPositionTotalVotes(p, contest),
        0
      ) || 0,
    [contest]
  );

  const totalContestants =
    contest?.positions?.reduce(
      (sum, p) => sum + (p.contestants?.length || 0),
      0
    ) || 0;

  const avgParticipation = contest
    ? ((totalVotes / ((contest.positions?.length || 1) * 50)) * 100).toFixed(1)
    : 0;

  const calculateContestRevenue = (contest) => {
    const pricePerVote = contest.payment?.amount || 0;
    let votes = 0;

    if (!contest.payment?.isPaid) return 0; // Free contest

    if (contest.isClosedContest) {
      // Closed contest: sum all multipliers
      votes = contest.closedContestVoters?.reduce(
        (sum, voter) => sum + (voter.multiplier || 0),
        0
      );
    } else {
      // Open contest: pick highest multiplier per unique voter email
      const emailMap = {};
      contest.positions?.forEach((pos) => {
        pos.voters?.forEach((voter) => {
          if (
            !emailMap[voter.email] ||
            voter.multiplier > emailMap[voter.email]
          ) {
            emailMap[voter.email] = voter.multiplier || 0;
          }
        });
      });
      votes = Object.values(emailMap).reduce((sum, m) => sum + m, 0);
    }

    return votes * pricePerVote;
  };

  const hasSocialLinks = useMemo(() => {
    return Object.values(socialLinks).some((link) => link.length > 0);
  }, [socialLinks]);

  return (
    <div className='flex min-h-screen overflow-x-hidden lg:gap-[10rem]'>
      <Sidebar />
      <div className='flex-1 p-6 md:ml-20 '>
        {/* Header */}
        <h2 className='text-2xl sm:text-[30px] text-left font-bold text-gray-900 mb-6 sm:mb-8'>
          Contest
        </h2>

        <div className='relative mb-2 h-40 sm:h-48 lg:h-65'>
          <img
            src={contest?.coverImageUrl || BannerImage}
            alt='Contest Banner'
            className='w-full object-cover rounded-lg h-full absolute inset-0'
          />
        </div>

        {/* Main Header Content */}
        <div className='relative z-10 backdrop-blur-sm rounded-3xl p-4 sm:p-6 lg:p-8'>
          <div className='flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6'>
            {/* Left Section - Logo and Content */}
            <div className='flex flex-col sm:flex-row items-start sm:items-center gap-4 sm:gap-6'>
              {/* Logo */}
              <div className='h-16 w-16 sm:h-20 sm:w-20 lg:h-50 lg:w-50 rounded-full flex items-center justify-center border-4 border-black overflow-hidden flex-shrink-0'>
                <img
                  src={contest?.contestLogoImageUrl || LogoImage}
                  alt='Logo'
                  className='w-full h-full object-cover'
                />
              </div>

              {/* Content */}
              <div className='flex-1 min-w-0'>
                <h2 className='text-xl sm:text-2xl lg:text-[32px] text-left font-bold text-gray-900 mb-2'>
                  {contest?.title || 'Contest Name'}
                </h2>
                <p className='text-gray-600 text-left text-sm sm:text-base'>
                  {contest?.description || ''}
                </p>

                {hasSocialLinks && (
                  <div className='mt-4'>
                    <h3 className='text-sm font-semibold text-gray-700 mb-2'>
                      Organizer's Social Links
                    </h3>
                    <div className='flex flex-wrap items-center gap-4'>
                      {Object.keys(socialLinks).map((key, index) => {
                        const link = socialLinks[key];
                        if (link) {
                          let Icon;
                          let color;
                          switch (key) {
                            case 'instagram':
                              Icon = FaInstagram;
                              color = 'text-pink-500 hover:text-pink-600';
                              break;
                            case 'x':
                              Icon = FaXTwitter;
                              color = 'text-blue-500 hover:text-blue-600';
                              break;
                            case 'website':
                              Icon = FaGlobe;
                              color = 'text-gray-500 hover:text-gray-600';
                              break;
                            default:
                              return null;
                          }
                          return (
                            <a
                              key={index}
                              href={link}
                              target='_blank'
                              rel='noopener noreferrer'
                              className={`flex items-center gap-2 text-sm ${color}`}
                            >
                              <Icon size={22} />
                            </a>
                          );
                        }
                        return null;
                      })}
                    </div>
                  </div>
                )}

                {/* Stats */}
                <div className='flex flex-wrap items-center gap-4 sm:gap-6 lg:gap-8 mt-4'>
                  <div>
                    <span className='text-xl sm:text-2xl lg:text-3xl xl:text-4xl font-bold text-gray-900'>
                      {totalVotes || 0}
                    </span>
                    <span className='text-gray-600 ml-2 text-xs sm:text-sm'>
                      Total Votes
                    </span>
                  </div>
                  <div>
                    <span className='text-xl sm:text-2xl lg:text-3xl xl:text-4xl font-bold text-gray-900'>
                      {totalContestants || 0}
                    </span>
                    <span className='text-gray-600 ml-2 text-xs sm:text-sm'>
                      Contestant
                    </span>
                  </div>
                  <div>
                    {contest?.payment?.isPaid ? (
                      <Stat
                        label='Total Revenue'
                        value={new Intl.NumberFormat('en-NG', {
                          style: 'currency',
                          currency: 'NGN',
                          maximumFractionDigits: 0,
                        }).format(calculateContestRevenue(contest))}
                      />
                    ) : (
                      <Stat label='' value='Free Contest' />
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Right Section - Action Buttons */}
            <div className='flex flex-col sm:flex-row lg:flex-col gap-3 w-full sm:w-auto lg:min-w-fit'>
              <button
                onClick={() => navigate(`/edit-contest/${contestId}`)}
                className='flex items-center justify-center gap-2 px-4 py-2 border border-[#000000] rounded-lg hover:bg-teal-900 hover:text-white transition-colors text-sm font-medium'
              >
                <Edit size={16} />
                Edit Contest
              </button>
              <button
                className='flex items-center justify-center gap-2 px-4 py-2 border border-[#000000] rounded-lg hover:bg-teal-900 hover:text-white transition-colors text-sm font-medium'
                onClick={() => setIsVotersLinkOpen(true)}
              >
                <Share2 size={16} />
                Share Voters Link
              </button>

              {contest?.isClosedContest && (
                <button
                  className='flex items-center justify-center gap-2 px-4 py-2 border border-[#000000] rounded-lg hover:bg-teal-900 hover:text-white transition-colors text-sm font-medium'
                  onClick={() => {
                    setVotingLink(
                      `${window.location.origin}/voterregistration/${contestId}`
                    );
                    setIsVotersLinkOpen(true);
                  }}
                >
                  <Share2 size={16} />
                  Share Voters Registration Link
                </button>
              )}
            </div>
            <VotersLink
              open={isVotersLinkOpen}
              onClose={() => setIsVotersLinkOpen(false)}
              link={votingLink}
            />
          </div>

          <div className='grid grid-cols-1 xl:grid-cols-3 gap-6 lg:gap-8 mt-8 lg:mt-10'>
            {/* Left Column - Leaderboard and Voters */}
            <div className='xl:col-span-2 space-y-6 lg:space-y-8'>
              {/* Leaderboard */}
              <div className='bg-white/80 backdrop-blur-sm rounded-3xl border border-[#000000] p-4 sm:p-6 lg:p-8 shadow-xl'>
                {/* Header */}
                <div className='flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6 gap-4'>
                  <h2 className='text-lg sm:text-xl font-bold text-gray-900 flex items-center gap-2'>
                    <Trophy className='w-5 h-5 text-yellow-500' />
                    Leaderboard
                  </h2>
                  <button
                    onClick={() => navigate(`/leaderboards/${contestId}`)}
                    className='px-4 py-2 border border-gray-300 rounded-lg hover:bg-teal-900 hover:text-white transition-colors text-sm'
                  >
                    View Full Leaderboard
                  </button>
                </div>

                {/* Key Metrics Grid */}
                <div className='grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mb-6'>
                  <div className='bg-gradient-to-br from-blue-50 to-blue-100 p-3 sm:p-4 rounded-xl text-center'>
                    <div className='w-8 h-8 sm:w-10 sm:h-10 mx-auto mb-2 bg-blue-500 rounded-full flex items-center justify-center'>
                      <Users className='w-4 h-4 sm:w-5 sm:h-5 text-white' />
                    </div>
                    <p className='text-lg sm:text-2xl font-bold text-blue-700'>
                      {totalVotes || 0}
                    </p>
                    <p className='text-xs text-blue-600'>Total Votes</p>
                  </div>

                  <div className='bg-gradient-to-br from-green-50 to-green-100 p-3 sm:p-4 rounded-xl text-center'>
                    <div className='w-8 h-8 sm:w-10 sm:h-10 mx-auto mb-2 bg-green-500 rounded-full flex items-center justify-center'>
                      <Target className='w-4 h-4 sm:w-5 sm:h-5 text-white' />
                    </div>
                    <p className='text-lg sm:text-2xl font-bold text-green-700'>
                      {contest?.positions?.length || 0}
                    </p>
                    <p className='text-xs text-green-600'>Positions</p>
                  </div>

                  <div className='bg-gradient-to-br from-purple-50 to-purple-100 p-3 sm:p-4 rounded-xl text-center'>
                    <div className='w-8 h-8 sm:w-10 sm:h-10 mx-auto mb-2 bg-purple-500 rounded-full flex items-center justify-center'>
                      <TrendingUp className='w-4 h-4 sm:w-5 sm:h-5 text-white' />
                    </div>
                    <p className='text-lg sm:text-2xl font-bold text-purple-700'>
                      {avgParticipation || 0}%
                    </p>
                    <p className='text-xs text-purple-600'>Participation</p>
                  </div>

                  <div className='bg-gradient-to-br from-orange-50 to-orange-100 p-3 sm:p-4 rounded-xl text-center'>
                    <div className='w-8 h-8 sm:w-10 sm:h-10 mx-auto mb-2 bg-orange-500 rounded-full flex items-center justify-center'>
                      <Trophy className='w-4 h-4 sm:w-5 sm:h-5 text-white' />
                    </div>
                    <p className='text-lg sm:text-2xl font-bold text-orange-700'>
                      {contest ? getContestProgress(contest) : 0}%
                    </p>
                    <p className='text-xs text-orange-600'>Progress</p>
                  </div>
                </div>

                {/* 🔥 Top Performers Snapshot */}
                <div className='mb-6'>
                  <h3 className='text-base sm:text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2'>
                    <Crown className='w-5 h-5 text-yellow-500' />
                    Current Leaders by Position
                  </h3>

                  <div
                    className={`grid grid-cols-1 md:grid-cols-2 ${
                      (contest?.positions?.length || 0) > 2
                        ? 'lg:grid-cols-3'
                        : 'lg:grid-cols-2'
                    } gap-3`}
                  >
                    {contest?.positions?.slice(0, 3).map((position, index) => {
                      // === 🔹 1️⃣ Calculate each candidate's votes for THIS position ===
                      const leader = position.contestants
                        .map((candidate) => {
                          let votes = 0;

                          if (!contest.isClosedContest) {
                            // ✅ OPEN contest → count votes from position.voters array
                            votes =
                              position.voters?.reduce((total, voter) => {
                                return voter.votedFor?.toString() ===
                                  candidate._id?.toString()
                                  ? total + (voter.multiplier || 0)
                                  : total;
                              }, 0) || 0;
                          } else {
                            // ✅ CLOSED contest → count votes from contest.closedContestVoters
                            votes =
                              contest.closedContestVoters?.reduce(
                                (total, voter) => {
                                  // Each closedContest voter can vote for multiple positions
                                  const count =
                                    voter.votedFor?.filter(
                                      (v) =>
                                        v.positionTitle === position.name &&
                                        v.votedFor?.toString() ===
                                          candidate._id?.toString()
                                    ).length || 0;
                                  return (
                                    total + count * (voter.multiplier || 0)
                                  );
                                },
                                0
                              ) || 0;
                          }

                          return { ...candidate, totalVotes: votes };
                        })
                        // === 🔹 2️⃣ Pick the candidate with the highest votes ===
                        .sort((a, b) => b.totalVotes - a.totalVotes)?.[0];

                      // === 🔹 3️⃣ Total votes for the position (including multiplier) ===
                      const totalPositionVotes = !contest.isClosedContest
                        ? position.voters?.reduce(
                            (sum, v) => sum + (v.multiplier || 0),
                            0
                          ) || 0
                        : contest.closedContestVoters?.reduce((sum, v) => {
                            const count =
                              v.votedFor?.filter(
                                (vote) => vote.positionTitle === position.name
                              ).length || 0;
                            return sum + count * (v.multiplier || 0);
                          }, 0) || 0;

                      return (
                        <div
                          key={position._id}
                          className={`p-3 sm:p-4 rounded-xl cursor-pointer transition-all hover:shadow-md ${
                            index === 0
                              ? 'bg-gradient-to-r from-yellow-50 to-orange-50 border-2 border-yellow-200'
                              : index === 1
                              ? 'bg-gradient-to-r from-gray-50 to-slate-50 border-2 border-gray-200'
                              : 'bg-gradient-to-r from-amber-50 to-orange-50 border-2 border-amber-200'
                          }`}
                          onClick={() => setSelectedPositionData(position)}
                        >
                          <div className='flex items-center gap-3'>
                            {/* 🏆 Medal / Trophy Icon */}
                            <div
                              className={`w-7 h-7 sm:w-8 sm:h-8 rounded-full flex items-center justify-center ${
                                index === 0
                                  ? 'bg-yellow-500 text-white'
                                  : index === 1
                                  ? 'bg-gray-400 text-white'
                                  : 'bg-amber-600 text-white'
                              }`}
                            >
                              {index === 0 ? (
                                <Trophy className='w-3 h-3 sm:w-4 sm:h-4' />
                              ) : index === 1 ? (
                                <Medal className='w-3 h-3 sm:w-4 sm:h-4' />
                              ) : (
                                <Award className='w-3 h-3 sm:w-4 sm:h-4' />
                              )}
                            </div>

                            {/* 🏅 Position + Leader */}
                            <div className='flex-1 min-w-0'>
                              <p className='font-semibold text-gray-900 text-sm truncate'>
                                {position.name}
                              </p>
                              {leader ? (
                                <p className='text-xs text-gray-600 truncate'>
                                  Leader: {leader.name} ({leader.totalVotes}{' '}
                                  votes)
                                </p>
                              ) : (
                                <p className='text-xs text-gray-500'>
                                  No votes yet
                                </p>
                              )}
                            </div>

                            {/* 🗳 Total Votes for Position */}
                            <div className='text-right'>
                              <p className='font-bold text-gray-900'>
                                {totalPositionVotes}
                              </p>
                              <p className='text-xs text-gray-500'>votes</p>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Competition Highlights */}
                <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                  <div className='bg-gradient-to-r from-pink-50 to-rose-50 p-4 rounded-xl'>
                    <div className='flex items-center gap-3'>
                      <div className='w-10 h-10 bg-pink-500 rounded-full flex items-center justify-center'>
                        <Crown className='w-5 h-5 text-white' />
                      </div>
                      <div className='min-w-0 flex-1'>
                        <p className='text-sm text-pink-600 font-medium'>
                          Overall Leader
                        </p>
                        <p className='text-base sm:text-lg font-bold text-pink-800 truncate'>
                          {topContestant?.name}
                        </p>
                        <p className='text-xs text-pink-600'>
                          Leading {topContestant?.votes} votes
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className='bg-gradient-to-r from-teal-50 to-cyan-50 p-4 rounded-xl'>
                    <div className='flex items-center gap-3'>
                      <div className='w-10 h-10 bg-teal-500 rounded-full flex items-center justify-center'>
                        <TrendingUp className='w-5 h-5 text-white' />
                      </div>
                      <div className='min-w-0 flex-1'>
                        <p className='text-sm text-teal-600 font-medium'>
                          Most Competitive
                        </p>
                        <p className='text-base sm:text-lg font-bold text-teal-800 truncate'>
                          {mostCompetitive?.name || 'N/A'}
                        </p>
                        <p className='text-xs text-teal-600'>
                          {getPositionTotalVotes(mostCompetitive, contest)}{' '}
                          total votes
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Voters Details */}
              <div className='bg-white/80 backdrop-blur-sm border border-[#000000] rounded-3xl p-6 lg:p-8 shadow-xl'>
                <div className='flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6 gap-4'>
                  <h2 className='text-xl font-bold text-gray-900'>
                    Voters Details
                  </h2>
                  <button
                    onClick={() => navigate(`/voters-details/${contestId}`)}
                    className='px-4 py-2 border border-gray-300 rounded-lg hover:bg-teal-900 hover:text-white transition-colors self-start'
                  >
                    View Full Voters Details
                  </button>
                </div>

                <div className='overflow-x-auto'>
                  <table className='w-full'>
                    <thead>
                      <tr className='border-b border-gray-200'>
                        <th className='text-left py-3 text-gray-900 font-semibold'>
                          Voter Full Name
                        </th>
                        <th className='text-left py-3 text-gray-900 font-semibold'>
                          Voter Email
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {(() => {
                        let voterList = [];

                        if (contest?.isClosedContest) {
                          // Closed contest: already unique at top level
                          voterList = contest.closedContestVoters || [];
                        } else if (contest?.positions?.length) {
                          // Open contest: flatten voters and dedupe by email
                          const seen = new Map();
                          contest.positions.forEach((pos) => {
                            (pos.voters || []).forEach((v) => {
                              if (!seen.has(v.email)) {
                                seen.set(v.email, v); // keep first occurrence
                              }
                            });
                          });
                          voterList = Array.from(seen.values());
                        }

                        return voterList.length > 0 ? (
                          voterList.slice(0, 10).map((voter, idx) => (
                            <tr key={idx} className='border-b border-gray-100'>
                              <td className='py-3 text-left text-gray-700'>
                                {voter?.name}
                              </td>
                              <td className='py-3 text-left text-gray-700'>
                                {voter?.email}
                              </td>
                            </tr>
                          ))
                        ) : (
                          <tr>
                            <td
                              colSpan={2}
                              className='py-6 text-center text-gray-500'
                            >
                              No Voters Yet
                            </td>
                          </tr>
                        );
                      })()}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>

            {/* Right Column - Contest Info and Actions */}
            <div className='space-y-8'>
              {/* Contest Timing */}
              <div className='bg-white/80 w-80  backdrop-blur-sm border border-[#000000] rounded-3xl p-6 shadow-xl'>
                <div className='text-center'>
                  {(() => {
                    const startDate = new Date(contest?.startDate);
                    if (contest?.startTime) {
                      let hour = parseInt(contest.startTime.startTimeHour, 10);
                      if (contest.startTime.startTimeAmPm === 'PM' && hour < 12)
                        hour += 12;
                      if (
                        contest.startTime.startTimeAmPm === 'AM' &&
                        hour === 12
                      )
                        hour = 0;
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
                      if (contest.endTime.endTimeAmPm === 'PM' && hour < 12)
                        hour += 12;
                      if (contest.endTime.endTimeAmPm === 'AM' && hour === 12)
                        hour = 0;
                      endDate.setHours(
                        hour,
                        parseInt(contest.endTime.endTimeMinute, 10),
                        0,
                        0
                      );
                    }

                    const now = new Date();

                    // console.log(now, startDate, endDate, contest?.endTime);

                    // ✅ Contest paused
                    if (contest?.status === 'pause') {
                      return (
                        <>
                          <h3 className='text-lg font-bold text-gray-900 mb-2'>
                            Contest{' '}
                            <span className='text-orange-600 font-bold'>
                              Paused
                            </span>
                          </h3>
                        </>
                      );
                    }
                    // ✅ Contest completed or ended
                    else if (contest?.status === 'completed' || now > endDate) {
                      return (
                        <>
                          <h3 className='text-lg font-bold text-gray-900 mb-2'>
                            Contest{' '}
                            <span className='text-orange-600 font-bold'>
                              Ended
                            </span>
                          </h3>
                          <p className='text-xl font-semibold text-orange-600'>
                            Contest Ended
                          </p>
                        </>
                      );
                    }
                    // ✅ Contest not started yet
                    else if (now < startDate) {
                      return (
                        <>
                          <h3 className='text-lg font-bold text-gray-900 mb-2'>
                            Contest{' '}
                            <span className='text-orange-600 font-bold'>
                              Starts
                            </span>{' '}
                            In
                          </h3>
                          <p className='text-xl font-semibold text-orange-600'>
                            {countdown}
                          </p>
                        </>
                      );
                    }
                    // ✅ Contest ongoing
                    else {
                      return (
                        <>
                          <h3 className='text-lg font-bold text-gray-900 mb-2'>
                            Contest{' '}
                            <span className='text-orange-600 font-bold'>
                              Ends
                            </span>{' '}
                            In
                          </h3>
                          <p className='text-xl font-semibold text-orange-600'>
                            {countdown}
                          </p>
                        </>
                      );
                    }
                  })()}
                </div>
              </div>

              {/* Contestant Details */}
              <div className='bg-white/80 w-80 backdrop-blur-sm border border-[#000000] rounded-3xl p-6 shadow-xl'>
                <div className='flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6 gap-4'>
                  <h2 className='text-xl font-bold text-gray-900'>
                    Contestant
                  </h2>
                  <button
                    onClick={() => navigate(`/contestant/${contestId}`)}
                    className='px-4 py-2 border border-gray-300 rounded-lg hover:bg-teal-900 hover:text-white transition-colors self-start'
                  >
                    View All Contestants
                  </button>
                </div>

                <div className='space-y-3'>
                  {allContestants?.slice(0, 5).map((contestant, index) => (
                    <div
                      key={index}
                      className='flex items-center justify-between p-3 bg-gray-100 rounded-xl hover:bg-gray-200 transition-colors'
                    >
                      <div
                        onClick={() =>
                          navigate(
                            `/contestantdetails/${contestant?.position}/${contestant?._id}/${contestId}/`
                          )
                        }
                        className='flex items-center gap-3 cursor-pointer'
                      >
                        {contestant?.image ? (
                          <img
                            src={contestant?.image}
                            alt={contestant?.name}
                            className='w-10 h-10 rounded-full object-cover'
                          />
                        ) : (
                          <div className='w-10 h-10 bg-gradient-to-r from-orange-400 to-red-400 rounded-full flex items-center justify-center text-white'>
                            {contestant?.name.charAt(0)}
                          </div>
                        )}
                        <span className='font-medium text-gray-900'>
                          {contestant?.name}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* End Contest */}
              <div className='bg-white/80 w-80  backdrop-blur-sm border border-[#000000] rounded-3xl p-6 shadow-xl'>
                {/* Header with Navigation */}
                <div className='flex items-center justify-between mb-4'>
                  <button
                    onClick={prevSection}
                    className='p-2 rounded-full bg-gray-100 hover:bg-gray-200 transition-colors'
                  >
                    <ChevronLeft size={20} className='text-gray-600' />
                  </button>

                  <h3 className='text-lg font-bold text-gray-900 text-center flex-1'>
                    {currentData.title}
                  </h3>

                  <button
                    onClick={nextSection}
                    className='p-2 rounded-full bg-gray-100 hover:bg-gray-200 transition-colors'
                  >
                    <ChevronRight size={20} className='text-gray-600' />
                  </button>
                </div>

                {/* Description */}
                <p className='text-sm text-gray-600 text-center mb-6'>
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
                <ContestActionConfirm
                  open={isActionConfirmOpen}
                  onClose={() => setIsActionConfirmOpen(false)}
                  action={pendingAction}
                  onConfirm={handleConfirmedAction}
                />

                {/* Navigation Dots */}
                <div className='flex justify-center mt-4 gap-2'>
                  {sections.map((_, index) => (
                    <button
                      key={index}
                      onClick={() => goToSection(index)}
                      className={`w-3 h-3 rounded-full transition-colors ${
                        index === currentSection
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

/* ----- Small Reusable UI Helpers ----- */
const Stat = ({ label, value, icon, color }) => (
  <div className='text-center'>
    {icon && (
      <div
        className={`mx-auto mb-1 w-8 h-8 rounded-full bg-${color}-500 flex items-center justify-center text-white`}
      >
        {icon}
      </div>
    )}
    <p className='text-xl font-bold'>{value}</p>
    <p className={`text-${color || 'gray'}-600 text-sm`}>{label}</p>
  </div>
);

export default Contestdetails;
