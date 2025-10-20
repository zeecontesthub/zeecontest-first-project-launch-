/* eslint-disable no-unused-vars */
import { ChevronDown, Search, Check } from 'lucide-react';
import React, { useState, useRef, useEffect } from 'react';

const VotingPositionsSection = ({
  activePosition,
  onPositionChange,
  contest,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [positionSearchTerm, setPositionSearchTerm] = useState('');
  const dropdownRef = useRef(null);

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

  const currentCandidates =
    contest?.positions?.find((pos) => pos.name === activePosition)
      ?.contestants || [];

  const currentCandidatesVoters =
    contest?.positions?.find((pos) => pos.name === activePosition)?.voters ||
    [];

  // Handle outside click to close dropdown
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const getOptionLabel = (position) => {
    const count = position?.contestants?.length ?? 0;
    const votes = !contest?.isClosedContest
      ? position?.voters?.reduce(
        (total, voter) => total + (voter.multiplier || 0),
        0
      ) ?? 0
      : contest?.closedContestVoters?.reduce((total, voter) => {
        const count =
          voter.votedFor?.filter(
            (v) => v.positionTitle === position?.name
          ).length || 0;
        return total + count * (voter.multiplier || 0);
      }, 0) ?? 0;
    return `${position.name} - ${count} Candidates • ${votes} votes`;
  };

  const filteredPositions = contest?.positions?.filter(position =>
    position.name.toLowerCase().includes(positionSearchTerm.toLowerCase())
  ) || [];

  return (
    <div className='w-full mx-auto mt-6'>
      <div className='flex  gap-3 mb-8 shadow-sm p-4 rounded-xl'>
        <div className='relative w-full md:w-auto'>
          <div className='relative' ref={dropdownRef}>
            {/* Dropdown Button */}
            <button
              className={`w-full flex items-center justify-between px-5 py-3.5 rounded-xl cursor-pointer transition-all duration-200 border-2 focus:ring-4 focus:ring-opacity-20 focus:outline-none shadow-sm hover:shadow-md ${getPositionColors(activePosition, true)}`}
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              aria-expanded={isDropdownOpen}
              aria-haspopup="listbox"
            >
              <span className='font-semibold text-base'>
                {getOptionLabel(contest?.positions?.find(pos => pos.name === activePosition))}
              </span>
              <ChevronDown
                className={`h-5 w-5 transition-transform duration-300 ease-out ${isDropdownOpen ? 'rotate-180' : ''
                  }`}
              />
            </button>

            {/* Dropdown Menu */}
            {isDropdownOpen && (
              <div className='absolute top-full left-0 right-0 mt-2 bg-white border border-gray-200 rounded-xl shadow-xl z-50 overflow-hidden animate-slideDown'>
                {/* Search Box */}
                <div className='p-3 bg-gray-50 border-b border-gray-200'>
                  <div className='relative'>
                    <Search className='absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none' />
                    <input
                      type='text'
                      placeholder='Search positions...'
                      value={positionSearchTerm}
                      onChange={(e) => setPositionSearchTerm(e.target.value)}
                      className='w-full py-2.5 pl-10 pr-4 text-sm bg-white border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-150 outline-none'
                      onClick={(e) => e.stopPropagation()}
                    />
                  </div>
                </div>

                {/* Options List */}
                <div className='max-h-64 overflow-y-auto'>
                  {filteredPositions.length > 0 ? (
                    <div role='listbox'>
                      {filteredPositions.map((position) => {
                        const isActive = activePosition === position.name;
                        return (
                          <div
                            key={position.name}
                            role='option'
                            aria-selected={isActive}
                            className={`px-4 py-3 cursor-pointer transition-all duration-150 flex items-center justify-between group ${isActive
                                ? 'bg-blue-50 text-blue-700 font-medium'
                                : 'text-gray-700 hover:bg-gray-50'
                              }`}
                            onClick={() => {
                              onPositionChange(position.name);
                              setIsDropdownOpen(false);
                              setPositionSearchTerm('');
                            }}
                          >
                            <span className='text-sm'>{getOptionLabel(position)}</span>
                            {isActive && (
                              <Check className='h-4 w-4 opacity-70' />
                            )}
                          </div>
                        );
                      })}
                    </div>
                  ) : (
                    <div className='px-4 py-8 text-gray-400 text-center'>
                      <Search className='h-8 w-8 mx-auto mb-2 opacity-30' />
                      <p className='text-sm'>No positions found</p>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Add this CSS somewhere in your component or global styles */}
          <style jsx>{`
  @keyframes slideDown {
    from {
      opacity: 0;
      transform: translateY(-10px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }
  
  .animate-slideDown {
    animation: slideDown 0.2s ease-out;
  }
`}</style>
        </div>
      </div>

      <div className='bg-white rounded-xl shadow-sm overflow-hidden p-4 md:p-6'>
        <div className='pl-0 py-4 md:p-6 flex flex-col md:flex-row md:justify-between md:items-center gap-4'>
          <h2 className='text-2xl font-bold text-gray-900'>
            {activePosition} Leaderboard
          </h2>

          {/* Search Input Field */}
          <div className='relative w-full md:w-80'>
            <Search className='absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400' />
            <input
              type='text'
              placeholder='Search candidate name...'
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className='w-full py-2 pl-10 pr-4 border-2 border-gray-300 rounded-lg focus:ring-[#034045] focus:border-[#034045] transition duration-150'
            />
          </div>
        </div>

        <div className='bg-white rounded-xl overflow-hidden p-0 md:p-6'>
          <div>
            {(() => {
              // 1️⃣ Pre-compute vote totals for all candidates
              const candidatesWithVotes = currentCandidates.map((candidate) => {
                let votes = 0;

                if (!contest?.isClosedContest) {
                  votes =
                    currentCandidatesVoters
                      ?.filter(
                        (voter) =>
                          voter.votedFor?.toString() ===
                          candidate._id?.toString()
                      )
                      .reduce(
                        (total, voter) => total + (voter.multiplier || 0),
                        0
                      ) || 0;
                } else {
                  votes =
                    contest.closedContestVoters?.reduce((total, voter) => {
                      const count =
                        voter.votedFor?.filter(
                          (v) =>
                            v.votedFor?.toString() === candidate._id?.toString()
                        ).length || 0;
                      return total + count * (voter.multiplier || 0);
                    }, 0) || 0;
                }

                return { ...candidate, votes };
              });

              // 2️⃣ Find the highest vote total
              const maxVotes = Math.max(
                0,
                ...candidatesWithVotes.map((c) => c.votes)
              );

              // 3️⃣ Sort by votes (descending)
              const sorted = [...candidatesWithVotes].sort(
                (a, b) => b.votes - a.votes
              );

              // 4️⃣ Filter the sorted list based on the search term
              const lowerCaseSearchTerm = searchTerm.toLowerCase();

              const filteredAndSortedCandidates = sorted.filter((candidate) =>
                candidate.name.toLowerCase().includes(lowerCaseSearchTerm)
              );

              // 5️⃣ Render
              if (filteredAndSortedCandidates.length === 0) {
                return (
                  <div className='text-center py-10 text-gray-500'>
                    No candidates found matching "{searchTerm}" for this
                    position.
                  </div>
                );
              }

              return filteredAndSortedCandidates.map((candidate, index) => (
                <div
                  key={candidate._id}
                  className='p-4 md:p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between
                   bg-[#D9D9D94D] hover:bg-gray-50 transition-colors duration-200 rounded-xl mb-4'
                >
                  <div className='flex items-center gap-2 md:gap-4'>
                    <div
                      className={`w-10 h-10 md:w-12 md:h-12 rounded-full flex items-center justify-center
                        font-bold text-sm md:text-lg ${getRankBadgeColor(
                        index + 1
                      )}`}
                    >
                      {index + 1}
                    </div>

                    <div className='w-10 h-10 md:w-12 md:h-12 bg-black rounded-full flex items-center justify-center overflow-hidden'>
                      {candidate.image ? (
                        <img
                          src={candidate.image}
                          alt={candidate.name}
                          className='w-full h-full object-cover rounded-full'
                        />
                      ) : (
                        <span className='text-white text-xs'>No Img</span>
                      )}
                    </div>

                    <div>
                      <h3 className='text-base md:text-lg font-semibold text-gray-900'>
                        {candidate.name}
                      </h3>
                      <p className='text-gray-600 text-sm'>
                        {candidate.votes} Votes
                      </p>
                    </div>
                  </div>

                  {/* Show “Leading” only if this candidate has the highest votes */}

                  <div className='flex items-center gap-3 mt-3 sm:mt-0'>
                    {candidate.votes === maxVotes && maxVotes > 0 && (
                      <div className='bg-[#00B25F] text-white px-4 md:px-6 py-2 rounded-[20px] font-medium text-sm'>
                        {contest?.status === 'completed' ? 'Winner' : 'Leading'}
                      </div>
                    )}
                    <button
                      className='bg-orange-500 hover:bg-orange-600 text-white px-4 md:px-6 py-2 rounded-[20px] font-medium text-sm transition-colors'
                      onClick={() => {
                        window.location.href = `/vote/${contest._id
                          }?position=${encodeURIComponent(
                            activePosition
                          )}&candidateId=${encodeURIComponent(
                            candidate._id
                          )}&candidateName=${encodeURIComponent(candidate.name)}`;
                      }}
                    >
                      Vote
                    </button>
                  </div>
                </div>
              ));
            })()}
          </div>
        </div>
      </div>
    </div>
  );
};

export default VotingPositionsSection;
