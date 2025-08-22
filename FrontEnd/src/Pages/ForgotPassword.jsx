import React from 'react'
import { useState } from 'react';
import Logo from '../assets/Logo.png';
import backgroundImage from '../assets/fp1.png';
import { Link, useNavigate } from 'react-router-dom';

const ForgotPassword = () => {
  const navigate = useNavigate();

  const [email, setEmail] = useState('');

  const handleSendReset = () => {
    console.log('Password reset requested for:', email);
    // Handle password reset logic here
    navigate('/input-code');
  };

  return (
    <div className="flex min-h-screen w-full bg-white">
      {/* Left Section - Reset Form */}
      <div className="flex flex-col justify-start p-8 md:p-12 lg:p-16 w-full md:w-1/2">
        {/* Logo */}
        <div className="mb-5">
          <div className="flex items-center">
            <img src={Logo} alt="LeeContest Logo" className="mx-auto mb-10 mr-100 w-48 h-auto" />
          </div>
        </div>

        {/* Heading */}
        <div className="mb-8 text-left">
          <h2 className="text-xl font-bold text-teal-800">
            Reset your Password
          </h2>
        </div>

        {/* Instruction Text */}
        <div className="mb-8">
          <p className="text-gray-700 text-left">
            Enter the email associated with your account, and
            we'll send you a code to reset your password
          </p>
        </div>

        {/* Email Input */}
        <div className="mb-10 text-left">
          <label htmlFor="email" className="block text-teal-800 font-medium mb-2">
            Email
          </label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full border border-gray-300 rounded-md p-3 focus:outline-none focus:ring-2 focus:ring-teal-500"
            placeholder="Your email address"
          />
        </div>

        {/* Send Button */}
        <div className="mb-8">
          <button
            onClick={handleSendReset}
            className="w-64 bg-teal-800 text-white font-medium py-3 px-4 rounded-md hover:bg-teal-700 transition duration-300"
          >
            Send
          </button>
        </div>

        <div className=" pt-6 border-t border-gray-200 text-center">
          <p className="text-gray-600">
            Back to{' '}
            <Link to="/" className="font-medium text-[#E67347] hover:text-blue-500">
              Login
            </Link>
          </p>
        </div>
      </div>


      {/* Right Section - Image */}
      <div className="hidden md:block w-1/2 bg-gray-300">
        <div className="h-full w-full bg-contain bg-center bg-no-repeat" style={{ backgroundImage: `url(${backgroundImage})`, backgroundSize: 'cover', backgroundPosition: 'center' }}>
        </div>
      </div>
    </div>
  )
}

export default ForgotPassword
