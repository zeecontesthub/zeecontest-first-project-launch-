import React, { useState } from 'react';

const RoleSelectionPopup = ({ isOpen = true, onClose }) => {
  const [selectedRole, setSelectedRole] = useState(null);

  const handleSelectRole = (role) => {
    setSelectedRole(role);
    console.log(`Role selected: ${role}`);
    // For testing, do not save the role selection to localStorage
    // localStorage.setItem('userRole', role);
    // localStorage.setItem('onboardingComplete', 'true');
    if (onClose) {
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-[#000000]/50 flex items-center justify-center z-50">
      <div className="bg-white rounded-2xl p-8 max-w-md w-full mx-4 relative">

        {/* Header */}
        <div className="text-center mb-8">
          <h2 className="text-2xl font-bold text-gray-900">
            Choose Your Role
          </h2>
          <p className="text-gray-600 mt-2">
            Please select whether you want to be an Organizer or a Cheerleader.
          </p>
        </div>

        {/* Role Options */}
        <div className="flex justify-around">
          <div
            className={`cursor-pointer p-6 rounded-lg shadow-md text-center ${
              selectedRole === 'organizer' ? 'bg-teal-800 text-white' : 'bg-white text-gray-900'
            }`}
            onClick={() => handleSelectRole('organizer')}
          >
            <h3 className="text-xl font-semibold mb-2">Organizer</h3>
            <p>Create and manage exciting contests</p>
          </div>

          <div
            className={`cursor-pointer p-6 rounded-lg shadow-md text-center ${
              selectedRole === 'cheerleader' ? 'bg-orange-500 text-white' : 'bg-white text-gray-900'
            }`}
            onClick={() => handleSelectRole('cheerleader')}
          >
            <h3 className="text-xl font-semibold mb-2">Cheerleader</h3>
            <p>Cast your votes and participate in the action</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RoleSelectionPopup;
