import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
  ChevronLeft,
  Users,
  UserCheck,
  Trophy,
  DollarSign,
} from 'lucide-react';
import VotingPositionsSection from '../../Components/LandingPageComp/contest/VotingPosition';
import CandidatesSection from '../../Components/LandingPageComp/contest/CandidateSection';
import axios from 'axios';

const MAX_CHARS = 100;

const ContestDetailPage = () => {
  const { contestId } = useParams();
  const [contest, setContest] = useState(null);
  const [countdown, setCountdown] = useState('');
  const [isExpanded, setIsExpanded] = useState(false);
  const navigate = useNavigate();

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
      } catch (err) {
        console.error('Failed to fetch contest:', err);
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

  return (
    <>
      <div className='min-h-screen bg-white'>
        <div className='bg-white'>
          <div className='pl-4 md:pl-30 mx-auto px-4 py-4'>
            <div className='flex items-center gap-4'>
              <button
                className='p-2 hover:bg-gray-100 rounded-lg transition-colors'
                onClick={() => navigate(-1)}
              >
                <ChevronLeft className='w-8 h-8 text-gray-900' />
              </button>
              <p className='text-2xl font-bold text-gray-900'>
                {contest?.title}
              </p>
            </div>
          </div>
        </div>

        <div className='bg-black mb-4 md:mb-8 relative overflow-hidden'>
          <div className='h-64 md:h-80 flex items-center justify-center'>
            <img
              src={contest?.coverImageUrl}
              alt={contest?.title}
              className='absolute inset-0 w-full h-full object-cover'
            />
          </div>
        </div>

        <div className='mx-auto px-4 md:px-30 py-4 md:py-8'>
          <div className='grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8'>
            <div className='lg:col-span-2 flex gap-6 items-center justify-center'>
              <div>
                <div className='w-32 h-32 bg-black rounded-full border-4 border-[#034045] flex items-center justify-center relative'>
                  <img
                    src={contest?.contestLogoImageUrl}
                    alt={contest?.title}
                    className='absolute inset-0 w-full h-full object-cover rounded-full'
                  />
                </div>
              </div>

              <div className='flex-grow'>
                <h2 className='text-2xl md:text-3xl font-bold text-gray-900 mb-2'>
                  {contest?.title}
                </h2>
                <p className='text-gray-600 text-lg'>{displayDescription}</p>

                {isLong && (
                  <p
                    onClick={toggleExpansion}
                    className='text-sm font-semibold text-[#034045] hover:text-[#011F21] underline transition-colors focus:outline-none'
                  >
                    {isExpanded ? 'Show Less' : 'Read More'}
                  </p>
                )}
              </div>
            </div>

            <div className='space-y-4'>
              <div className='bg-[#00B25F] text-white px-6 py-3 rounded-lg text-center font-medium'>
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

                  // ✅ Contest paused
                  if (contest?.status === 'pause') {
                    return (
                      <>
                        <div className='text-sm'>Contest Paused</div>
                      </>
                    );
                  }
                  // ✅ Contest completed or ended
                  else if (contest?.status === 'completed' || now > endDate) {
                    return (
                      <>
                        <h3 className='text-lg font-bold text-white mb-2'>
                          Completed
                        </h3>
                        <p className='text-xl font-semibold text-[#E67347]'>
                          Contest Ended
                        </p>
                      </>
                    );
                  }
                  // ✅ Contest not started yet
                  else if (now < startDate) {
                    return (
                      <>
                        <h3 className='text-lg font-bold text-white mb-2'>
                          Contest{' '}
                          <span className='text-[#E67347] font-bold'>
                            Starts
                          </span>{' '}
                          In
                        </h3>
                        <p className='text-xl font-semibold text-white'>
                          {countdown}
                        </p>
                      </>
                    );
                  }
                  // ✅ Contest ongoing
                  else {
                    return (
                      <>
                        <h3 className='text-lg font-bold text-white mb-2'>
                          Contest{' '}
                          <span className='text-[#E67347] font-bold'>Ends</span>{' '}
                          In
                        </h3>
                        <p className='text-xl font-semibold text-white'>
                          {countdown}
                        </p>
                      </>
                    );
                  }
                })()}
              </div>

              <button
                className='w-full bg-[#E67347] hover:bg-orange-600 text-white px-6 py-4 rounded-lg font-semibold text-lg transition-colors duration-200 flex items-center justify-center gap-2 cursor-pointer'
                onClick={() => navigate(`/vote/${contestId}`)}
              >
                Cast your Vote
              </button>
            </div>
          </div>

          {/* Stats Grid */}
          <div className='grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6'>
            {stats.map((stat, index) => (
              <div
                key={index}
                className='bg-white rounded-xl p-4 md:p-6 shadow-sm border border-gray-200'
              >
                <div className='flex items-center gap-4'>
                  <div className={`${stat.bgColor} p-3 rounded-lg`}>
                    <stat.icon className='w-4 h-4 md:w-6 md:h-6 text-gray-600' />
                  </div>

                  <div>
                    <div className='text-sm text-gray-600 mb-1'>
                      {stat.label}
                    </div>
                    <div className='text-2xl font-bold text-gray-900'>
                      {stat.value}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <VotingPositionsSection
            activePosition={activePosition}
            onPositionChange={handlePositionChange}
            // candidatesData={candidatesData}
            contest={contest}
          />
          <CandidatesSection
            activePosition={activePosition}
            // candidatesData={candidatesData}
            selectedCandidate={selectedCandidate}
            onCandidateSelect={handleCandidateSelect}
            contest={contest}
          />
        </div>
      </div>
    </>
  );
};

export default ContestDetailPage;
