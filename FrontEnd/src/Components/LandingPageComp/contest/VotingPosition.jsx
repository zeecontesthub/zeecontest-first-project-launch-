/* eslint-disable no-unused-vars */
import { ChevronDown, Search } from 'lucide-react';
import React, { useState } from 'react';

const VotingPositionsSection = ({
  activePosition,
  onPositionChange,
  contest,
}) => {
  const [searchTerm, setSearchTerm] = useState('');

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

  return (
    <div className='w-full mx-auto mt-6'>
      <div className='flex overflow-x-auto gap-3 mb-8 shadow-sm p-4 rounded-xl'>
        <div className='relative w-full md:w-auto'>
          <select
            onChange={(e) => onPositionChange(e.target.value)}
            value={activePosition}
            className={`
          appearance-none w-full px-6 py-3 pr-10 rounded-xl font-medium cursor-pointer transition-all duration-200
          border-2 focus:ring-2 focus:outline-none 
          ${getPositionColors(activePosition, true)}
        `}
          >
            {contest?.positions.map((position) => (
              <option key={position.name} value={position.name}>
                {position.name} - {position?.contestants?.length ?? 0}{' '}
                Candidates •{' '}
                {!contest?.isClosedContest
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
                    }, 0) ?? 0}{' '}
                votes
              </option>
            ))}
          </select>
          <div className='pointer-events-none absolute inset-y-0 right-0 flex items-center px-2'>
            <ChevronDown
              className={`h-6 w-6 font-bold transition-transform duration-200 
          ${
            getPositionColors(activePosition, true) ===
            'bg-gray-100 text-gray-700'
              ? 'text-gray-500'
              : 'text-white'
          }`}
            />
          </div>
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
                        Leading
                      </div>
                    )}
                    <button
                      className='bg-orange-500 hover:bg-orange-600 text-white px-4 md:px-6 py-2 rounded-[20px] font-medium text-sm transition-colors'
                      onClick={() => {
                        window.location.href = `/vote/${
                          contest._id
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
