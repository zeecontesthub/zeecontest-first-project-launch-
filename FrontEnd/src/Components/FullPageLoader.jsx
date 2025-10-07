import React from 'react';

const FullPageLoader = () => (
  <div className="fixed inset-0 z-50 flex items-center justify-center bg-white bg-opacity-80">
    <div className="flex flex-col items-center">
      <svg className="animate-spin h-12 w-12 text-orange-500 mb-4" viewBox="0 0 24 24">
        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z"></path>
      </svg>
      <span className="text-lg font-semibold text-orange-600">Loading...</span>
    </div>
  </div>
);

export default FullPageLoader;
