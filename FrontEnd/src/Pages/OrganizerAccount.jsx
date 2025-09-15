import React from "react";
import { useState } from "react";
import { Eye } from "lucide-react";
import Logo from "../assets/Logo.png";
import backgroundImage from "../assets/Image-1.png";
import { useNavigate } from "react-router-dom";

const OrganizerAccount = () => {
  const [formData, setFormData] = useState({
    organizationName: "",
    organizationEmail: "",
    password: "",
    confirmPassword: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = () => {
    // Handle form submission logic here
    console.log("Form submitted:", formData);
    navigate("/");
  };
  return (
    <div className="flex min-h-screen w-full bg-white">
      {/* Left Section - Form */}
      <div className="flex flex-col justify-start p-8 md:p-12 lg:p-16 w-full md:w-1/2">
        {/* Logo */}
        <div className="mb-8">
          <div className="flex items-center">
            <img
              src={Logo}
              alt="LeeContest Logo"
              className="mx-auto mb-10 mr-100 w-48 h-auto"
            />
          </div>
        </div>

        {/* Heading */}
        <div className="mb-8 text-left">
          <h2 className="text-xl text-gray-600">Create your</h2>
          <h3 className="text-2xl font-bold text-gray-800">
            ZeeContest Organizer Account
          </h3>
        </div>

        {/* Registration Fields */}
        <div className="w-full text-left">
          {/* Organization Name */}
          <div className="mb-6">
            <label
              htmlFor="organizationName"
              className="block text-teal-800 font-medium mb-2"
            >
              Name of Organization
            </label>
            <input
              type="text"
              id="organizationName"
              name="organizationName"
              value={formData.organizationName}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-md p-3 focus:outline-none focus:ring-2 focus:ring-teal-500"
            />
          </div>

          {/* Organization Email */}
          <div className="mb-6">
            <label
              htmlFor="organizationEmail"
              className="block text-teal-800 font-medium mb-2"
            >
              Organization Email
            </label>
            <input
              type="email"
              id="organizationEmail"
              name="organizationEmail"
              value={formData.organizationEmail}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-md p-3 focus:outline-none focus:ring-2 focus:ring-teal-500"
            />
          </div>

          {/* Password */}
          <div className="mb-6">
            <label
              htmlFor="password"
              className="block text-teal-800 font-medium mb-2"
            >
              Password
            </label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                id="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded-md p-3 focus:outline-none focus:ring-2 focus:ring-teal-500"
              />
              <button
                type="button"
                className="absolute inset-y-0 right-0 flex items-center px-3 text-gray-500"
                onClick={() => setShowPassword((prev) => !prev)}
              >
                <Eye className="h-5 w-5" />
              </button>
            </div>
          </div>

          {/* Confirm Password */}
          <div className="mb-8">
            <label
              htmlFor="confirmPassword"
              className="block text-teal-800 font-medium mb-2"
            >
              Re-Enter Password
            </label>
            <div className="relative">
              <input
                type={showConfirmPassword ? "text" : "password"}
                id="confirmPassword"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded-md p-3 focus:outline-none focus:ring-2 focus:ring-teal-500"
              />
              <button
                type="button"
                className="absolute inset-y-0 right-0 flex items-center px-3 text-gray-500"
                onClick={() => setShowConfirmPassword((prev) => !prev)}
              >
                <Eye className="h-5 w-5" />
              </button>
            </div>
          </div>

          {/* Submit Button */}
          <button
            onClick={handleSubmit}
            className="w-full bg-teal-800 text-white font-medium py-3 px-4 rounded-md hover:bg-teal-700 transition duration-300"
          >
            Create Account
          </button>
        </div>

        {/* Terms Agreement */}
        <div className="text-sm text-gray-600 mt-8">
          <p>
            By registering, you confirm you have read and agree to the{" "}
            <a href="#" className="text-orange-500 hover:underline">
              terms of use
            </a>{" "}
            and the{" "}
            <a href="#" className="text-orange-500 hover:underline">
              privacy policy
            </a>
            .
          </p>
        </div>
      </div>

      {/* Right Section - Image */}
      <div className="hidden md:block w-1/2 ">
        <div
          className="h-full w-full bg-contain bg-center bg-no-repeat"
          style={{
            backgroundImage: `url(${backgroundImage})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        ></div>
      </div>
    </div>
  );
};

export default OrganizerAccount;
