import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { ChevronLeft, Check } from 'lucide-react';
import VotersCode from '../../Components/LandingPageComp/contest/VotersCode';
import OpenContestRegistration from '../../Components/LandingPageComp/contest/OpenContestRegistration';

const VotingFlow = () => {
  // Simulate contest type for demo: 'open' or 'closed'
  const [contestType, setContestType] = useState('open'); // now stateful

  // Voting flow state
  const navigate = useNavigate();
  const location = useLocation();
  const [currentStep, setCurrentStep] = useState('cast');
  const [currentPositionIndex, setCurrentPositionIndex] = useState(0);
  const [votes, setVotes] = useState({});
  const [showVotersCode, setShowVotersCode] = useState(false);
  const [showOpenContestPopup, setShowOpenContestPopup] = useState(false);
  const [finalVotes, setFinalVotes] = useState({});
  const [multiplier, setMultiplier] = useState(1);

  // Position and candidate data
  const positions = [
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

  // Preselect logic from query params
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const position = params.get('position');
    const candidateId = params.get('candidateId');
    if (position && candidateId) {
      const posIndex = positions.findIndex((p) => p.name === position);
      if (posIndex !== -1) {
        setCurrentPositionIndex(posIndex);
        // Wait for position index to update, then set the vote
        setTimeout(() => {
          const candidateObj = positions[posIndex].candidates.find(
            (c) => String(c.id) === String(candidateId)
          );
          if (candidateObj) {
            setVotes((prev) => ({
              ...prev,
              [position]: candidateObj,
            }));
          }
        }, 0);
      }
    }
    // eslint-disable-next-line
  }, [location.search]);

  const currentPosition = positions[currentPositionIndex];

  const handleCandidateSelect = (candidate) => {
    setVotes((prev) => ({
      ...prev,
      [currentPosition.name]: candidate,
    }));
  };

  const handleNextPosition = () => {
    if (currentPositionIndex < positions.length - 1) {
      setCurrentPositionIndex((prev) => prev + 1);
    } else {
      setCurrentStep('review');
    }
  };

  const handleSkipToReview = () => {
    setCurrentStep('review');
  };

  const handleBackToCasting = () => {
    setCurrentStep('cast');
  };

  const handleSubmitVotes = () => {
    if (contestType === 'open') {
      setShowOpenContestPopup(true);
    } else {
      setShowVotersCode(true);
    }
    setFinalVotes(votes);
  };

  const handleVotersCodeClose = () => {
    setShowVotersCode(false);
  };

  const handleOpenContestClose = () => {
    setShowOpenContestPopup(false);
  };

  const handleOpenContestGoogleVerify = () => {
    setShowOpenContestPopup(false);
    alert('Google verification simulated! (Backend not implemented)');
    // You can simulate a successful vote here
  };

  const handleVotersCodeSubmit = (code) => {
    setShowVotersCode(false);
    // You can add code verification logic here
    alert('Votes submitted successfully!');
    console.log('Final votes:', finalVotes, 'Voters code:', code, 'Multiplier:', multiplier);
  };

  // Cast Vote Page
  if (currentStep === 'cast') {
    return (
      <>
        <div className='px-4 md:px-30 py-8 bg-[#F8F8F8]'>
          <div className='mx-auto'>
            <div className='flex items-center gap-4 mb-8'>
              <button
                className='p-2 hover:bg-gray-100 rounded-lg transition-colors'
                onClick={() => navigate(-1)}
              >
                <ChevronLeft className='w-8 h-8 text-gray-900' />
              </button>
              <h1 className='text-[20px] font-semibold text-gray-900'>
                Cast your vote
              </h1>
            </div>

            {/* Contest type toggle for demo */}
            <div className='flex justify-end mb-4'>
              <div className='flex items-center gap-2'>
                <span className='text-sm text-gray-700'>Demo as:</span>
                <button
                  className={`px-3 py-1 rounded-l border border-gray-300 text-sm font-medium ${contestType === 'open' ? 'bg-[#034045] text-white' : 'bg-white text-gray-700'}`}
                  onClick={() => setContestType('open')}
                  type='button'
                >
                  Open Contest
                </button>
                <button
                  className={`px-3 py-1 rounded-r border border-gray-300 text-sm font-medium ${contestType === 'closed' ? 'bg-[#034045] text-white' : 'bg-white text-gray-700'}`}
                  onClick={() => setContestType('closed')}
                  type='button'
                >
                  Closed Contest
                </button>
              </div>
            </div>

            <div className='mb-8'>
              <p className='text-gray-700 mb-4'>Select your position</p>
              <div className='flex flex-wrap gap-3'>
                {positions.map((position, index) => (
                  <button
                    key={position.name}
                    onClick={() => setCurrentPositionIndex(index)}
                    className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                      index === currentPositionIndex
                        ? 'bg-[#034045] text-white'
                        : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                    }`}
                  >
                    {position.name}
                    <span className='ml-2 text-xs'>
                      {position.candidates.length}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            <div className='mb-8'>
              <p className='text-gray-700 mb-4'>
                Select the contestant you want to vote for
              </p>
              <div className='space-y-3'>
                {currentPosition.candidates.map((candidate) => (
                  <div
                    key={candidate.id}
                    onClick={() => handleCandidateSelect(candidate)}
                    className='flex items-center justify-between p-4 bg-[#D9D9D94D] rounded-lg border-2 border-gray-200 hover:border-gray-300 cursor-pointer transition-colors'
                  >
                    <div className='flex items-center gap-4'>
                      <div className='w-12 h-12 bg-black rounded-full'></div>
                      <span className='text-lg font-medium text-gray-900'>
                        {candidate.name}
                      </span>
                    </div>
                    <div
                      className={`w-6 h-6 border-2 rounded ${
                        votes[currentPosition.name]?.id === candidate.id
                          ? 'bg-[#034045] border-[#034045]'
                          : 'border-gray-300'
                      } flex items-center justify-center`}
                    >
                      {votes[currentPosition.name]?.id === candidate.id && (
                        <Check className='w-4 h-4 text-white' />
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className='space-y-4'>
              <button
                onClick={handleNextPosition}
                disabled={!votes[currentPosition.name]}
                className={`w-full py-4 rounded-lg font-semibold text-lg transition-colors ${
                  votes[currentPosition.name]
                    ? 'bg-[#034045] hover:bg-[#045a60] text-white'
                    : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                }`}
              >
                {currentPositionIndex < positions.length - 1
                  ? 'Next Position'
                  : 'Review Votes'}
              </button>

              <div className='text-center'>
                <button
                  onClick={handleSkipToReview}
                  className='text-[#034045] underline hover:text-[#045a60] transition-colors'
                >
                  Skip other Positions and Submit my Vote
                </button>
              </div>
            </div>
          </div>
        </div>
      </>
    );
  }

  return (
    <div className='px-4 md:px-30 py-8 bg-[#F8F8F8] p-4'>
      <div className='mx-auto'>
        <div className='flex items-center gap-4 mb-8'>
          <button
            onClick={handleBackToCasting}
            className='p-2 hover:bg-gray-100 rounded-lg transition-colors'
          >
            <ChevronLeft className='w-8 h-8 text-gray-900' />
          </button>
          <h1 className='text-[20px] font-semibold text-gray-900'>
            Review your votes
          </h1>
        </div>

        <div className='space-y-4 mb-8'>
          {positions.map((position) => (
            <div
              key={position.name}
              className='bg-[#D9D9D94D] rounded-lg p-6 border border-gray-200'
            >
              <div className='flex items-center justify-between'>
                <div>
                  <p className='text-sm text-gray-500 mb-1'>{position.name}</p>
                  <p className='text-xl font-bold text-gray-900'>
                    {votes[position.name]?.name || 'No selection'}
                  </p>
                </div>
              </div>

              {!votes[position.name] && (
                <button
                  onClick={() => {
                    const positionIndex = positions.findIndex(
                      (p) => p.name === position.name
                    );
                    setCurrentPositionIndex(positionIndex);
                    setCurrentStep('cast');
                  }}
                  className='mt-3 text-[#034045] hover:text-[#045a60] transition-colors text-sm underline'
                >
                  Select candidate
                </button>
              )}
            </div>
          ))}
        </div>

        {/* Vote Multiplier Section */}
        <div className='mb-6 p-4 bg-[#F3F7F6] rounded-lg border border-[#034045]/20'>
          <label htmlFor='vote-multiplier' className='block text-gray-800 font-medium mb-2'>
            Vote Multiplier
          </label>
          <div className='flex items-center gap-3'>
            <input
              id='vote-multiplier'
              type='number'
              min={1}
              value={multiplier}
              onChange={e => setMultiplier(Math.max(1, Number(e.target.value)))}
              className='w-24 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#034045] text-lg font-semibold text-gray-900 bg-white'
            />
            <span className='text-gray-700'>
              Each selected candidate will receive <span className='font-bold'>{multiplier}</span> vote{multiplier > 1 ? 's' : ''}.
            </span>
          </div>
        </div>

        <div className='space-y-4'>
          <button
            onClick={handleSubmitVotes}
            disabled={Object.keys(votes).length === 0}
            className={`w-full py-4 rounded-lg font-semibold text-lg transition-colors ${
              Object.keys(votes).length > 0
                ? 'bg-[#034045] hover:bg-[#045a60] text-white'
                : 'bg-gray-200 text-gray-400 cursor-not-allowed'
            }`}
          >
            Cast my votes
          </button>

          {/* Popups for open/closed contest simulation */}
          <VotersCode
            open={showVotersCode}
            onClose={handleVotersCodeClose}
            onSubmit={handleVotersCodeSubmit}
          />
          <OpenContestRegistration
            open={showOpenContestPopup}
            onClose={handleOpenContestClose}
            onGoogleVerify={handleOpenContestGoogleVerify}
          />

          <button
            onClick={handleBackToCasting}
            className='w-full py-4 rounded-lg font-semibold text-lg border-2 border-[#034045] text-[#034045] hover:bg-[#034045] hover:text-white transition-colors'
          >
            Continue Voting
          </button>
        </div>
      </div>
    </div>
  );
};

export default VotingFlow;
