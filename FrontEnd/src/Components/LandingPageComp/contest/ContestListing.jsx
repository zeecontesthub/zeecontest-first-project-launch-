import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Users, Clock } from 'lucide-react';
import VoteIcon from '../../../assets/VoteIcon';

const ContestListing = () => {
  const navigate = useNavigate();
  const [activeFilter, setActiveFilter] = useState('All Contests');

  const contests = [
    {
      id: 1,
      title: 'Student Union Elections 2024',
      status: 'Active',
      votes: 1234,
      positions: 5,
      contestants: 10,
      voters: 2456,
    },
    {
      id: 2,
      title: 'Student Union Elections 2024',
      status: 'Upcoming',
      votes: 1234,
      positions: 5,
      contestants: 10,
      voters: 2456,
    },
    {
      id: 3,
      title: 'Student Union Elections 2024',
      status: 'Completed',
      votes: 1234,
      positions: 5,
      contestants: 10,
      voters: 2456,
    },
    {
      id: 4,
      title: 'Student Union Elections 2024',
      status: 'Active',
      votes: 1234,
      positions: 5,
      contestants: 10,
      voters: 2456,
    },
    {
      id: 5,
      title: 'Student Union Elections 2024',
      status: 'Upcoming',
      votes: 1234,
      positions: 5,
      contestants: 10,
      voters: 2456,
    },
    {
      id: 6,
      title: 'Student Union Elections 2024',
      status: 'Completed',
      votes: 1234,
      positions: 5,
      contestants: 10,
      voters: 2456,
    },
  ];

  const filterTabs = [
    { name: 'All Contests', count: contests.length },
    {
      name: 'Active',
      count: contests.filter((contest) => contest.status === 'Active').length,
    },
    {
      name: 'Upcoming',
      count: contests.filter((contest) => contest.status === 'Upcoming').length,
    },
    {
      name: 'Completed',
      count: contests.filter((contest) => contest.status === 'Completed')
        .length,
    },
  ];

  // Filter contests based on active filter
  const filteredContests =
    activeFilter === 'All Contests'
      ? contests
      : contests.filter((contest) => contest.status === activeFilter);

  // Get status badge styling
  const getStatusBadge = (status) => {
    const baseClasses =
      'absolute top-4 right-4 px-3 py-1 rounded-full text-sm font-medium';
    switch (status) {
      case 'Active':
        return `${baseClasses} bg-green-500 text-white`;
      case 'Upcoming':
        return `${baseClasses} bg-yellow-500 text-white`;
      case 'Completed':
        return `${baseClasses} bg-red-500 text-white`;
      default:
        return `${baseClasses} bg-gray-500 text-white`;
    }
  };

  // Get button styling and text based on status
  const getButtonConfig = (status) => {
    const baseClasses =
      'w-full py-3 rounded-lg font-medium transition-all duration-200 cursor-pointer';
    switch (status) {
      case 'Active':
        return {
          classes: `${baseClasses} bg-[#034045] hover:bg-[#045a60] text-white`,
          text: 'Vote Now',
        };
      default:
        return {
          classes: `${baseClasses} bg-[#034045] hover:bg-[#045a60] text-white`,
          text: 'View Details',
        };
    }
  };

  return (
    <div className='w-full mx-auto px-4 md:px-12 lg:px-30 py-8'>
      {/* Filter Tabs */}
      <div className='flex flex-wrap gap-2 mb-8 border-b border-gray-200 pb-6'>
        {filterTabs.map((tab) => (
          <button
            key={tab.name}
            onClick={() => setActiveFilter(tab.name)}
            className={`flex items-center gap-2 px-6 py-3 rounded-full font-medium transition-all duration-200 cursor-pointer ${
              activeFilter === tab.name
                ? 'bg-[#034045] text-white shadow-lg'
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            {tab.name}
            <span
              className={`px-2 py-1 rounded-full text-xs ${
                activeFilter === tab.name
                  ? 'bg-white/20 text-white'
                  : 'bg-gray-400 text-white'
              }`}
            >
              {tab.count}
            </span>
          </button>
        ))}
      </div>

      {/* Contest Grid */}
      <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
        {filteredContests.map((contest) => {
          const buttonConfig = getButtonConfig(contest.status);

          return (
            <div
              key={contest.id}
              className='bg-[#84818133] rounded-xl overflow-hidden hover:shadow-xl transition-shadow duration-300'
            >
              {/* Contest Image/Header */}
              <div className='relative bg-black h-48 flex items-center justify-center'>
                <div className={getStatusBadge(contest.status)}>
                  {contest.status}
                </div>
              </div>

              {/* Contest Details */}
              <div className='p-6'>
                <h3 className='text-xl font-bold text-[#034045] mb-4'>
                  {contest.title}
                </h3>

                {/* Stats Row */}
                <div className='flex justify-between items-center mb-6 text-sm text-gray-600'>
                  {/* Votes */}
                  <div className='flex items-center gap-2'>
                    <Users className='w-4 h-4 text-[#034045]' />
                    <div>
                      <div className='font-semibold text-[#034045]'>
                        {contest.votes.toLocaleString()}
                      </div>
                      <div>Votes</div>
                    </div>
                  </div>

                  {/* Positions */}
                  <div className='flex items-center gap-2'>
                    <VoteIcon />
                    <div>
                      <div className='font-semibold text-[#034045]'>
                        {contest.positions}
                      </div>
                      <div>Positions</div>
                    </div>
                  </div>

                  {/* Contestants/Voters */}
                  <div className='flex items-center gap-2'>
                    <Clock className='w-4 h-4 text-[#034045]' />
                    <div>
                      <div className='font-semibold text-[#034045]'>
                        {contest.status === 'Active'
                          ? contest.contestants
                          : contest.voters.toLocaleString()}
                      </div>
                      <div>
                        {contest.status === 'Active' ? 'Contestants' : 'Voters'}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Action Button */}
                <button
                  className={buttonConfig.classes}
                  onClick={() => navigate('/contest-details')}
                >
                  {buttonConfig.text}
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default ContestListing;
