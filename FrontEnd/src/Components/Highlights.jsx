import { useEffect, useState, useRef } from 'react';
import axios from 'axios';
import { TrendingUp, Clock, Flame, ChevronLeft, ChevronRight } from 'lucide-react';

const Highlights = ({ contestId }) => {
  const [highlights, setHighlights] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [countdown, setCountdown] = useState('');
  const [isContestLive, setIsContestLive] = useState(false);
  const previousContestData = useRef(null);
  const lastUpdateTime = useRef(new Date());
  const countdownInterval = useRef(null);
  const hasGeneratedPostContest = useRef(false);
  const cardRef = useRef(null);

  // Auto-advance to next highlight every 5 seconds
  useEffect(() => {
    if (highlights.length === 0) return;

    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % highlights.length);
    }, 10000);

    return () => clearInterval(interval);
  }, [highlights.length]);

  // Clear highlights after 1 hour of no new updates
  useEffect(() => {
    if (highlights.length === 0) return;

    const checkForStaleHighlights = () => {
      const now = new Date();
      const oneHourAgo = new Date(now.getTime() - 60 * 60 * 1000); // 1 hour ago

      // Check if the most recent highlight is older than 1 hour
      const mostRecentHighlight = highlights[0]; // Assuming highlights are sorted newest first
      if (mostRecentHighlight && mostRecentHighlight.timestamp < oneHourAgo) {
        // Clear all highlights and show "No new Highlights yet check back soon"
        setHighlights([{
          text: "All quiet for now. Check back in a bit for fresh highlights!",
          emoji: '⏳',
          gradient: 'from-gray-500 via-gray-600 to-gray-700',
          timestamp: now,
        }]);
        setCurrentIndex(0);
      }
    };

    // Check immediately on mount/update
    checkForStaleHighlights();

    const staleCheckInterval = setInterval(checkForStaleHighlights, 60 * 60 * 1000); // Check every hour

    return () => clearInterval(staleCheckInterval);
  }, [highlights]);

  const generateHighlights = (contest, previousData) => {
    const newHighlights = [];
    const now = new Date();

    // Check if contest has started
    const startDate = contest.startDate ? new Date(contest.startDate) : null;
    const hasStarted = !startDate || now >= startDate;

    // Check if contest has ended
    const endDate = new Date(contest.endDate);
    if (contest.endTime) {
      let hour = parseInt(contest.endTime.endTimeHour, 10);
      if (contest.endTime.endTimeAmPm === 'PM' && hour < 12) hour += 12;
      endDate.setHours(hour, parseInt(contest.endTime.endTimeMinute, 10), 0, 0);
    }
    const hasEnded = now >= endDate;

    if (hasEnded) {
      // Prevent generating post-contest highlights multiple times
      if (hasGeneratedPostContest.current) {
        return [];
      }

      hasGeneratedPostContest.current = true;

      // Post-contest highlights - broken into 6 slides for shorter text
      const startDateObj = startDate || endDate; // Fallback if no startDate
      const durationMs = endDate - startDateObj;
      const durationDays = Math.floor(durationMs / (1000 * 60 * 60 * 24));

      // Slide 1: Contest Ended Announcement
      newHighlights.push({
        text: `🏁 The contest ${contest.title} has officially ended!`,
        emoji: '🏁',
        gradient: 'from-red-500 via-orange-600 to-yellow-600',
        timestamp: now,
      });

      // Slide 2: Recap Intro
      newHighlights.push({
        text: `It's been an amazing run full of energy, talent, and excitement.\n\nLet's take a quick look back!`,
        emoji: '📊',
        gradient: 'from-blue-500 via-indigo-600 to-purple-600',
        timestamp: now,
      });

      // Slide 3: Contestants Count
      const totalContestants = contest.positions?.reduce((sum, p) => sum + (p.contestants?.length || 0), 0) || 0;
      newHighlights.push({
        text: `💫 ${totalContestants} contestants competed in this epic showdown!`,
        emoji: '💫',
        gradient: 'from-indigo-500 via-purple-600 to-pink-600',
        timestamp: now,
      });

      // Slide 4: Votes Cast
      const calculateTotalVotes = (contest) => {
        if (!contest) return 0;

        if (!contest.isClosedContest) {
          // ---- OPEN contest: sum multipliers from every position's voters
          return (
            contest.positions?.reduce((total, pos) => {
              const posVotes = pos.voters?.reduce(
                (sum, voter) => sum + (voter.multiplier || 0),
                0
              );
              return total + (posVotes || 0);
            }, 0) || 0
          );
        } else {
          // ---- CLOSED contest: count votedFor entries * multiplier
          return (
            contest.closedContestVoters?.reduce((total, voter) => {
              const count = voter.votedFor?.length || 0;
              return total + count * (voter.multiplier || 0);
            }, 0) || 0
          );
        }
      };

      const totalVotes = calculateTotalVotes(contest);
      newHighlights.push({
        text: `🗳️ ${totalVotes} votes were cast 🎉\n\nOver ${durationDays} day${durationDays !== 1 ? 's' : ''} of fierce competition!`,
        emoji: '🗳️',
        gradient: 'from-green-500 via-teal-600 to-blue-600',
        timestamp: now,
      });

      // Winners Announcement - one slide per position
      contest.positions.forEach((pos, index) => {
        const winner = pos.contestants?.[0]; // Assume top is winner
        if (winner) {
          const positionName = pos.name || `Position ${index + 1}`;
          newHighlights.push({
            text: ` ${positionName} Winner: ${winner.name}!`,
            emoji: '👑',
            gradient: 'from-yellow-500 via-gold-600 to-orange-600',
            timestamp: now,
          });
        }
      });

      // Slide 6: Audience Appreciation
      newHighlights.push({
        text: `🙌 Thank you for voting, sharing, and supporting!\n\nYour participation made this special.\n\nZee had a blast hosting 💜.`,
        emoji: '🙌',
        gradient: 'from-pink-500 via-purple-600 to-indigo-600',
        timestamp: now,
      });

      return newHighlights;
    }

    if (!hasStarted) {
      // Pre-contest highlights - condensed into 4 slides for shorter text
      const timeUntilStartMs = startDate - now;
      const hoursUntilStart = Math.floor(timeUntilStartMs / (1000 * 60 * 60));
      const minutesUntilStart = Math.floor((timeUntilStartMs % (1000 * 60 * 60)) / (1000 * 60));
      const countdownText = hoursUntilStart > 0 ? `${hoursUntilStart} hour${hoursUntilStart !== 1 ? 's' : ''}` : `${minutesUntilStart} minute${minutesUntilStart !== 1 ? 's' : ''}`;

      // Slide 1: Zee’s Introduction
      newHighlights.push({
        text: "👋 Hi, I'm Zee — your virtual host!\n\nI'll guide you through updates and highlights.\n\nLet's get ready for the excitement!",
        emoji: '👋',
        gradient: 'from-blue-500 via-purple-600 to-pink-600',
        timestamp: now,
      });

      // Slide 2: Contest Overview
      newHighlights.push({
        text: `🏆 Welcome to ${contest.title}!\n\n${contest.description || 'An exciting contest awaits.'}\n\nThe stage is set for an epic showdown!`,
        emoji: '🏆',
        gradient: 'from-yellow-500 via-orange-600 to-red-600',
        timestamp: now,
      });

      // Slide 3: Positions and Contestants
      const positions = contest.positions || [];
      const totalContestants = positions.reduce((sum, p) => sum + (p.contestants?.length || 0), 0);
      newHighlights.push({
        text: `🎯 ${positions.length} positions available!\n\n💫 ${totalContestants} contestants ready to compete.\n\nWho will claim victory?`,
        emoji: '🎯',
        gradient: 'from-green-500 via-teal-600 to-blue-600',
        timestamp: now,
      });

      // Slide 4: Voting Info and Countdown
      const isPaid = contest.votePrice && contest.votePrice > 0;
      newHighlights.push({
        text: `🗳️ Voting is ${isPaid ? 'paid' : 'free'}.\n\n⏰ Starts in ${countdownText}.\n\nStay tuned for live updates! 🔥`,
        emoji: '🗳️',
        gradient: 'from-red-500 via-pink-600 to-purple-600',
        timestamp: now,
      });

      return newHighlights;
    }

    // Live contest logic
    const liveEndDate = new Date(contest.endDate);
    if (contest.endTime) {
      let hour = parseInt(contest.endTime.endTimeHour, 10);
      if (contest.endTime.endTimeAmPm === 'PM' && hour < 12) hour += 12;
      liveEndDate.setHours(hour, parseInt(contest.endTime.endTimeMinute, 10), 0, 0);
    }
    const timeLeftMs = liveEndDate - now;
    const hoursLeft = Math.floor(timeLeftMs / (1000 * 60 * 60));
    const isNearEnd = hoursLeft <= 2;

    // If no previous data (first load), generate initial highlights based on current standings
    if (!previousData) {
      // Total votes across all positions
      let totalVotes = 0;
      contest.positions.forEach(pos => {
        pos.contestants.forEach(contestant => {
          totalVotes += contestant.totalVotes;
        });
      });

      if (totalVotes > 0) {
        newHighlights.push({
          text: `🗳️ Over ${totalVotes} votes cast so far — the competition is heating up!`,
          emoji: '🗳️',
          gradient: 'from-indigo-500 via-indigo-600 to-purple-600',
          timestamp: now,
        });
      }

      // Top contestants across positions
      const allContestants = [];
      contest.positions.forEach((pos, posIndex) => {
        const positionName = pos.name || `Position ${posIndex + 1}`;
        pos.contestants.forEach((contestant, index) => {
          allContestants.push({ ...contestant, position: positionName, rank: index + 1 });
        });
      });
      allContestants.sort((a, b) => (b.totalVotes || 0) - (a.totalVotes || 0));
      const top3 = allContestants.slice(0, 3);
      top3.forEach((contestant, index) => {
        const ordinal = index === 0 ? '1st' : index === 1 ? '2nd' : '3rd';
        const voteText = contestant.totalVotes ? ` with ${contestant.totalVotes} votes!` : '!';
        newHighlights.push({
          text: ` ${contestant.name}  from ${contestant.position} is ranking high in the polls ${voteText}`,
          emoji: '🥇',
          gradient: 'from-yellow-500 via-yellow-600 to-orange-600',
          timestamp: now,
        });
      });

      // Time left
      if (hoursLeft > 0 || Math.floor((timeLeftMs % (1000 * 60 * 60)) / (1000 * 60)) > 0) {
        const minutesLeft = Math.floor((timeLeftMs % (1000 * 60 * 60)) / (1000 * 60));
        const timeText = hoursLeft > 0 ? `${hoursLeft} hour${hoursLeft !== 1 ? 's' : ''}` : `${minutesLeft} minute${minutesLeft !== 1 ? 's' : ''}`;
        newHighlights.push({
          text: `${timeText} left before this contest closes — vote now!`,
          emoji: '⏳',
          gradient: 'from-gray-500 via-gray-600 to-gray-700',
          timestamp: now,
        });
      }

      // Current leaders in each position
      contest.positions.forEach((pos, posIndex) => {
        if (pos.contestants.length > 0) {
          const leader = pos.contestants[0];
          const positionName = pos.name || `Position ${posIndex + 1}`;
          newHighlights.push({
            text: ` ${leader.name} is leading ${positionName}`,
            emoji: '👑',
            gradient: 'from-yellow-500 via-yellow-600 to-orange-600',
            timestamp: now,
          });
        }
      });

      return newHighlights;
    }

    // Change-based highlights for subsequent fetches
    contest.positions.forEach((pos, posIndex) => {
      const prevPos = previousData.positions?.find(p => p.positionIndex === posIndex);
      const prevContestants = prevPos?.contestants || [];
      const positionName = pos.name || `Position ${posIndex + 1}`;

      pos.contestants.forEach((contestant, contestantIndex) => {
        const prevContestant = prevContestants.find(c => c._id === contestant._id);
        const currentRank = contestantIndex + 1;
        const prevRank = prevContestant ? prevContestant.rank : currentRank;
        const rankChange = prevRank - currentRank;
        const voteChange = prevContestant ? contestant.totalVotes - prevContestant.totalVotes : 0;

        if (rankChange > 0) {
          newHighlights.push({
            text: ` ${contestant.name} from ${positionName} just jumped from ${prevRank}${getOrdinalSuffix(prevRank)} to ${currentRank}${getOrdinalSuffix(currentRank)} — her fans are waking up!`,
            emoji: '🔥',
            gradient: 'from-red-500 via-pink-600 to-purple-600',
            timestamp: now,
          });
        } else if (rankChange < 0) {
          newHighlights.push({
            text: ` ${contestant.name} from ${positionName} slipped ${Math.abs(rankChange)} spot${Math.abs(rankChange) !== 1 ? 's' : ''} — can her crew rally back?`,
            emoji: '😮',
            gradient: 'from-gray-500 via-gray-600 to-gray-700',
            timestamp: now,
          });
        }

        if (voteChange > 50) {
          newHighlights.push({
            text: ` ${contestant.name} from ${positionName} gained ${voteChange} votes in 20 minutes — insane momentum!`,
            emoji: '⚡',
            gradient: 'from-yellow-500 via-orange-600 to-red-600',
            timestamp: now,
          });
        } else if (voteChange === 0 && prevContestant) {
          newHighlights.push({
            text: ` ${contestant.name} from ${positionName} is quiet this round — what's going on?`,
            emoji: '🧊',
            gradient: 'from-blue-500 via-blue-600 to-cyan-600',
            timestamp: now,
          });
        }

        if (rankChange > 1) {
          newHighlights.push({
            text: ` ${contestant.name} from ${positionName} is back in the top after losing ground earlier!`,
            emoji: '🧨',
            gradient: 'from-orange-500 via-red-600 to-pink-600',
            timestamp: now,
          });
        }
      });

      if (pos.contestants.length >= 2) {
        const top = pos.contestants[0];
        const second = pos.contestants[1];
        if (top.totalVotes > second.totalVotes + 100) {
          newHighlights.push({
            text: ` ${top.name} from ${positionName} is comfortably leading — it's her game to lose.`,
            emoji: '👑',
            gradient: 'from-yellow-500 via-yellow-600 to-orange-600',
            timestamp: now,
          });
        }
      }

      if (pos.contestants.length >= 3) {
        const second = pos.contestants[1];
        const third = pos.contestants[2];
        const gap = second.totalVotes - third.totalVotes;
        if (gap < 10 && gap > 0) {
          newHighlights.push({
            text: ` Only ${gap} vote${gap !== 1 ? 's' : ''} separate 2nd and 3rd in ${positionName} — this is heating up!`,
            emoji: '💥',
            gradient: 'from-red-500 via-orange-600 to-yellow-600',
            timestamp: now,
          });
        }
      }

      if (isNearEnd) {
        const surging = pos.contestants.find(c => {
          const prev = prevContestants.find(p => p._id === c._id);
          return prev && (c.rank < prev.rank || c.totalVotes > prev.totalVotes + 20);
        });
        if (surging) {
          newHighlights.push({
            text: ` Just ${hoursLeft} hour${hoursLeft !== 1 ? 's' : ''} to go — ${surging.name} from ${positionName} is closing in hard!`,
            emoji: '⏳',
            gradient: 'from-gray-500 via-gray-600 to-gray-700',
            timestamp: now,
          });
        }
      }
    });

    return newHighlights;
  };

  const getOrdinalSuffix = (num) => {
    const j = num % 10;
    const k = num % 100;
    if (j === 1 && k !== 11) return 'st';
    if (j === 2 && k !== 12) return 'nd';
    if (j === 3 && k !== 13) return 'rd';
    return 'th';
  };

  useEffect(() => {
    const fetchHighlights = async () => {
      try {
        const res = await axios.get(`/api/contest/${contestId}`);
        const contest = res.data.contest;

        const newHighlights = generateHighlights(contest, previousContestData.current);

        // Update highlights: add new ones and filter out old ones (>30 minutes)
        setHighlights(prevHighlights => {
          const now = new Date();
          const thirtyMinutesAgo = new Date(now.getTime() - 30 * 60 * 1000);
          const filteredOld = prevHighlights.filter(h => h.timestamp > thirtyMinutesAgo);
          const combined = [...filteredOld, ...newHighlights];
          // Sort by timestamp descending (newest first)
          combined.sort((a, b) => b.timestamp - a.timestamp);
          return combined;
        });

        // Update last update time when we get new highlights
        if (newHighlights.length > 0) {
          lastUpdateTime.current = new Date();
        }

        // Store current data for next comparison
        previousContestData.current = {
          positions: contest.positions.map((pos, posIndex) => ({
            positionIndex: posIndex,
            contestants: pos.contestants.map((contestant, contestantIndex) => ({
              _id: contestant._id,
              rank: contestantIndex + 1,
              totalVotes: contestant.totalVotes,
            })),
          })),
        };

        setLoading(false);
      } catch (err) {
        console.error('Failed to fetch highlights:', err);
        setLoading(false);
      }
    };

    fetchHighlights();

    // Update every 20 minutes
    const interval = setInterval(fetchHighlights, 20 * 60 * 1000);

    return () => clearInterval(interval);
  }, [contestId]);



  const goToNext = () => {
    setCurrentIndex((prev) => (prev + 1) % highlights.length);
  };

  const goToPrev = () => {
    setCurrentIndex((prev) => (prev - 1 + highlights.length) % highlights.length);
  };

  const handleTap = (e) => {
    if (window.innerWidth >= 768) return; // Only for mobile

    const rect = cardRef.current.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const cardWidth = rect.width;

    if (clickX < cardWidth / 2) {
      goToPrev();
    } else {
      goToNext();
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-purple-500 border-t-transparent"></div>
      </div>
    );
  }

  if (highlights.length === 0) {
    return (
      <div className="text-center py-8 text-gray-400">
        <p>No highlights available at the moment.</p>
      </div>
    );
  }

  const currentHighlight = highlights[currentIndex];

  return (
    <div className="relative">
      {/* Navigation buttons outside the story card - hidden on mobile */}
      {currentIndex > 0 && (
        <button
          onClick={goToPrev}
          className="hidden md:block absolute left-4 top-1/2 -translate-y-1/2 w-16 h-16 rounded-full bg-white bg-opacity-20 backdrop-blur-sm flex items-center justify-center hover:bg-opacity-30 transition-all z-10"
        >
          <ChevronLeft className="text-[#e67347]" size={32} />
        </button>
      )}


      {currentIndex < highlights.length - 1 && (
        <button
          onClick={goToNext}
          className="hidden md:block absolute right-4 top-1/2 -translate-y-1/2 w-16 h-16 rounded-full bg-white bg-opacity-20 backdrop-blur-sm flex items-center justify-center hover:bg-opacity-30 transition-all z-10"
        >
          <ChevronRight className="text-[#e67347]" size={32} />
        </button>
      )}

      {/* Story card */}
      <div
        ref={cardRef}
        onClick={handleTap}
        className={`relative rounded-3xl  overflow-hidden bg-gradient-to-br ${currentHighlight.gradient} mx-auto`}
        style={{
          aspectRatio: '9/16',
          maxHeight: '500px',
        }}
      >

        {/* Animated background pattern */}
        <div className="absolute inset-0 opacity-10">
          <div
            className="absolute inset-0"
            style={{
              backgroundImage: 'radial-gradient(circle at 20% 50%, white 1px, transparent 1px), radial-gradient(circle at 80% 80%, white 1px, transparent 1px)',
              backgroundSize: '50px 50px',
              animation: 'float 20s linear infinite'
            }}
          />
        </div>

        {/* Content */}
        <div className="relative h-full flex flex-col items-center justify-center p-8 text-white">
          {/* Emoji/Icon */}
          <div
            className="mb-6 text-[40px]"
            style={{
              animation: 'bounce 2s ease-in-out infinite'
            }}
          >
            {currentHighlight.emoji}
          </div>

          {/* Text */}
          <p className="text-[25px] font-bold mb-20 text-center leading-relaxed drop-shadow-lg px-4">
            {currentHighlight.text}
          </p>

          {/* Decorative elements */}
          <div className="absolute top-8 right-8 w-16 h-16 rounded-full bg-white opacity-10 animate-pulse"/>
          <div
            className="absolute bottom-8 left-8 w-24 h-24 rounded-full bg-white opacity-5 animate-pulse"
            style={{ animationDelay: '1s' }}
          />
        </div>

        {/* Story counter */}
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 px-4 py-2 rounded-full bg-black bg-opacity-30 backdrop-blur-sm">
          <span className="text-white text-sm font-semibold">
            {currentIndex + 1} / {highlights.length}
          </span>
        </div>
      </div>

      <style jsx>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-20px); }
        }
        @keyframes bounce {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-20px); }
        }
      `}</style>
    </div>
  );
};

export default Highlights;
