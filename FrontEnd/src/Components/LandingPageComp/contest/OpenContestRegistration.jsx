import React, { useState } from "react";

const OpenContestRegistration = ({ open, onClose, onGoogleVerify }) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [fullName, setFullName] = useState('');

  const handleVerifyClick = () => {
    if (isSubmitting || !fullName.trim()) return;

    console.log('[OpenContestRegistration] handleVerifyClick triggered');
    setIsSubmitting(true);

    // Call directly to stay in user interaction stack
    onGoogleVerify(fullName.trim())
      .then((res) => {
        console.log('[OpenContestRegistration] onGoogleVerify succeeded:', res);
        if (res?.success) {
          onClose();
        }
      })
      .catch((err) => {
        console.error('[OpenContestRegistration] Error during onGoogleVerify:', err);
      })
      .finally(() => {
        setIsSubmitting(false);
      });
  };

  if (!open) return null;

  return (
    <div className='fixed inset-0 z-50 flex items-center justify-center bg-black/50'>
      <div className='bg-white rounded-xl shadow-lg p-6 w-full max-w-sm relative mx-4'>
        <button
          type='button'
          className='absolute top-2 right-2 text-gray-500 hover:text-gray-700 text-xl font-bold'
          onClick={onClose}
          disabled={isSubmitting}
        >
          &times;
        </button>

        <h2 className='text-2xl font-bold mb-4 text-center text-[#034045]'>
          Enter Your Name
        </h2>
        <p className='text-gray-700 text-center mb-6'>
          Please provide your full name before verifying with Google.
        </p>

        <div className='space-y-4'>
          <input
            type='text'
            placeholder='Full Name'
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            className='w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#034045] outline-none'
            required
            disabled={isSubmitting}
          />

          <button
            type='button'
            onClick={handleVerifyClick}
            disabled={isSubmitting || !fullName.trim()}
            className={`w-full flex items-center justify-center gap-2 py-3 rounded-lg font-medium text-lg shadow transition-colors duration-200
            ${isSubmitting || !fullName.trim()
                ? 'bg-gray-400 cursor-not-allowed'
                : 'bg-[#4285F4] hover:bg-[#357ae8] text-white'
              }`}
          >
            {isSubmitting ? (
              <span className='animate-pulse'>Verifying…</span>
            ) : (
              <>
                <svg
                  width='24'
                  height='24'
                  viewBox='0 0 48 48'
                  className='inline-block mr-2'
                  fill='none'
                  xmlns='http://www.w3.org/2000/svg'
                >
                  <g clipPath='url(#clip0_17_40)'>
                    <path
                      d='M44.5 20H24V28.5H36.9C35.5 33.1 31.2 36 26 36C19.4 36 14 30.6 14 24C14 17.4 19.4 12 26 12C29.1 12 31.9 13.1 34 15L39.2 9.8C35.7 6.6 31.1 4.5 26 4.5C14.7 4.5 5.5 13.7 5.5 25C5.5 36.3 14.7 45.5 26 45.5C36.1 45.5 44.5 37.1 44.5 27C44.5 25.7 44.4 24.4 44.2 23.2L44.5 20Z'
                      fill='#FFC107'
                    />
                    <path
                      d='M6.3 14.7L13.1 19.2C15 15.2 20.1 12 26 12C29.1 12 31.9 13.1 34 15L39.2 9.8C35.7 6.6 31.1 4.5 26 4.5C18.2 4.5 11.3 9.7 8.3 16.3L6.3 14.7Z'
                      fill='#FF3D00'
                    />
                    <path
                      d='M26 45.5C31.1 45.5 35.7 43.4 39.2 40.2L32.8 35.2C30.8 36.6 28.5 37.5 26 37.5C20.9 37.5 16.5 34.1 15.1 29.5L6.2 35.3C9.2 41.9 16.1 45.5 26 45.5Z'
                      fill='#4CAF50'
                    />
                    <path
                      d='M44.5 27C44.5 25.7 44.4 24.4 44.2 23.2H24V28.5H36.9C36.3 30.5 34.9 32.2 32.8 33.5L39.2 38.5C42.7 35.5 44.5 31.7 44.5 27Z'
                      fill='#1976D2'
                    />
                  </g>
                  <defs>
                    <clipPath id='clip0_17_40'>
                      <rect width='48' height='48' fill='white' />
                    </clipPath>
                  </defs>
                </svg>
                Verify & Continue
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default OpenContestRegistration;
