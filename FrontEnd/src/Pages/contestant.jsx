import React, { useEffect, useState } from 'react';
import Sidebar from '../Components/sidebar';
import BannerImage from '../assets/Rectangle _5189.png';
import LogoImage from '../assets/Ellipse 20.png';
import { Edit, Share2, ChevronLeft } from 'lucide-react';
import { useNavigate, useParams } from 'react-router-dom';
import ContestantCard from '../Components/ContestantCard';
import axios from 'axios';

const Contestant = () => {
  const { contestId } = useParams();
  const [contest, setContest] = useState(null);
  const [selectedPosition, setSelectedPosition] = useState('All');
  const navigate = useNavigate();

  // Get positions from contest data
  const positions = contest?.positions?.map((pos) => pos.name) || [];
  const filterOptions = ['All', ...positions];

  const allPositions = contest?.positions || [];

  // ✅ Flatten every contestant, but still attach its parent position name
  const allContestants = allPositions.flatMap((pos) =>
    (pos.contestants || []).map((candidate) => {
      // ---- Count votes for this candidate within THIS position ----
      let votes = 0;
      if (!contest?.isClosedContest) {
        votes =
          pos.voters
            ?.filter(
              (voter) =>
                voter.votedFor?.toString() === candidate._id?.toString()
            )
            .reduce((t, voter) => t + (voter.multiplier || 0), 0) || 0;
      } else {
        votes =
          contest.closedContestVoters?.reduce((t, voter) => {
            const count =
              voter.votedFor?.filter(
                (v) => v.votedFor?.toString() === candidate._id?.toString()
              ).length || 0;
            return t + count * (voter.multiplier || 0);
          }, 0) || 0;
      }

      return {
        id: candidate._id,
        name: candidate.name,
        description: `This is ${
          candidate.name
        } running for the post of ${pos.name.toLowerCase()}`,
        image: candidate.image || null,
        votes,
        bio:
          candidate.bio ||
          `This is ${
            candidate.name
          } running for the post of ${pos.name.toLowerCase()}`,
        position: candidate.position || pos.name,
      };
    })
  );

  const filteredContestants =
    selectedPosition === 'All'
      ? allContestants
      : allContestants.filter(
          (contestant) => contestant.position === selectedPosition
        );
  // Flatten all contestants from all positions

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

  // ✅ Get every position object

  return (
    <div className='flex min-h-screen overflow-x-hidden lg:gap-[10rem]'>
      <Sidebar />
      <div className='flex-1 p-6 md:ml-20 '>
        {/* Header */}
        <div className='flex items-center gap-4 mb-8'>
          <button
            onClick={() => navigate(-1)}
            className='p-2 rounded-full hover:bg-gray-200 transition-colors'
            aria-label='Back to Contest Details'
          >
            <ChevronLeft size={24} />
          </button>
          <h2 className='text-[30px] text-left font-bold text-gray-900 mb-0'>
            Contestant
          </h2>
        </div>

        <div className='relative mb-2  h-65'>
          <img
            src={contest?.coverImageUrl || BannerImage}
            alt='Contest Banner'
            className='w-full object-cover rounded-lg h-full absolute inset-0'
          />
        </div>

        {/* Main Header Content */}
        <div className='relative z-10  backdrop-blur-sm rounded-3xl p-6 lg:p-8'>
          <div className='flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between'>
            {/* Left Section - Logo and Content */}
            <div className='flex flex-col sm:flex-row items-start sm:items-center gap-4 sm:gap-6 min-w-0 flex-1'>
              {/* Logo */}
              <div className='w-16 h-16 sm:w-20 sm:h-20 lg:w-24 lg:h-24 rounded-full flex items-center justify-center border-4 border-black overflow-hidden -mt-5 ml-5 flex-shrink-0'>
                <img
                  src={contest?.contestLogoImageUrl || LogoImage}
                  alt='Logo'
                  className='w-full h-full object-cover'
                />
              </div>

              {/* Content */}
              <div className='min-w-0 flex-1'>
                <h2 className='text-xl sm:text-2xl lg:text-[32px] text-left font-bold text-gray-900 mb-2 break-words'>
                  {contest?.title || 'Contest Name'}
                </h2>
                <p className='text-gray-600 text-left text-sm lg:text-base break-words'>
                  {contest?.description || ''}
                </p>

                {/* Stats - Make responsive */}
                <div className='flex flex-col sm:flex-row items-start sm:items-center gap-4 sm:gap-8 mt-4 overflow-x-auto'>
                  <div className='flex-shrink-0'>
                    <span className='text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900'>
                      {totalVotes}
                    </span>
                    <span className='text-gray-600 ml-2 text-xs sm:text-sm block sm:inline'>
                      Total Votes
                    </span>
                  </div>
                  <div className='flex-shrink-0'>
                    <span className='text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900'>
                      {totalContestants}
                    </span>
                    <span className='text-gray-600 ml-2 text-xs sm:text-sm block sm:inline'>
                      Contestant
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Filter Buttons */}
        <div className='flex flex-wrap gap-3 mb-8 mt-7'>
          {filterOptions.map((pos) => (
            <button
              key={pos}
              onClick={() => setSelectedPosition(pos)}
              className={`px-6 py-3 rounded-lg font-medium transition-colors ${
                selectedPosition === pos
                  ? 'bg-orange-500 text-white'
                  : 'bg-teal-800 text-white hover:bg-teal-700'
              }`}
            >
              {pos}
            </button>
          ))}
        </div>

        {/* Contestants List */}
        <div className='mt-10 grid grid-cols-1 sm:grid-cols-2 text-left md:grid-cols-3 lg:grid-cols-4 gap-6'>
          {filteredContestants.map((contestant, index) => (
            <ContestantCard
              key={contestant._id || index}
              name={contestant.name}
              image={contestant.image || contestant.avatar || ''}
              votes={contestant.votes || 0}
              position={contestant.position}
              contestantId={contestant.id}
              contestId={contestId}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default Contestant;
