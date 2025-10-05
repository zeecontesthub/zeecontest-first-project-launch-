import { useEffect, useState } from 'react';
import { useNavigate, useParams, useLocation } from 'react-router-dom';
import { ChevronLeft, Check, AlertTriangle } from 'lucide-react';
import axios from 'axios';
import VotersCode from '../../Components/LandingPageComp/contest/VotersCode';
import OpenContestRegistration from '../../Components/LandingPageComp/contest/OpenContestRegistration';
import { toast } from 'react-toastify';
import { GoogleAuthProvider, signInWithPopup } from 'firebase/auth';
import { auth } from '../../firebase';

const VotingFlow = () => {
  // Simulate contest type for demo: 'open' or 'closed'
  // const [contestType, setContestType] = useState("open"); // now stateful

  // Voting flow state
  const location = useLocation();
  const [currentStep, setCurrentStep] = useState('cast');
  const [currentPositionIndex, setCurrentPositionIndex] = useState(0);
  const [votes, setVotes] = useState([]);
  const [showVotersCode, setShowVotersCode] = useState(false);
  const [showOpenContestPopup, setShowOpenContestPopup] = useState(false);
  const [finalVotes, setFinalVotes] = useState({});
  const [multiplier, setMultiplier] = useState(1);

  const { contestId } = useParams();
  const [contest, setContest] = useState(null);
  const [countdown, setCountdown] = useState('');

  const navigate = useNavigate();

  useEffect(() => {
    if (!contest) return;

    // Build start date/time
    const startDate = new Date(contest.startDate);
    if (contest.startTime) {
      let hour = parseInt(contest.startTime.startTimeHour, 10);
      if (contest.startTime.startTimeAmPm === 'PM' && hour < 12) hour += 12;
      startDate.setHours(
        hour,
        parseInt(contest.startTime.startTimeMinute, 10),
        0,
        0
      );
    }

    // Build end date/time
    const endDate = new Date(contest.endDate);
    if (contest.endTime) {
      let hour = parseInt(contest.endTime.endTimeHour, 10);
      if (contest.endTime.endTimeAmPm === 'PM' && hour < 12) hour += 12;
      endDate.setHours(hour, parseInt(contest.endTime.endTimeMinute, 10), 0, 0);
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

  useEffect(() => {
    const fetchContest = async () => {
      try {
        const res = await axios.get(`/api/contest/${contestId}`);
        setContest(res.data.contest);
      } catch (err) {
        console.error('Failed to fetch contest:', err);
      }
    };
    if (contestId) fetchContest();
  }, [contestId]);

  // Dynamically pull positions from contest
  const positions = contest?.positions || [];
  // Position and candidate data
  // const positions = [
  //   {
  //     name: 'President',
  //     candidates: [
  //       { id: 1, name: 'James Williamson', avatar: null },
  //       { id: 2, name: 'Sarah Johnson', avatar: null },
  //       { id: 3, name: 'Michael Brown', avatar: null },
  //       { id: 4, name: 'Emily Davis', avatar: null },
  //       { id: 5, name: 'David Wilson', avatar: null },
  //     ],
  //   },
  //   {
  //     name: 'Vice-President',
  //     candidates: [
  //       { id: 6, name: 'Alice Cooper', avatar: null },
  //       { id: 7, name: 'Bob Miller', avatar: null },
  //       { id: 8, name: 'Carol White', avatar: null },
  //       { id: 9, name: 'Daniel Green', avatar: null },
  //       { id: 10, name: 'Eva Martinez', avatar: null },
  //     ],
  //   },
  //   {
  //     name: 'Secretary',
  //     candidates: [
  //       { id: 11, name: 'Frank Anderson', avatar: null },
  //       { id: 12, name: 'Grace Taylor', avatar: null },
  //       { id: 13, name: 'Henry Lee', avatar: null },
  //     ],
  //   },
  //   {
  //     name: 'PRO',
  //     candidates: [
  //       { id: 14, name: 'Kate Phillips', avatar: null },
  //       { id: 15, name: 'Liam Murphy', avatar: null },
  //       { id: 16, name: 'Maya Patel', avatar: null },
  //     ],
  //   },
  //   {
  //     name: 'Treasurer',
  //     candidates: [
  //       { id: 17, name: 'Olivia Scott', avatar: null },
  //       { id: 18, name: 'Paul Robinson', avatar: null },
  //       { id: 19, name: 'Quinn Adams', avatar: null },
  //     ],
  //   },
  // ];

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
          const candidateObj = positions[posIndex]?.contestants.find(
            (c) => String(c._id) === String(candidateId)
          );
          if (candidateObj) {
            setVotes((prev) => {
              const exists = prev.some(
                (v) =>
                  v.votedFor === candidateObj._id &&
                  v.positionTitle === positions[posIndex].name
              );
              if (exists) return prev; // do nothing if already added

              return [
                ...prev,
                {
                  votedFor: candidateObj._id,
                  positionTitle: positions[posIndex].name,
                  name: candidateObj.name,
                  image: candidateObj.image,
                },
              ];
            });
          }
        }, 0);
      }
    }
    // eslint-disable-next-line
  }, [location.search, contest]);

  const currentPosition = positions[currentPositionIndex];

  const handleCandidateSelect = (candidate) => {
    setVotes((prev) => {
      const posTitle = currentPosition.name;

      // Does this position already have a selected candidate?
      const exists = prev.some((v) => v.positionTitle === posTitle);

      if (exists) {
        // Update the existing entry
        return prev.map((v) =>
          v.positionTitle === posTitle
            ? {
                ...v,
                votedFor: candidate._id,
                name: candidate.name,
                image: candidate.image,
              }
            : v
        );
      }

      // Otherwise, add a new entry
      return [
        ...prev,
        {
          positionTitle: posTitle,
          votedFor: candidate._id,
          name: candidate.name,
          image: candidate.image,
        },
      ];
    });
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

  // const handleSubmitVotes = async () => {
  //   try {
  //     // await axios.post(`/api/contest/${contestId}/vote`, { votes });
  //     console.log(votes);
  //     alert("Votes submitted successfully!");
  //     navigate("/thank-you"); // redirect after voting
  //   } catch (err) {
  //     console.error("Failed to submit votes:", err);
  //     alert("Failed to submit votes, please try again.");
  //   }
  // };

  const handleSubmitVotes = () => {
    if (contest?.isClosedContest) {
      setShowVotersCode(true);
    } else {
      setShowOpenContestPopup(true);
    }
    setFinalVotes(votes);
  };

  const handleVotersCodeClose = () => {
    setShowVotersCode(false);
  };

  const handleOpenContestClose = () => {
    setShowOpenContestPopup(false);
  };

  // After successful vote submission (both open and closed), redirect to contest details
  const redirectToContestDetails = () => {
    navigate(`/vote/${contestId}/thank-you`);
  };

  // Update handleVotersCodeSubmit to redirect after success
  const handleVotersCodeSubmit = async (data) => {
    try {
      // if payment is required, collect payment first
      if (contest?.payment?.isPaid) {
        await payWithPaystack(
          data.email,
          contest.payment?.amount,
          multiplier,
          data
        );
        redirectToContestDetails();
        return { success: true };
      }

      // if no payment, just submit vote directly
      const result = await submitVote(data);
      if (result.success) {
        redirectToContestDetails();
        return { success: true };
      }
      return result;
    } catch (err) {
      toast.error(err.message || 'Unable to submit vote. Please try again.');
      return { success: false };
    }
  };
  // Update handleOpenContestGoogleVerify to redirect after success
  const handleOpenContestGoogleVerify = async () => {
    const provider = new GoogleAuthProvider();
    provider.setCustomParameters({ prompt: 'select_account' });
    try {
      // Google popup
      const result = await signInWithPopup(auth, provider);
      const user = result.user;
      const voterName = user.displayName || 'Anonymous';
      const voterEmail = user.email;
      const voteData = {
        voterName,
        voterEmail,
        multiplier,
        votedFor: finalVotes, // e.g. [{ positionTitle, votedFor }]
      };
      // Paid or free contest?
      if (contest?.payment?.isPaid) {
        await payWithPaystackOpen(
          voterEmail,
          contest.payment.amount,
          multiplier,
          voteData
        );
        redirectToContestDetails();
        return { success: true };
      } else {
        const result = await submitVoteOpen(voteData);
        if (result.success) {
          redirectToContestDetails();
          return { success: true };
        }
        return result;
      }
    } catch (err) {
      console.error(err);
      toast.error(err.message || 'Error verifying you');
      return { success: false };
    }
  };

  // ⬇️ Submit vote for CLOSED contests (used both after payment verification and for free votes)
  const submitVote = async (data) => {
    try {
      const res = await axios.post(
        `/api/contest/contests/${contestId}/addVerifyVote`,
        {
          email: data.email,
          code: data.code,
          votedFor: finalVotes,
          multiplier,
        }
      );
      if (res.data?.success) {
        toast.success('Vote submitted successfully!');
        return { success: true };
      } else {
        const message = res.data?.message || 'Something went wrong';
        toast.error(message);
        return { success: false, message };
      }
    } catch (error) {
      const message = axios.isAxiosError(error)
        ? error.response?.data?.message || 'Something went wrong'
        : 'Something went wrong';
      toast.error(message);
      return { success: false, message };
    }
  };

  const payWithPaystack = (email, amount, multiplier, voteData) => {
    return new Promise((resolve, reject) => {
      const handler = window.PaystackPop.setup({
        key: import.meta.env.VITE_PAYSTACK_PUBLIC_KEY,
        email,
        amount: amount * 100 * multiplier, // must be a number
        currency: 'NGN',
        // ⛔️ no async here
        callback: (response) => {
          verifyAndSubmit(response.reference, voteData, resolve, reject);
        },
        onClose: () => {
          toast.error('Payment popup closed.');
          reject(new Error('Payment popup closed'));
        },
      });
      handler.openIframe();
    });
  };

  async function verifyAndSubmit(reference, voteData, resolve, reject) {
    try {
      const verify = await axios.post('/api/contest/verify-payment', {
        reference,
      });
      if (!verify.data.success) {
        toast.error('❌ Payment could not be verified.');
        return reject(new Error('Payment verification failed'));
      }
      await submitVote(voteData);
      toast.success('✅ Payment verified & vote recorded!');
      resolve(true);
    } catch (err) {
      toast.error('Server verification failed');
      reject(err);
    }
  }

  // -------------------- Open Contest functions --------------------

  // Paystack payment
  const payWithPaystackOpen = (email, amount, multiplier, voteData) =>
    new Promise((resolve, reject) => {
      const handler = window.PaystackPop.setup({
        key: import.meta.env.VITE_PAYSTACK_PUBLIC_KEY,
        email,
        amount: amount * 100 * multiplier, // Paystack expects kobo
        currency: 'NGN',
        callback: (response) =>
          verifyAndSubmitOpen(response.reference, voteData, resolve, reject),
        onClose: () => {
          toast.error('Payment popup closed.');
          reject(new Error('Payment popup closed'));
        },
      });
      handler.openIframe();
    });

  // Verify payment server-side, then record vote
  async function verifyAndSubmitOpen(reference, voteData, resolve, reject) {
    try {
      const verify = await axios.post('/api/contest/verify-payment', {
        reference,
      });
      if (!verify.data.success) {
        toast.error('❌ Payment could not be verified.');
        return reject(new Error('Payment verification failed'));
      }
      await submitVoteOpen(voteData);
      toast.success('✅ Payment verified & vote recorded!');
      resolve(true);
    } catch (err) {
      toast.error('Server verification failed');
      reject(err);
    }
  }

  // Actual vote submission to your Express route
  async function submitVoteOpen(voteData) {
    try {
      const res = await axios.post(
        `/api/contest/contests/${contestId}/add-vote`,
        voteData
      );
      if (res.data?.success) {
        toast.success('Vote submitted successfully!');
        return { success: true };
      } else {
        const message = res.data?.message || 'Something went wrong';
        toast.error(message);
        return { success: false, message };
      }
    } catch (error) {
      const message = axios.isAxiosError(error)
        ? error.response?.data?.message || 'Something went wrong'
        : 'Something went wrong';
      toast.error(message);
      return { success: false, message };
    }
  }

  const startDate = new Date(contest?.startDate);
  if (contest?.startTime) {
    let hour = parseInt(contest.startTime.startTimeHour, 10);
    if (contest.startTime.startTimeAmPm === 'PM' && hour < 12) hour += 12;
    if (contest.startTime.startTimeAmPm === 'AM' && hour === 12) hour = 0;
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
    if (contest.endTime.endTimeAmPm === 'PM' && hour < 12) hour += 12;
    if (contest.endTime.endTimeAmPm === 'AM' && hour === 12) hour = 0;
    endDate.setHours(hour, parseInt(contest.endTime.endTimeMinute, 10), 0, 0);
  }

  const now = new Date();

  if (contest?.status === 'pause') {
    return (
      <div className='min-h-screen flex flex-col'>
        <div className='flex-1 w-full p-6 flex items-center justify-center'>
          <div className='text-center'>
            <AlertTriangle className='w-16 h-16 text-yellow-500 mx-auto mb-4' />
            <h2 className='text-2xl font-bold text-gray-900 mb-2'>
              Contestant Paused
            </h2>

            <div className='px-4 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition-colors'>
              <p className='text-xl font-semibold text-white'>{countdown}</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (now < startDate) {
    return (
      <div className='min-h-screen flex flex-col'>
        <div className='flex-1 w-full p-6 flex items-center justify-center'>
          <div className='text-center'>
            <AlertTriangle className='w-16 h-16 text-yellow-500 mx-auto mb-4' />
            <h2 className='text-2xl font-bold text-gray-900 mb-2'>
              Contestant Not Started
            </h2>
            <h3 className='text-lg font-bold text-gray-900 mb-2'>
              Contest <span className='text-orange-600 font-bold'>Starts</span>{' '}
              In
            </h3>
            <div className='px-4 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition-colors'>
              <p className='text-xl font-semibold text-white'>{countdown}</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (contest?.status === 'ended' || contest?.status === 'completed') {
    return (
      <div className='min-h-screen flex flex-col'>
        <div className='flex-1 w-full p-6 flex items-center justify-center'>
          <div className='text-center'>
            <AlertTriangle className='w-16 h-16 text-yellow-500 mx-auto mb-4' />
            <h2 className='text-2xl font-bold text-gray-900 mb-2'>
              Contest Ended
            </h2>
          </div>
        </div>
      </div>
    );
  }

  // =========================
  // Casting Screen
  // =========================
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
              <h2 className='text-[20px] font-semibold text-gray-900'>
                Cast your vote
              </h2>
            </div>
            {/* Contest Banner, Logo, Title, Description */}
            {contest && (
              <div className=' md:px-30 mb-8'>
                {/* Banner */}
                <div className='bg-black mb-4 relative overflow-hidden rounded-xl'>
                  <div className='h-48 flex items-center justify-center'>
                    {contest.coverImageUrl && (
                      <img
                        src={contest.coverImageUrl}
                        alt={contest.title}
                        className='absolute inset-0 w-full h-full object-cover opacity-80'
                      />
                    )}
                  </div>
                </div>
                {/* Logo, Title, Description */}
                <div className='flex gap-4 items-center mb-6'>
                  <div className='w-20 h-20 bg-black rounded-full border-4 border-[#034045] flex items-center justify-center relative overflow-hidden'>
                    {contest.contestLogoImageUrl && (
                      <img
                        src={contest.contestLogoImageUrl}
                        alt={contest.title}
                        className='absolute inset-0 w-full h-full object-cover rounded-full'
                      />
                    )}
                  </div>
                  <div className='flex-1'>
                    <h3 className='text-xl font-bold text-gray-900 mb-1 truncate'>
                      {contest.title}
                    </h3>
                    <p className='text-gray-600 text-base line-clamp-2'>
                      {contest.description}
                    </p>
                  </div>
                </div>
              </div>
            )}

            <div className='relative mb-2'>
              <select
                id='position-select'
                value={currentPositionIndex}
                onChange={(e) =>
                  setCurrentPositionIndex(Number(e.target.value))
                }
                className='block w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-[#034045] focus:border-[#034045] text-base text-white appearance-none pr-10 
               bg-[#034045] hover:bg-[#034045] transition-colors'
              >
                {positions.map((position, index) => (
                  <option key={position.name} value={index}>
                    {position.name} ({position?.contestants?.length || 0}{' '}
                    candidates)
                  </option>
                ))}
              </select>

              <div className='pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-white'>
                <svg
                  className='fill-current h-5 w-5'
                  xmlns='http://www.w3.org/2000/svg'
                  viewBox='0 0 20 20'
                >
                  <path d='M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z' />
                </svg>
              </div>
            </div>

            {/* Candidates List */}
            <div className='mb-8'>
              <p className='text-gray-700 mb-4'>
                Select the contestant you want to vote for
              </p>
              <div className='space-y-3'>
                {currentPosition?.contestants?.map((candidate) => (
                  <div
                    key={candidate._id}
                    onClick={() => handleCandidateSelect(candidate)}
                    className='flex items-center justify-between p-4 bg-[#D9D9D94D] rounded-lg border-2 border-gray-200 hover:border-gray-300 cursor-pointer transition-colors'
                  >
                    <div className='flex items-center gap-4'>
                      <div className='w-12 h-12 bg-black rounded-full overflow-hidden'>
                        {candidate.image ? (
                          <img
                            src={candidate.image}
                            alt={candidate.name}
                            className='w-full h-full object-cover'
                          />
                        ) : null}
                      </div>
                      <span className='text-lg font-medium text-gray-900'>
                        {candidate.name}
                      </span>
                    </div>
                    <div
                      className={`w-6 h-6 border-2 rounded ${
                        votes.find(
                          (vote) => vote.positionTitle === currentPosition.name
                        )?.votedFor === candidate._id
                          ? 'bg-[#034045] border-[#034045]'
                          : 'border-gray-300'
                      } flex items-center justify-center`}
                    >
                      {votes.find(
                        (vote) => vote.positionTitle === currentPosition.name
                      )?.votedFor === candidate._id && (
                        <Check className='w-4 h-4 text-white' />
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Next Button */}

            {/* Navigation */}
            <div className='space-y-4'>
              <button
                onClick={handleNextPosition}
                disabled={
                  !votes.find(
                    (vote) => vote.positionTitle === currentPosition?.name
                  )
                }
                className={`w-full py-4 rounded-lg font-semibold text-lg transition-colors ${
                  votes.find(
                    (vote) => vote.positionTitle === currentPosition.name
                  )
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

  // =========================
  // Review Screen
  // =========================
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
          <p className='text-2xl font-semibold text-gray-900'>
            Review your votes
          </p>
        </div>

        <div className='space-y-4 mb-8'>
          {positions.map((position) => (
            <div
              key={position._id || position.name}
              className='bg-[#D9D9D94D] rounded-lg p-6 border border-gray-200'
            >
              <div className='flex items-center justify-between'>
                <div>
                  <p className='text-sm text-gray-500 mb-1'>{position.name}</p>
                  <p className='text-xl font-bold text-gray-900'>
                    {votes.find((vote) => vote.positionTitle === position.name)
                      ?.name || 'No selection'}
                  </p>
                </div>
              </div>

              {!votes.find((vote) => vote.positionTitle === position.name) && (
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
        {contest?.allowMultipleVotes && (
          <div className='mb-6 p-4 bg-[#F3F7F6] rounded-lg border border-[#034045]/20'>
            <label
              htmlFor='vote-multiplier'
              className='block text-gray-800 font-medium mb-2'
            >
              Vote Multiplier
            </label>
            <div className='flex items-center gap-3'>
              <input
                id='vote-multiplier'
                type='number'
                min={1}
                value={multiplier}
                onChange={(e) =>
                  setMultiplier(Math.max(1, Number(e.target.value)))
                }
                className='w-24 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#034045] text-lg font-semibold text-gray-900 bg-white'
              />
              <span className='text-gray-700'>
                Each selected candidate will receive{' '}
                <span className='font-bold'>{multiplier}</span> vote
                {multiplier > 1 ? 's' : ''}.
              </span>
            </div>
          </div>
        )}

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
        </div>
      </div>
    </div>
  );
};

export default VotingFlow;
