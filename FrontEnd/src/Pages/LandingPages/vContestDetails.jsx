import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
  ChevronLeft,
  Users,
  Vote,
  UserCheck,
  Trophy,
  DollarSign,
  Bot,
} from 'lucide-react';
import { FaInstagram, FaGlobe } from 'react-icons/fa';
import { FaXTwitter } from 'react-icons/fa6';
import VotingPositionsSection from '../../Components/LandingPageComp/contest/VotingPosition';
import CandidatesSection from '../../Components/LandingPageComp/contest/CandidateSection';
import axios from 'axios';
import FullPageLoader from '../../Components/FullPageLoader';
import ZeePopup from '../../Components/ZeePopup';

const MAX_CHARS = 100;

const ContestDetailPage = () => {
  const { contestId } = useParams();
  const [contest, setContest] = useState(null);
  const [countdown, setCountdown] = useState('');
  const [isExpanded, setIsExpanded] = useState(false);
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [isZeeOpen, setIsZeeOpen] = useState(false);
  const [speechText, setSpeechText] = useState('');

  const speechTexts = [
    "👋 Hey there! Zee's got some hot updates 🔥",
    "💫 Tap me: I've got something cool to show you!",
    "🎉 Wanna see what's trending right now?",
    "⚡ The contest is heating up come check it out!",
    "👀 Zee's watching the votes live tap to peek!",
    "💥 New highlights just dropped let's go!",
    "✨ Zee's got fresh vibes for you click me!"
  ];

  useEffect(() => {
    // Set initial random text
    setSpeechText(speechTexts[Math.floor(Math.random() * speechTexts.length)]);

    // Change text every 5 minutes
    const interval = setInterval(() => {
      setSpeechText(speechTexts[Math.floor(Math.random() * speechTexts.length)]);
    }, 5 * 60 * 1000);

    return () => clearInterval(interval);
  }, []);

  // Simulated contest start and end date/time for countdown
  // These should be replaced with actual values from backend or global state
  useEffect(() => {
    if (!contest) return;

    // Build start date/time
    const startDate = new Date(contest?.startDate);
    if (contest?.startTime) {
      let hour = parseInt(contest?.startTime.startTimeHour, 10);
      if (contest?.startTime.startTimeAmPm === 'PM' && hour < 12) hour += 12;
      startDate.setHours(
        hour,
        parseInt(contest?.startTime.startTimeMinute, 10),
        0,
        0
      );
    }

    // Build end date/time
    const endDate = new Date(contest?.endDate);
    if (contest?.endTime) {
      let hour = parseInt(contest?.endTime.endTimeHour, 10);
      if (contest?.endTime.endTimeAmPm === 'PM' && hour < 12) hour += 12;
      endDate.setHours(
        hour,
        parseInt(contest?.endTime.endTimeMinute, 10),
        0,
        0
      );
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

  // console.log(contest);

  useEffect(() => {
    const fetchContest = async () => {
      try {
        const res = await axios.get(`/api/contest/${contestId}`);
        console.log(res);
        setContest(res.data.contest);
        setActivePosition(res.data.contest?.positions[0]?.name);
        setLoading(false);
      } catch (err) {
        console.error('Failed to fetch contest:', err);
        setLoading(false);
      }
    };
    if (contestId) fetchContest();
  }, [contestId]);

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

  const [activePosition, setActivePosition] = useState(
    contest?.positions[0]?.name
  );

  const [selectedCandidate, setSelectedCandidate] = useState(null);

  const allContestants =
    contest?.positions?.flatMap((pos) =>
      pos.contestants?.map((contestant) => ({
        ...contestant,
        position: pos?.name,
      }))
    ) || [];

  // const allVotes =
  //   contest?.positions?.flatMap((pos) =>
  //     pos.voters?.map((voter) => ({
  //       ...voter,
  //     }))
  //   ) || [];

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

  const totalContestants = allContestants.length;

  const stats = [
    {
      icon: Users,
      label: 'Total Votes',
      value: totalVotes,
      bgColor: 'bg-gray-100',
    },
    {
      icon: UserCheck,
      label: 'Total Contestants',
      value: totalContestants,
      bgColor: 'bg-gray-100',
    },
    {
      icon: Trophy,
      label: 'Positions',
      value: contest?.positions?.length,
      bgColor: 'bg-gray-100',
    },
    {
      icon: DollarSign,
      label: 'Amount Per Vote',
      value: contest?.payment?.isPaid ? `₦${contest?.payment?.amount}` : 'Free',
      bgColor: 'bg-gray-100',
    },
  ];

  const handlePositionChange = (newPosition) => {
    setActivePosition(newPosition);
    setSelectedCandidate(null);
  };

  const handleCandidateSelect = (candidate) => {
    setSelectedCandidate(candidate);
  };

  // --- TRUNCATION LOGIC ---
  const description = contest?.description || '';
  const isLong = description.length > MAX_CHARS;

  const displayDescription =
    isExpanded || !isLong
      ? description
      : `${description.substring(0, MAX_CHARS).trim()}...`;

  const toggleExpansion = () => {
    setIsExpanded(!isExpanded);
  };

  if (loading) {
    return <FullPageLoader />;
  }

  return (
    <>
      <div className='min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50'>
        {/* Header with Glass Effect */}
        <div className='sticky top-0 z-50 backdrop-blur-xl bg-white/80 border-b border-gray-200/50 shadow-sm'>
          <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4'>
            <div className='flex items-center gap-4'>
              <button
                className='p-2 hover:bg-gray-100 rounded-xl transition-all duration-200 hover:scale-105 active:scale-95'
                onClick={() => navigate(-1)}
              >
                <ChevronLeft className='w-6 h-6 text-gray-900' />
              </button>
              <h3 className='text-xl sm:text-2xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent'>
                {contest?.title}
              </h3>
            </div>
          </div>
        </div>

        {/* Hero Section with Gradient Overlay */}
        <div className='relative h-72 sm:h-96'>
          <div className='absolute inset-0 bg-gradient-to-b from-transparent via-black/20 to-black/60 z-10' />
          <img
            src={contest?.coverImageUrl}
            alt={contest?.title}
            className='absolute inset-0 w-full h-full object-cover'
          />

          {/* Floating Contest Logo */}
          <div className='absolute bottom-0 left-1/2 transform -translate-x-1/2 translate-y-1/2 z-50'>
            <div className='relative group'>
              <div className='absolute inset-0 bg-gradient-to-r from-purple-600 to-blue-600 rounded-full blur-xl opacity-75 group-hover:opacity-100 transition-opacity duration-300 animate-pulse' />
              <div className='relative w-32 h-32 sm:w-40 sm:h-40 rounded-full border-4 border-white shadow-2xl overflow-hidden bg-white'>
                <img
                  src={contest?.contestLogoImageUrl}
                  alt={contest?.title}
                  className='w-full h-full object-cover'
                />
              </div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-12'>
          {/* Title & Description Section */}
          <div className='text-center mb-12'>
            <h2 className='text-xl sm:text-2xl lg:text-3xl font-bold mb-4 bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 bg-clip-text text-transparent'>
              {contest?.title}
            </h2>
            <p className='text-gray-600 text-base sm:text-lg max-w-3xl mx-auto leading-relaxed'>
              {displayDescription}
            </p>
            {isLong && (
              <button
                onClick={toggleExpansion}
                className='mt-3 text-sm font-semibold text-purple-600 hover:text-purple-700 transition-colors'
              >
                {isExpanded ? '↑ Show Less' : '↓ Read More'}
              </button>
            )}

            {/* Social Links */}
            {contest?.socialLinks && (
              <div className='flex justify-center gap-4 mt-6'>
                {contest.socialLinks.instagram && (
                  <a
                    href={contest.socialLinks.instagram}
                    target='_blank'
                    rel='noopener noreferrer'
                    className='p-3 bg-gradient-to-br from-pink-500 to-purple-600 text-white rounded-xl hover:scale-110 transition-transform duration-200 shadow-lg hover:shadow-xl'
                  >
                    <FaInstagram size={20} />
                  </a>
                )}
                {contest.socialLinks.x && (
                  <a
                    href={contest.socialLinks.x}
                    target='_blank'
                    rel='noopener noreferrer'
                    className='p-3 bg-gradient-to-br from-blue-500 to-blue-600 text-white rounded-xl hover:scale-110 transition-transform duration-200 shadow-lg hover:shadow-xl'
                  >
                    <FaXTwitter size={20} />
                  </a>
                )}
                {contest.socialLinks.website && (
                  <a
                    href={contest.socialLinks.website}
                    target='_blank'
                    rel='noopener noreferrer'
                    className='p-3 bg-gradient-to-br from-gray-700 to-gray-800 text-white rounded-xl hover:scale-110 transition-transform duration-200 shadow-lg hover:shadow-xl'
                  >
                    <FaGlobe size={20} />
                  </a>
                )}
              </div>
            )}
          </div>

          {/* Countdown & CTA Card */}
          <div className='max-w-2xl mx-auto mb-12'>
            <div className='relative group'>
              <div className='absolute inset-0 bg-gradient-to-r from-green-400 via-emerald-500 to-teal-500 rounded-2xl blur-xl opacity-50 group-hover:opacity-75 transition-opacity duration-300' />
              <div className='relative bg-gradient-to-r from-emerald-500 to-teal-600 rounded-2xl p-8 shadow-2xl'>
                <div className='text-center text-white mb-6'>
                  {(() => {
                    const startDate = new Date(contest?.startDate);
                    if (contest?.startTime) {
                      let hour = parseInt(contest.startTime.startTimeHour, 10);
                      if (contest.startTime.startTimeAmPm === 'PM' && hour < 12)
                        hour += 12;
                      if (contest.startTime.startTimeAmPm === 'AM' && hour === 12)
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

                    if (contest?.status === 'pause') {
                      return (
                        <>
                          <h3 className='text-lg font-semibold mb-2 opacity-90'>Contest Status</h3>
                          <p className='text-3xl sm:text-4xl font-bold tracking-tight'>Paused</p>
                        </>
                      );
                    } else if (contest?.status === 'completed' || now > endDate) {
                      return (
                        <>
                          <h3 className='text-lg font-semibold mb-2 opacity-90'>Contest Status</h3>
                          <p className='text-3xl sm:text-4xl font-bold tracking-tight'>Ended</p>
                        </>
                      );
                    } else if (now < startDate) {
                      return (
                        <>
                          <h3 className='text-lg font-semibold mb-2 opacity-90'>Contest Starts In</h3>
                          <p className='text-3xl sm:text-4xl font-bold tracking-tight'>{countdown}</p>
                        </>
                      );
                    } else {
                      return (
                        <>
                          <h3 className='text-lg font-semibold mb-2 opacity-90'>Contest Ends In</h3>
                          <p className='text-3xl sm:text-4xl font-bold tracking-tight'>{countdown}</p>
                        </>
                      );
                    }
                  })()}
                </div>
                <button
                  className='w-full bg-white text-emerald-600 px-8 py-4 rounded-xl font-bold text-lg transition-all duration-200 hover:scale-105 hover:shadow-2xl active:scale-95 flex items-center justify-center gap-3 group'
                  onClick={() => navigate(`/vote/${contestId}`)}
                >
                  <Vote className='w-6 h-6 group-hover:rotate-12 transition-transform duration-200' />
                  Cast Your Vote Now
                </button>
              </div>
            </div>
          </div>

          {/* Stats Grid with Modern Cards */}
          <div className='grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-16'>
            {stats.map((stat, index) => (
              <div
                key={index}
                className='group relative overflow-hidden bg-white rounded-2xl p-6 shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-1 border border-gray-100'
              >
                <div className='absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-gray-50 to-transparent rounded-full -mr-16 -mt-16 opacity-50' />
                <div className='relative'>
                  <div className={`${stat.bgColor} w-14 h-14 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300`}>
                    <stat.icon className='w-7 h-7 text-gray-600' />
                  </div>
                  <div className='text-sm text-gray-500 font-medium mb-1'>{stat.label}</div>
                  <div className='text-3xl font-bold text-gray-900'>{stat.value}</div>
                </div>
              </div>
            ))}
          </div>

          <VotingPositionsSection
            activePosition={activePosition}
            onPositionChange={handlePositionChange}
            contest={contest}
          />
          <CandidatesSection
            activePosition={activePosition}
            selectedCandidate={selectedCandidate}
            onCandidateSelect={handleCandidateSelect}
            contest={contest}
          />
        </div>
      </div>


      {/* Zee Floating Icon */}
      <div className="fixed bottom-8 right-6 z-50 flex flex-col items-end">
        {/* Speech Bubble */}
        <div className="relative mb-2">
          <div className="bg-[#ffffff]/50 text-gray-800 px-4 py-2 rounded-lg shadow-lg max-w-xs text-sm font-medium border border-gray-200">
            {speechText}
          </div>
          {/* Speech bubble pointer */}
          <div className="absolute top-full right-6 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-white"></div>
        </div>

        {/* Button */}
        <button
          onClick={() => setIsZeeOpen(true)}
          className="flex items-center gap-6 bg-[#034045] hover:bg-[#011F21] text-white p-4 rounded-full shadow-xl hover:shadow-2xl transition-all duration-300"
          title="I am Zee"
        >
          <Bot size={24} />
          <span className="text-lg font-bold">Zee</span>
        </button>
      </div>

      <ZeePopup
        isOpen={isZeeOpen}
        onClose={() => setIsZeeOpen(false)}
        contestId={contestId}
      />
    </>
  );
};

export default ContestDetailPage;
