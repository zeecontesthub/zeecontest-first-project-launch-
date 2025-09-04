import { useNavigate } from 'react-router-dom';
const CandidateSection = ({
  activePosition,
  candidatesData,
  onCandidateSelect,
}) => {
  const navigate = useNavigate();
  const handleCastVote = () => {
    navigate('/vote');
  };

  const currentCandidates = candidatesData[activePosition] || [];
  const candidates = currentCandidates.map((candidate) => ({
    id: candidate.id,
    name: candidate.name,
    description: `This is ${
      candidate.name
    } running for the post of ${activePosition.toLowerCase()} in the election that is going to define things`,
    image: null,
    votes: candidate.votes,
  }));

  return (
    <div className='w-full mx-auto px-4 py-8'>
      <div className='flex flex-col md:flex-row md:items-center md:justify-between mb-8'>
        <div>
<<<<<<< HEAD
          <p className='text-3xl font-bold text-gray-900 mb-2'>
            {activePosition} Candidates
          </p>
=======
          <h2 className='text-3xl font-bold text-gray-900 mb-2'>
            {activePosition} Candidates
          </h2>
>>>>>>> 4cb84f74b69a8693bca6b47fe8eeddbf07295aa8
          <p className='text-gray-600'>
            Select your preferred candidate for the{' '}
            {activePosition.toLowerCase()} position
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
            className='bg-[#D9D9D9] rounded-xl shadow-lg overflow-hidden transition-all duration-200 cursor-pointer hover:shadow-xl transform hover:-translate-y-1'
            onClick={() => onCandidateSelect(candidate)}
          >
            <div className='bg-black h-64 flex items-center justify-center relative'></div>

            <div className='p-6 bg-gray-100'>
<<<<<<< HEAD
              <p className='text-xl font-bold text-gray-900 mb-3'>
                {candidate.name}
              </p>
=======
              <h3 className='text-xl font-bold text-gray-900 mb-3'>
                {candidate.name}
              </h3>
>>>>>>> 4cb84f74b69a8693bca6b47fe8eeddbf07295aa8

              <p className='text-gray-600 text-sm mb-4 leading-relaxed'>
                {candidate.description}
              </p>

              <div className='flex items-center justify-between mb-4'>
                <span className='text-sm text-gray-500'>Current Votes:</span>
                <span className='font-semibold text-[#034045]'>
                  {candidate.votes}
                </span>
              </div>

              <button
                className='w-full bg-[#034045] hover:bg-[#045a60] text-white py-3 rounded-lg font-medium transition-colors duration-200 cursor-pointer'
                onClick={() => {}}
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
