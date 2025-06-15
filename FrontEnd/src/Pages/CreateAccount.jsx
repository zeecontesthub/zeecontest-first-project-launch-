import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import Logo from '../assets/Logo.png';
import backgroundImage from '../assets/Imagecre.png';

const CreateAccount = () => {
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  // Simulate sending a six-digit code to the user's email
  const sendCodeToEmail = (email) => {
    console.log(`Sending six-digit code to ${email}`);
    // Here you would integrate with your backend or email service
  };

  const handleSendCode = () => {
    if (!email) {
      setError('Please enter your email');
      return;
    }
    setError('');
    sendCodeToEmail(email);
    navigate('/input-code', { state: { email, isSignup: true } });
  };

  return (
    <div className="flex min-h-screen w-full bg-white">
      {/* Left Section */}
      <div className="flex flex-col justify-start p-8 md:p-12 lg:p-16 w-full md:w-1/2">
        {/* Logo */}
        <div className="mb-5">
          <div className="flex items-center">
            <img src={Logo} alt="LeeContest Logo" className="mx-auto mb-10 mr-100 w-48 h-auto" />
          </div>
        </div>

        {/* Create Account Heading */}
        <div className="mb-10 text-left">
          <h2 className="text-xl font-bold">
            <span className="text-teal-800">Create your</span>
          </h2>
          <h2 className="text-xl font-bold">
            <span className="text-orange-500">ZeeContest</span>
            <span className="text-teal-800"> Account</span>
          </h2>
        </div>

        {/* Email Input */}
        <div className="w-full mb-6 text-left">
          <div className="mb-6">
            <label htmlFor="email" className="block text-teal-800 font-medium mb-2">
              Email
            </label>
            <input
              type="email"
              id="email"
              value={email}
              placeholder="Enter your Email"
              onChange={(e) => setEmail(e.target.value)}
              className="w-full border border-gray-300 rounded-md p-3 focus:outline-none focus:ring-2 focus:ring-teal-500"
            />
            {error && <p className="text-red-500 mt-2">{error}</p>}
          </div>

          {/* Send Code Button */}
          <button
            onClick={handleSendCode}
            className="w-full bg-teal-800 text-white font-medium py-3 px-4 rounded-md hover:bg-teal-700 transition duration-300 mb-4"
          >
            Send Code
          </button>
        </div>

        {/* Terms Agreement */}
        <div className="text-sm text-gray-600 mt-auto">
          <p>
            By registering, you confirm you have read and agree to the{' '}
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
};

export default CreateAccount;
