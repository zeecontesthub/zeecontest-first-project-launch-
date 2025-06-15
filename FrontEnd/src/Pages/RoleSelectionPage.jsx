import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const RoleSelectionPage = () => {
  const [selectedRole, setSelectedRole] = useState(null);
  const navigate = useNavigate();

  const handleSelectRole = (role) => {
    setSelectedRole(role);
    console.log(`Role selected: ${role}`);
    // Save the role selection to localStorage or call backend API
    localStorage.setItem('userRole', role);
    localStorage.setItem('onboardingComplete', 'true');
    // Navigate to settings page with profile tab if role is organizer
    if (role === 'organizer') {
      navigate('/settings?tab=profile');
    }
    // If role is cheerleader, do not navigate anywhere
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-white p-8">
      <h2 className="text-3xl font-bold mb-6">Choose Your Role</h2>
      <p className="text-gray-700 mb-8 text-center">
        Please select whether you want to be an Organizer or a Cheerleader.
      </p>
      <div className="flex gap-8">
        <div
          className={`p-6 rounded-lg shadow-md text-center ${
            selectedRole === 'organizer' ? 'bg-teal-800 p-20 text-white' : 'bg-teal-800 p-20 text-white'
          }`}
        >
          <h3 className="text-xl font-semibold mb-2">Organizer</h3>
          <p>Create and manage exciting contests</p>
          <button
            className="mt-4 bg-white text-teal-800 font-semibold py-2 px-4 rounded hover:bg-teal-100"
            onClick={() => handleSelectRole('organizer')}
          >
            Create Account
          </button>
        </div>
        <div
          className={`p-6 rounded-lg shadow-md text-center ${
            selectedRole === 'cheerleader' ? 'bg-orange-500 p-20 text-white' : 'bg-orange-500 p-20 text-white'
          }`}
        >
          <h3 className="text-xl font-semibold mb-2">Cheerleader</h3>
          <p>Cast your votes and participate in the action</p>
          <button
            className="mt-4 bg-white text-orange-500 font-semibold py-2 px-4 rounded hover:bg-orange-100"
            onClick={() => handleSelectRole('cheerleader')}
          >
            Create Account
          </button>
        </div>
      </div>
    </div>
  );
};

export default RoleSelectionPage;
