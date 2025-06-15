import React, { useState } from 'react'
import Logo from '../assets/Logo.png';
import backgroundImage from '../assets/fp2.png';
import { Link, useNavigate, useLocation } from 'react-router-dom';

const InputCode = () => {
  const [code, setCode] = useState('');
  const navigate = useNavigate();
  const location = useLocation();

  // Simulate code verification
  const verifyCode = (code) => {
    console.log('Verifying code:', code);
    // Here you would integrate with your backend to verify the code
    return code === '123456'; // For demo, accept '123456' as valid code
  };

  const handleSendCode = () => {
    if (!code) {
      alert('Please enter the code');
      return;
    }
    if (verifyCode(code)) {
      if (location.state && location.state.isSignup) {
        navigate('/role-selection');
      } else {
        navigate('/dashboard');
      }
    } else {
      alert('Invalid code. Please try again.');
    }
  };

  return (
    <div className="flex min-h-screen w-full bg-white">
      {/* Left Section - Code Input Form */}
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
            Enter the Code to Login
          </h2>
        </div>

        {/* Instruction Text */}
        <div className="mb-8">
          <p className="text-gray-700 text-left">
            Enter the six-digit code sent to your email to access your account
          </p>
        </div>

        {/* Code Input */}
        <div className="mb-10 text-left">
          <label htmlFor="code" className="block text-teal-800 font-medium mb-2">
            Code
          </label>
          <input
            type="text"
            id="code"
            value={code}
            onChange={(e) => setCode(e.target.value)}
            className="w-full border border-gray-300 rounded-md p-3 focus:outline-none focus:ring-2 focus:ring-teal-500"
            placeholder="Enter your code"
          />
        </div>

        {/* Send Button */}
        <div className="mb-8">
          <button
            onClick={handleSendCode}
            className="w-64 bg-teal-800 text-white font-medium py-3 px-4 rounded-md hover:bg-teal-700 transition duration-300"
          >
            Verify Code
          </button>
        </div>

        <div className=" pt-6 border-t border-gray-200 text-center">
          <p className="text-gray-600">
            Did not receive a code? Resend{' '}
            <Link to="" className="font-medium text-[#E67347] hover:text-blue-500">
              Code
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

export default InputCode
