/* eslint-disable no-unused-vars */
import React from "react";

const Security = ({
  contestType = 'closed',
  onContestTypeChange,
  isVoterRegistrationEnabled,
  onToggleVoterRegistration,
}) => {
  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          Security Settings
        </h3>
        <p className="text-sm text-gray-600 mb-4">
          Choose the type of contest and configure voter security options.
        </p>
      </div>

      {/* Contest Type Selector */}
      <div className="flex items-center gap-6 p-4 bg-gray-50 rounded-lg">
        <div>
          <label className="text-sm font-medium text-gray-700 mb-1 block">
            Contest Type
          </label>
          <div className="flex gap-3 mt-1">
            <button
              type="button"
              className={`px-4 py-2 rounded-lg font-medium border transition-colors ${
                contestType === 'open'
                  ? 'bg-orange-500 text-white border-orange-500'
                  : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-100'
              }`}
              onClick={() => onContestTypeChange && onContestTypeChange('open')}
            >
              Open Contest
            </button>
            <button
              type="button"
              className={`px-4 py-2 rounded-lg font-medium border transition-colors ${
                contestType === 'closed'
                  ? 'bg-orange-500 text-white border-orange-500'
                  : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-100'
              }`}
              onClick={() => onContestTypeChange && onContestTypeChange('closed')}
            >
              Closed Contest
            </button>
          </div>
        </div>
      </div>

      {/* Open Contest Info */}
      {contestType === 'open' && (
        <div className="p-4 bg-green-50 border border-green-200 rounded-lg text-green-900">
          <p className="font-medium mb-2">Open Contest</p>
          <p className="text-sm mb-1">
            Voters do <span className="font-semibold">not</span> need to register in advance.
          </p>
          <p className="text-sm mb-1">
            Before casting their vote, voters will be required to verify their identity using their Google account.
          </p>
          <p className="text-xs text-green-700 mt-2">
            * Google authentication will be prompted before voting.
          </p>
        </div>
      )}

      {/* Closed Contest: Always show Voter Registration Form Preview, no toggle */}
      {contestType === 'closed' && (
        <div className="mt-6 p-6 text-left bg-white border border-gray-200 rounded-lg">
          <h4 className="text-md font-medium text-gray-900 mb-4">
            Voter Registration Form Preview
          </h4>
          <p className="text-sm text-gray-600 mb-4">
            This is the form that voters will need to fill out before they can vote:
          </p>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Full Name
              </label>
              <input
                type="text"
                placeholder="Enter your full name"
                disabled
                className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-50 text-gray-500 cursor-not-allowed"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Email Address
              </label>
              <input
                type="email"
                placeholder="Enter your email address"
                disabled
                className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-50 text-gray-500 cursor-not-allowed"
              />
            </div>
          </div>
          <p className="text-xs text-gray-500 mt-4">
            * This form will be shown to voters when they access the voters registration link
          </p>
        </div>
      )}
    </div>
  );
};

export default Security;
