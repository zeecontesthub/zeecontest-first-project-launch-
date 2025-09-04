import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  ChevronLeft,
  Users,
  UserCheck,
  Trophy,
  DollarSign,
} from 'lucide-react';
import VotingPositionsSection from '../../Components/LandingPageComp/contest/VotingPosition';
import CandidatesSection from '../../Components/LandingPageComp/contest/CandidateSection';
const ContestDetailPage = () => {
  const navigate = useNavigate();
  const [activePosition, setActivePosition] = useState('President');
  const [selectedCandidate, setSelectedCandidate] = useState(null);

  // Contest data
  const contestData = {
    id: 1,
    title: 'Student Union Elections 2024',
    description: 'Contest Description goes here',
    status: 'Active',
    endTime: '1d 14h 8m',
    totalVotes: 2457,
    totalContestants: 30,
    positions: 5,
    amountPerVote: 0,
    image: null,
  };

  const candidatesData = {
    President: [
      {
        id: 1,
        name: 'James Williamson',
        votes: 298,
        avatar: null,
        position: 1,
      },
      { id: 2, name: 'Sarah Johnson', votes: 285, avatar: null, position: 2 },
      { id: 3, name: 'Michael Brown', votes: 267, avatar: null, position: 3 },
      { id: 4, name: 'Emily Davis', votes: 234, avatar: null, position: 4 },
      { id: 5, name: 'David Wilson', votes: 166, avatar: null, position: 5 },
    ],
    'Vice-President': [
      { id: 1, name: 'Alice Cooper', votes: 178, avatar: null, position: 1 },
      { id: 2, name: 'Bob Miller', votes: 165, avatar: null, position: 2 },
      { id: 3, name: 'Carol White', votes: 142, avatar: null, position: 3 },
      { id: 4, name: 'Daniel Green', votes: 138, avatar: null, position: 4 },
      { id: 5, name: 'Eva Martinez', votes: 125, avatar: null, position: 5 },
    ],
    Secretary: [
      { id: 1, name: 'Frank Anderson', votes: 156, avatar: null, position: 1 },
      { id: 2, name: 'Grace Taylor', votes: 142, avatar: null, position: 2 },
      { id: 3, name: 'Henry Lee', votes: 128, avatar: null, position: 3 },
      { id: 4, name: 'Ivy Chen', votes: 119, avatar: null, position: 4 },
      { id: 5, name: 'Jack Turner', votes: 98, avatar: null, position: 5 },
    ],
    PRO: [
      { id: 1, name: 'Kate Phillips', votes: 145, avatar: null, position: 1 },
      { id: 2, name: 'Liam Murphy', votes: 132, avatar: null, position: 2 },
      { id: 3, name: 'Maya Patel', votes: 118, avatar: null, position: 3 },
      { id: 4, name: 'Noah Garcia', votes: 105, avatar: null, position: 4 },
    ],
    Treasurer: [
      { id: 1, name: 'Olivia Scott', votes: 167, avatar: null, position: 1 },
      { id: 2, name: 'Paul Robinson', votes: 154, avatar: null, position: 2 },
      { id: 3, name: 'Quinn Adams', votes: 143, avatar: null, position: 3 },
      { id: 4, name: 'Rachel Clark', votes: 129, avatar: null, position: 4 },
      { id: 5, name: 'Sam Lewis', votes: 116, avatar: null, position: 5 },
    ],
  };

  const stats = [
    {
      icon: Users,
      label: 'Total Votes',
      value: contestData.totalVotes.toLocaleString(),
      bgColor: 'bg-gray-100',
    },
    {
      icon: UserCheck,
      label: 'Total Contestants',
      value: contestData.totalContestants,
      bgColor: 'bg-gray-100',
    },
    {
      icon: Trophy,
      label: 'Positions',
      value: contestData.positions,
      bgColor: 'bg-gray-100',
    },
    {
      icon: DollarSign,
      label: 'Amount Per Vote',
      value: `₦${contestData.amountPerVote}`,
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
                {contestData.title}
              </p>
            </div>
          </div>
        </div>

        <div className='bg-black mb-4 md:mb-8 relative overflow-hidden'>
          <div className='h-64 md:h-80 flex items-center justify-center'></div>
        </div>

        <div className='mx-auto px-4 md:px-30 py-4 md:py-8'>
          <div className='grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8'>
            <div className='lg:col-span-2 flex gap-6 items-center justify-center'>
              <div>
                <div className='w-32 h-32 bg-black rounded-full border-4 border-[#034045] flex items-center justify-center'></div>
              </div>

              <div className='flex-grow'>
                <p className='text-2xl md:text-3xl font-bold text-gray-900 mb-2'>
                  {contestData.title}
                </p>
                <p className='text-gray-600 text-lg mb-4'>
                  {contestData.description}
                </p>
              </div>
            </div>

            <div className='space-y-4'>
              <div className='bg-[#00B25F] text-white px-6 py-3 rounded-lg text-center font-medium'>
                <div className='text-sm'>Active</div>
                <div className='text-lg font-bold'>{contestData.endTime}</div>
              </div>

              <button
                className='w-full bg-[#E67347] hover:bg-orange-600 text-white px-6 py-4 rounded-lg font-semibold text-lg transition-colors duration-200 flex items-center justify-center gap-2 cursor-pointer'
                onClick={() => navigate('/vote')}
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
            candidatesData={candidatesData}
          />
          <CandidatesSection
            activePosition={activePosition}
            candidatesData={candidatesData}
            selectedCandidate={selectedCandidate}
            onCandidateSelect={handleCandidateSelect}
          />
        </div>
      </div>
    </>
  );
};

export default ContestDetailPage;
