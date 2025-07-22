import React, { useState } from 'react';

const Withdrawal = () => {
  const [amount, setAmount] = useState('');
  const [isOpen, setIsOpen] = useState(true);

  // Dummy receiving account data - these could be props or fetched from context/api in real use
  const bankName = "Example Bank";
  const bankAccount = "1234567890";
  const nameOnAccount = "John Doe";

  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop with improved styling */}
      <div 
        className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4"
        onClick={() => setIsOpen(false)}
      >
        {/* Modal Container */}
        <div 
          className="bg-white rounded-2xl shadow-2xl w-full max-w-md mx-auto transform transition-all duration-300 ease-out"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="relative px-6 py-5 border-b border-gray-100">
            <h2 className="text-2xl font-bold text-gray-900 text-center">
              Withdraw Funds
            </h2>
            <button
              onClick={() => setIsOpen(false)}
              className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center rounded-full bg-gray-100 hover:bg-gray-200 text-gray-500 hover:text-gray-700 transition-all duration-200"
              aria-label="Close"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* Content */}
          <div className="px-6 py-6">
            {/* Amount Input Section */}
            <form className="mb-8">
              <div className="mb-6">
                <label 
                  htmlFor="amount" 
                  className="block text-sm font-semibold text-gray-700 mb-3"
                >
                  Amount to withdraw
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 text-lg font-medium">
                    ₦
                  </span>
                  <input
                    type="number"
                    id="amount"
                    name="amount"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    placeholder="0.00"
                    className="w-full pl-8 pr-4 py-4 text-lg font-medium border-2 border-gray-200 rounded-xl focus:border-green-500 focus:ring-0 transition-colors duration-200 bg-gray-50 focus:bg-white"
                  />
                </div>
              </div>
            </form>

            {/* Receiving Account Section */}
            <div className="bg-teal-900 rounded-xl p-6 border border-blue-100">
              <div className="flex items-center mb-4">
                <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center mr-3">
                  <svg className="w-4 h-4 text-black" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                  </svg>
                </div>
                <h3 className="text-lg font-bold text-white">Receiving Account</h3>
              </div>
              
              <div className="space-y-4">
                <div className="bg-white/70 backdrop-blur-sm rounded-lg p-4 border border-white/50">
                  <div className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">
                    Bank Name
                  </div>
                  <div className="text-gray-900 font-semibold">
                    {bankName}
                  </div>
                </div>
                
                <div className="bg-white/70 backdrop-blur-sm rounded-lg p-4 border border-white/50">
                  <div className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">
                    Account Number
                  </div>
                  <div className="text-gray-900 font-semibold font-mono">
                    {bankAccount}
                  </div>
                </div>
                
                <div className="bg-white/70 backdrop-blur-sm rounded-lg p-4 border border-white/50">
                  <div className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">
                    Account Holder
                  </div>
                  <div className="text-gray-900 font-semibold">
                    {nameOnAccount}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Footer/Actions */}
          <div className="px-6 py-4 bg-gray-50 rounded-b-2xl">
            <div className="flex space-x-3">
              <button
                onClick={() => setIsOpen(false)}
                className="flex-1 px-4 py-3 text-sm font-medium text-gray-700 bg-white border-2 border-gray-300 rounded-xl hover:bg-gray-50 hover:border-gray-400 transition-all duration-200"
              >
                Cancel
              </button>
              <button
                disabled={!amount || parseFloat(amount) <= 0}
                className={`flex-1 px-4 py-3 text-sm font-medium text-white rounded-xl transition-all duration-200 ${
                  !amount || parseFloat(amount) <= 0
                    ? 'bg-gray-400 cursor-not-allowed'
                    : 'bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 shadow-lg hover:shadow-xl'
                }`}
              >
                Confirm Withdrawal
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Withdrawal;