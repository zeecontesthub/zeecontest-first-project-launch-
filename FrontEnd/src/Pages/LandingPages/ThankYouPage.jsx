import { CheckCircle, Instagram } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const ThankYouPage = () => {
  const navigate = useNavigate();

  const handleCreateContest = () => {
    navigate('/login');
  };

  const handleBrowseMoreContests = () => {
    navigate('/contests');
  };

  return (
    <div className='min-h-screen flex items-center justify-center bg-[#F8F8F8] p-4'>
      <div className='max-w-xl w-full bg-white shadow-xl rounded-2xl p-8 md:p-12 text-center'>
        {/* Success Icon */}
        <CheckCircle className='w-20 h-20 text-[#034045] mx-auto mb-6' />

        {/* Header */}
        <h2 className='text-[30px] font-bold text-gray-900 mb-3'>
          Thanks for Your Vote
        </h2>

        {/* Main Message */}
        <p className='text-gray-600 mb-8 text-lg'>
          We&apos;ve received your vote.
        </p>

        {/* Follow Section */}
        <div className='mb-8 bg-[#034045] background-transparent p-4 rounded-lg border border-gray-200'>
          <h2 className='text-gray-600 font-bold text-[20px] text-white text-base'>
            Follow ZeeContest on social media .
          </h2>
          <p className='mb-5 text-white'> Follow us and stand a chance to win amazing prizes and also get more info about other contests</p>
          <div className='flex justify-center'>
            <a href='https://www.instagram.com/zeecontest?utm_source=ig_web_button_share_sheet&igsh=ZDNlZDc0MzIxNw==' target='_blank' rel='noopener noreferrer' className='text-white hover:text-[#045a60] transition-colors'>
              <Instagram className='w-8 h-8' />
            </a>
          </div>
        </div>

        {/* TWO-COLUMN ACTION SECTION */}
        <div className='flex flex-col md:flex-row gap-4 mb-6'>
          <div className='flex-1 p-5 bg-[#D9D9D94D] rounded-xl border border-gray-200'>
            <h3 className='text-xl font-semibold text-gray-800 mb-2'>
              Create Your Own
            </h3>
            <p className='text-sm text-gray-600 mb-4'>
              Set up a new contest or election in just a few minutes.
            </p>
            <button
              onClick={handleCreateContest}
              className='w-full py-3 rounded-lg font-bold text-sm bg-[#034045] hover:bg-[#045a60] text-white transition-colors shadow-md'
            >
              Start a Contest
            </button>
          </div>

          <div className='flex-1 p-5 bg-[#F3F7F6] rounded-xl border border-[#034045]/20'>
            <h3 className='text-xl font-semibold text-gray-800 mb-2'>
              Join More Votes
            </h3>
            <p className='text-sm text-gray-600 mb-4'>
              Explore other contests and polls you can take part in.
            </p>
            <button
              onClick={handleBrowseMoreContests}
              className='w-full py-3 rounded-lg font-bold text-sm border border-[#034045] text-[#034045] hover:bg-[#034045]/10 transition-colors'
            >
              Browse Contests
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ThankYouPage;
