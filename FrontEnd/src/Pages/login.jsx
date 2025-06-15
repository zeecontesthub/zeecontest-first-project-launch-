import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import backgroundImage from '../assets/Image.png';
import Logo from '../assets/Logo.png';

const Login = () => {
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  // Simulate sending a six-digit code to the user's email
  const sendCodeToEmail = (email) => {
    console.log(`Sending six-digit code to ${email}`);
    // Here you would integrate with your backend or email service
  };

  const handleLogin = () => {
    if (!email) {
      setError('Please enter your email');
      return;
    }
    setError('');
    sendCodeToEmail(email);
    navigate('/input-code', { state: { email } });
  };

  return (
    <div className="flex min-h-screen w-full bg-white">
      {/* Left Section - Login Form */}
      <div className="flex flex-col justify-start p-8 md:p-12 lg:p-16 w-full md:w-1/2">
        {/* Logo */}
        <div className="mb-16">
          <div className="flex items-center">
            <img src={Logo} alt="LeeContest Logo" className="mx-auto mb-10 mr-100 w-48 h-auto" />
          </div>
        </div>

        {/* Heading */}
        <div className="mb-10 text-left">
          <h2 className="text-xl text-gray-600">Login to your</h2>
          <h3 className="text-2xl font-bold text-gray-800">ZeeContest Account</h3>
        </div>

        {/* Login Form */}
        <div className="w-full mb-6 text-left">
          {/* Email Field */}
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

          {/* Login Button */}
          <button
            onClick={handleLogin}
            className="w-full bg-teal-800 text-white font-medium py-3 px-4 rounded-md hover:bg-teal-700 transition duration-300 mb-4"
          >
            Send Code
          </button>

          {/* Register Link */}
          <div className="text-center mb-16">
            <span className="text-gray-600">Don't have an Account? </span>
            <a href="/create-account" className="text-orange-500 hover:underline">
              Register here
            </a>
          </div>
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

export default Login;
