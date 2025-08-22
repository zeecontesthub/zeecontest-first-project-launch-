import React, { useState } from 'react'
import backgroundImage from '../assets/fp3.png';
import Logo from '../assets/Logo.png';
import { Eye } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const PasswordReset = () => {
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const navigate = useNavigate();

  const handlePasswordReset = () => {
    if (newPassword !== confirmPassword) {
      alert('Passwords do not match');
      return;
    }
    console.log('Password reset to:', newPassword);
    // Add password reset logic here
    navigate('/');
  };

  return (
    <div className="flex min-h-screen w-full bg-white">
      {/* Left Section - Password Reset Form */}
      <div className="flex flex-col justify-start p-8 md:p-12 lg:p-16 w-full md:w-1/2">
        {/* Logo */}
        <div className="mb-16">
          <div className="flex items-center">
            <img src={Logo} alt="LeeContest Logo" className="mx-auto mb-10 mr-100 w-48 h-auto" />
          </div>
        </div>

        {/* Heading */}
        <div className="mb-10 text-left">
          <h2 className="text-xl text-gray-600">Reset your</h2>
          <h3 className="text-2xl font-bold text-gray-800">ZeeContest Password</h3>
        </div>

        {/* Password Reset Form */}
        <form
          className="w-full mb-6 text-left"
          onSubmit={(e) => {
            e.preventDefault();
            handlePasswordReset();
          }}
        >
          {/* New Password Field */}
          <div className="mb-6">
            <label htmlFor="newPassword" className="block text-teal-800 font-medium mb-2">
              New Password
            </label>
            <div className="relative">
              <input
                type={showNewPassword ? "text" : "password"}
                id="newPassword"
                value={newPassword}
                placeholder="Enter new password"
                onChange={(e) => setNewPassword(e.target.value)}
                className="w-full border border-gray-300 rounded-md p-3 focus:outline-none focus:ring-2 focus:ring-teal-500"
              />
              <button
                type="button"
                className="absolute inset-y-0 right-0 flex items-center px-3 text-gray-500"
                onClick={() => setShowNewPassword(prev => !prev)}
              >
                <Eye className="h-5 w-5" />
              </button>
            </div>
          </div>

          {/* Confirm Password Field */}
          <div className="mb-6">
            <label htmlFor="confirmPassword" className="block text-teal-800 font-medium mb-2">
              Confirm New Password
            </label>
            <div className="relative">
              <input
                type={showConfirmPassword ? "text" : "password"}
                id="confirmPassword"
                value={confirmPassword}
                placeholder="Re-enter new password"
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full border border-gray-300 rounded-md p-3 focus:outline-none focus:ring-2 focus:ring-teal-500"
              />
              <button
                type="button"
                className="absolute inset-y-0 right-0 flex items-center px-3 text-gray-500"
                onClick={() => setShowConfirmPassword(prev => !prev)}
              >
                <Eye className="h-5 w-5" />
              </button>
            </div>
          </div>

          {/* Reset Password Button */}
          <button
            type="submit"
            className="w-full bg-teal-800 text-white font-medium py-3 px-4 rounded-md hover:bg-teal-700 transition duration-300 mb-4"
          >
            Reset Password
          </button>
        </form>

        {/* Terms Agreement */}
        <div className="text-sm text-gray-600 mt-auto">
          <p>
            By resetting your password, you confirm you have read and agree to the{' '}
            <a href="#" className="text-orange-500 hover:underline">
              terms of use
            </a>{' '}
            and the{' '}
            <a href="#" className="text-orange-500 hover:underline">
              privacy policy
            </a>
            .
          </p>
        </div>
      </div>

      {/* Right Section - Image */}
      <div className="hidden md:block w-1/2 bg-gray-300">
        <div className="h-full w-full bg-contain bg-center bg-no-repeat" style={{ backgroundImage: `url(${backgroundImage})`, backgroundSize: 'cover', backgroundPosition: 'center' }}>
        </div>
      </div>
    </div>
  );
}

export default PasswordReset
