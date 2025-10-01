import React, { useState } from "react";
import Logo from "../assets/Logo.png";
import backgroundImage from "../assets/fp1.png";
import { Link } from "react-router-dom";
import { sendPasswordResetEmail } from "firebase/auth";
import { auth } from "../firebase";
import { toast } from "react-toastify";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");

  const handleSendReset = async () => {
    if (!email) {
      toast.error("Please enter your email");
      return;
    }
    try {
      await sendPasswordResetEmail(auth, email);
      toast.success("Password reset email sent! Check your inbox.");
    } catch (err) {
      console.error("❌ Reset error:", err);
      toast.error(err.message);
    }
  };

  return (
    <div className="flex min-h-screen w-full bg-white">
      {/* Left Section */}
      <div className="flex flex-col justify-start p-8 md:p-12 lg:p-16 w-full md:w-1/2">
        {/* Logo */}
        <div className="mb-5 flex justify-center">
          <img src={Logo} alt="ZeeContest Logo" className="w-48 h-auto" />
        </div>

        {/* Heading */}
        <h2 className="text-xl font-bold text-teal-800 mb-6">
          Reset your Password
        </h2>

        <p className="text-gray-700 mb-6">
          Enter the email associated with your account, and we'll send you a
          link to reset your password.
        </p>

        {/* Email Input */}
        <div className="mb-6">
          <label className="block text-teal-800 font-medium mb-2">Email</label>
          <input
            type="email"
            value={email}
            placeholder="Your email address"
            onChange={(e) => setEmail(e.target.value)}
            className="w-full border border-gray-300 rounded-md p-3 focus:outline-none focus:ring-2 focus:ring-teal-500"
          />
        </div>

        {/* Send Button */}
        <button
          onClick={handleSendReset}
          className="w-64 bg-teal-800 text-white font-medium py-3 px-4 rounded-md hover:bg-teal-700 transition duration-300 mb-6"
        >
          Send Reset Link
        </button>

        {/* Back to Login */}
        <div className="text-center">
          <p className="text-gray-600">
            Back to{" "}
            <Link
              to="/login"
              className="font-medium text-[#E67347] hover:text-blue-500"
            >
              Login
            </Link>
          </p>
        </div>
      </div>

      {/* Right Section - Image */}
      <div className="hidden md:block w-1/2 bg-gray-300">
        <div
          className="h-full w-full bg-cover bg-center"
          style={{ backgroundImage: `url(${backgroundImage})` }}
        />
      </div>
    </div>
  );
};

export default ForgotPassword;
