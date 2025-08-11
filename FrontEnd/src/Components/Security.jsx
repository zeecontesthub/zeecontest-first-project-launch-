import React from "react";

const Security = ({ isVoterRegistrationEnabled, onToggleVoterRegistration }) => {
  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          Security Settings
        </h3>
        <p className="text-sm text-gray-600 mb-4">
          Enable voter registration to require voters to register before the election begins.
        </p>
      </div>

      {/* Toggle Switch */}
      <div className="flex items-center text-left justify-between p-4 bg-gray-50 rounded-lg">
        <div>
          <label className="text-sm font-medium text-gray-700">
            Require Voter Registration
          </label>
          <p className="text-xs text-gray-500">
            Voters will need to provide their name and email before voting
          </p>
        </div>
        <label className="relative inline-flex items-center cursor-pointer">
          <input
            type="checkbox"
            checked={isVoterRegistrationEnabled}
            onChange={onToggleVoterRegistration}
            className="sr-only peer"
          />
          <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-orange-500 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-orange-500"></div>
        </label>
      </div>

      {/* Voter Registration Form Preview */}
      {isVoterRegistrationEnabled && (
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
