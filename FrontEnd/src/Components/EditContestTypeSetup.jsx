const EditContestTypeSetup = ({
  payment,
  isOpen,
  allowMultipleVotes,
  onPaymentChange,
  onStatusChange,
  onMultipleVotesChange,
}) => {
  return (
    <div className='space-y-6'>
      {/* Payment Setup */}
      <div className='bg-white rounded-lg shadow-sm p-4 sm:p-6'>
        <h2 className='text-lg sm:text-xl font-semibold text-gray-900 text-left mb-4'>
          Payment Setup
        </h2>
        <div className='space-y-4'>
          <div className='flex flex-col sm:flex-row sm:items-center space-y-3 sm:space-y-0 sm:space-x-6'>
            <span className='text-sm font-medium text-gray-700'>
              Is this a paid contest?
            </span>
            <div className='flex space-x-3'>
              <button
                type='button'
                onClick={() => onPaymentChange({ ...payment, isPaid: true })}
                className={`px-4 py-2 rounded-md font-medium text-sm transition-colors min-w-[60px] ${
                  payment?.isPaid === true
                    ? 'bg-orange-500 text-white'
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
              >
                Yes
              </button>
              <button
                type='button'
                onClick={() =>
                  onPaymentChange({ ...payment, isPaid: false, amount: '' })
                }
                className={`px-4 py-2 rounded-md font-medium text-sm transition-colors min-w-[60px] ${
                  payment?.isPaid === false
                    ? 'bg-orange-500 text-white'
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
              >
                No
              </button>
            </div>
          </div>

          {payment?.isPaid && (
            <div>
              <label className='block text-sm font-medium text-left text-gray-700 mb-2'>
                Amount each voter should pay
              </label>
              <input
                type='number'
                min='0'
                step='0.01'
                value={payment?.amount || ''}
                onChange={(e) =>
                  onPaymentChange({ ...payment, amount: e.target.value })
                }
                placeholder='Enter amount'
                className='w-full px-3 sm:px-4 py-2 sm:py-3 bg-gray-50 border border-gray-200 rounded-md focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none transition-colors text-sm sm:text-base'
              />
            </div>
          )}
        </div>
      </div>

      {/* Voters Setting */}
      <div className='bg-white rounded-lg shadow-sm p-4 sm:p-6'>
        <h2 className='text-lg sm:text-xl font-semibold text-gray-900 text-left mb-4'>
          Voters Setting
        </h2>
        <div className='flex flex-col sm:flex-row sm:items-center space-y-3 sm:space-y-0 sm:space-x-6'>
          <span className='text-sm font-medium text-gray-700'>
            Allow multiple votes
          </span>
          <div className='flex space-x-3'>
            <button
              type='button'
              onClick={() => onMultipleVotesChange(true)}
              className={`px-4 py-2 rounded-md font-medium text-sm transition-colors min-w-[60px] ${
                allowMultipleVotes === true
                  ? 'bg-orange-500 text-white'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              Yes
            </button>
            <button
              type='button'
              onClick={() => onMultipleVotesChange(false)}
              className={`px-4 py-2 rounded-md font-medium text-sm transition-colors min-w-[60px] ${
                allowMultipleVotes === false
                  ? 'bg-orange-500 text-white'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              No
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EditContestTypeSetup;
