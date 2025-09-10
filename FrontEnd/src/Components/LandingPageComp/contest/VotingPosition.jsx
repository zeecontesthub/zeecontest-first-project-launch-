const VotingPositionsSection = ({
  activePosition,
  onPositionChange,
  candidatesData,
}) => {
  const positions = [
    {
      name: 'President',
      candidates: 8,
      votes: 1250,
      isActive: true,
    },
    {
      name: 'Vice-President',
      candidates: 6,
      votes: 890,
      isActive: false,
    },
    {
      name: 'Secretary',
      candidates: 5,
      votes: 675,
      isActive: false,
    },
    {
      name: 'PRO',
      candidates: 4,
      votes: 542,
      isActive: false,
    },
    {
      name: 'Treasurer',
      candidates: 7,
      votes: 823,
      isActive: false,
    },
  ];

  // Canonical positions data for ID lookup
  const canonicalPositions = [
    {
      name: 'President',
      candidates: [
        { id: 1, name: 'James Williamson', avatar: null },
        { id: 2, name: 'Sarah Johnson', avatar: null },
        { id: 3, name: 'Michael Brown', avatar: null },
        { id: 4, name: 'Emily Davis', avatar: null },
        { id: 5, name: 'David Wilson', avatar: null },
      ],
    },
    {
      name: 'Vice-President',
      candidates: [
        { id: 6, name: 'Alice Cooper', avatar: null },
        { id: 7, name: 'Bob Miller', avatar: null },
        { id: 8, name: 'Carol White', avatar: null },
        { id: 9, name: 'Daniel Green', avatar: null },
        { id: 10, name: 'Eva Martinez', avatar: null },
      ],
    },
    {
      name: 'Secretary',
      candidates: [
        { id: 11, name: 'Frank Anderson', avatar: null },
        { id: 12, name: 'Grace Taylor', avatar: null },
        { id: 13, name: 'Henry Lee', avatar: null },
      ],
    },
    {
      name: 'PRO',
      candidates: [
        { id: 14, name: 'Kate Phillips', avatar: null },
        { id: 15, name: 'Liam Murphy', avatar: null },
        { id: 16, name: 'Maya Patel', avatar: null },
      ],
    },
    {
      name: 'Treasurer',
      candidates: [
        { id: 17, name: 'Olivia Scott', avatar: null },
        { id: 18, name: 'Paul Robinson', avatar: null },
        { id: 19, name: 'Quinn Adams', avatar: null },
      ],
    },
  ];

  const getPositionColors = (position, isActive) => {
    if (isActive) {
      return 'bg-[#034045] text-white';
    }
    return 'bg-gray-200 text-gray-700 hover:bg-gray-300';
  };

  const getRankBadgeColor = (position) => {
    switch (position) {
      case 1:
        return 'bg-[#034045] text-white';
      case 2:
        return 'bg-orange-500 text-white';
      case 3:
        return 'bg-yellow-600 text-white';
      case 4:
        return 'bg-gray-400 text-white';
      case 5:
        return 'bg-gray-300 text-gray-700';
      default:
        return 'bg-gray-200 text-gray-700';
    }
  };

  const currentCandidates = candidatesData[activePosition] || [];

  const getCanonicalCandidateId = (positionName, candidateName) => {
    const pos = canonicalPositions.find((p) => p.name === positionName);
    if (!pos) return null;
    const cand = pos.candidates.find((c) => c.name === candidateName);
    return cand ? cand.id : null;
  };

  return (
    <div className='w-full mx-auto mt-6'>
      <div className='flex overflow-x-auto gap-3 mb-8 shadow-sm p-4 rounded-xl'>
        {positions.map((position) => (
          <button
            key={position.name}
            onClick={() => onPositionChange(position.name)}
            className={`flex-shrink-0 px-6 py-3 rounded-xl font-medium transition-all duration-200 cursor-pointer whitespace-nowrap ${getPositionColors(
              position.name,
              activePosition === position.name
            )}`}
          >
            <div className='font-semibold'>{position.name}</div>

            {/* Show details on medium screens and up */}
            <div className='text-xs opacity-80 hidden md:block'>
              {position.candidates} Candidates • {position.votes} votes
            </div>
          </button>
        ))}
      </div>

      <div className='bg-white rounded-xl shadow-sm overflow-hidden p-4 md:p-6'>
        <div className='pl-0 py-4 md:p-6'>
          <h2 className='text-2xl font-bold text-gray-900'>
            {activePosition} Leaderboard
          </h2>
        </div>

        <div className='bg-white rounded-xl overflow-hidden p-0 md:p-6'>
          <div>
            {currentCandidates.map((candidate) => (
              <div
                key={candidate.id}
                className='p-4 md:p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between bg-[#D9D9D94D] hover:bg-gray-50 transition-colors duration-200 rounded-xl mb-4'
              >
                <div className='flex items-center gap-2 md:gap-4'>
                  <div
                    className={`w-10 h-10 md:w-12 md:h-12 rounded-full flex items-center justify-center font-bold text-sm md:text-lg ${getRankBadgeColor(
                      candidate.position
                    )}`}
                  >
                    {candidate.position}
                  </div>

                  <div className='w-10 h-10 md:w-12 md:h-12 bg-black rounded-full flex items-center justify-center'></div>

                  <div>
                    <h3 className='text-base md:text-lg font-semibold text-gray-900'>
                      {candidate.name}
                    </h3>
                    <p className='text-gray-600 text-sm'>
                      {candidate.votes} Votes
                    </p>
                  </div>
                </div>

                {/* Leading tag and Vote Button aligned */}
                <div className='flex items-center gap-3 mt-3 sm:mt-0'>
                  {candidate.position === 1 && (
                    <div className='bg-[#00B25F] text-white px-4 md:px-6 py-2 rounded-[20px] font-medium text-sm'>
                      Leading
                    </div>
                  )}
                  <button
                    className='bg-orange-500 hover:bg-orange-600 text-white px-4 md:px-6 py-2 rounded-[20px] font-medium text-sm transition-colors'
                    onClick={() => {
                      const canonicalId = getCanonicalCandidateId(activePosition, candidate.name);
                      window.location.href = `/vote?position=${encodeURIComponent(
                        activePosition
                      )}&candidateId=${encodeURIComponent(canonicalId)}&candidateName=${encodeURIComponent(
                        candidate.name
                      )}`;
                    }}
                  >
                    Vote
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default VotingPositionsSection;
