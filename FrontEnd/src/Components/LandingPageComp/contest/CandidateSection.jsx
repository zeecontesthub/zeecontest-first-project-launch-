import { useNavigate } from 'react-router-dom';

const CandidateSection = ({ activePosition, onCandidateSelect, contest }) => {
  const navigate = useNavigate();

  const handleCastVote = () => {
    navigate(`/vote/${contest._id}`);
  };

  // ✅ Find the active position object and its contestants
  const currentPosition = contest?.positions?.find(
    (pos) => pos.name === activePosition
  );

  const currentCandidates = currentPosition?.contestants || [];

  // ✅ Build array with proper vote totals
  const candidates = currentCandidates.map((candidate) => {
    let votes = 0;

    if (!contest?.isClosedContest) {
      // ---- OPEN contest ----
      votes =
        currentPosition?.voters
          ?.filter(
            (voter) => voter.votedFor?.toString() === candidate._id?.toString()
          )
          .reduce((total, voter) => total + (voter.multiplier || 0), 0) || 0;
    } else {
      // ---- CLOSED contest ----
      votes =
        contest.closedContestVoters?.reduce((total, voter) => {
          const count =
            voter.votedFor?.filter(
              (v) => v.votedFor?.toString() === candidate._id?.toString()
            ).length || 0;
          return total + count * (voter.multiplier || 0);
        }, 0) || 0;
    }

    return {
      id: candidate._id,
      name: candidate.name,
      description: `This is ${
        candidate.name
      } running for the post of ${activePosition?.toLowerCase()} in the election that is going to define things`,
      image: candidate.image || null,
      votes,
      bio:
        candidate.bio ||
        `This is ${
          candidate.name
        } running for the post of ${activePosition?.toLowerCase()} in the election that is going to define things`,
      position: candidate.position || activePosition,
    };
  });

  return (
    <div className='w-full mx-auto px-4 py-8'>
      <div className='flex flex-col md:flex-row md:items-center md:justify-between mb-8'>
        <div>
          <h2 className='text-3xl font-bold text-gray-900 mb-2'>
            {activePosition} Candidates
          </h2>
          <p className='text-gray-600'>
            Select your preferred candidate for the{' '}
            {activePosition?.toLowerCase()} position
          </p>
        </div>

        <button
          onClick={handleCastVote}
          className='mt-4 md:mt-0 bg-[#034045] hover:bg-[#045a60] text-white px-8 py-3 rounded-lg font-semibold transition-colors duration-200 shadow-lg cursor-pointer hover:shadow-xl'
        >
          Cast your vote
        </button>
      </div>

      <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
        {candidates.map((candidate) => (
          <div
            key={candidate.id}
            className='bg-white rounded-xl shadow-lg overflow-hidden transition-all duration-200 cursor-pointer hover:shadow-xl transform hover:-translate-y-1'
            onClick={() => onCandidateSelect(candidate)}
          >
            <div className='bg-black h-64 flex items-center justify-center relative'>
              {candidate.image ? (
                <img
                  src={candidate.image}
                  alt={candidate.name}
                  className='h-full w-full object-contain'
                />
              ) : (
                <span className='text-white'>No Image</span>
              )}
            </div>

            <div className='p-6 bg-gray-10'>
              <h3 className='text-xl font-bold text-gray-900 mb-3'>
                {candidate.name}
              </h3>

              <p className='text-gray-600 text-sm mb-4 leading-relaxed'>
                {candidate.bio}
              </p>

              <div className='flex items-center justify-between mb-4'>
                <span className='text-sm text-gray-500'>Current Votes:</span>
                <span className='font-semibold text-[#034045]'>
                  {candidate.votes}
                </span>
              </div>

              <button
                className='w-full bg-[#034045] hover:bg-[#045a60] text-white py-3 rounded-lg font-medium transition-colors duration-200 cursor-pointer'
                onClick={(e) => {
                  e.stopPropagation();
                  navigate(
                    `/vcontestantdetails/${activePosition}/${candidate.id}/${contest._id}`
                  ); // replace 1 with contestId if needed
                }}
              >
                View Profile
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CandidateSection;
