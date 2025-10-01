import React, { useState } from "react";
import { toast } from "react-toastify";
import backgroundImage from "../assets/Image.png";
import Logo from "../assets/Logo.png";
import {
  createUserWithEmailAndPassword,
  GoogleAuthProvider,
  signInWithPopup,
  signInWithEmailAndPassword,
} from "firebase/auth";
import { auth } from "../firebase";
import { useNavigate, Link } from "react-router-dom";
import { useUser } from "../context/UserContext";

const Signup = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const { setUser } = useUser();
  const navigate = useNavigate();

  const handleSignup = async () => {
    if (!name || !email || !password || !confirmPassword) {
      setError("All fields are required");
      return;
    }
    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }
    setError("");
    setLoading(true);

    try {
      await toast.promise(
        (async () => {
          try {
            // Try creating account
            const result = await createUserWithEmailAndPassword(
              auth,
              email,
              password
            );
            const user = result.user;
            const token = await user.getIdToken();

            // Save to backend
            await fetch("/api/users/save-user", {
              method: "POST",
              headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "application/json",
              },
              body: JSON.stringify({ name, email: user.email }),
            });

            setUser({ name, email: user.email });
            navigate("/dashboard");
          } catch (err) {
            // If account exists, try logging in
            if (err.code === "auth/email-already-in-use") {
              const result = await signInWithEmailAndPassword(
                auth,
                email,
                password
              );
              const user = result.user;
              const token = await user.getIdToken();

              await fetch("/api/users/save-user", {
                method: "POST",
                headers: {
                  Authorization: `Bearer ${token}`,
                  "Content-Type": "application/json",
                },
                body: JSON.stringify({
                  name: user.displayName || name,
                  email: user.email,
                }),
              });

              setUser({ name: user.displayName || name, email: user.email });
              navigate("/dashboard");
            } else {
              throw err;
            }
          }
        })(),
        {
          pending: "Creating your account...",
          success: "Welcome 🎉 Redirecting...",
          error: "Signup/Login failed. Please check your details.",
        }
      );
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignup = async () => {
    const provider = new GoogleAuthProvider();
    provider.setCustomParameters({
      prompt: "select_account", // ✅ always show the email picker
    });
    try {
      const result = await signInWithPopup(auth, provider).catch((err) =>
        console.log(err)
      );
      const user = result.user;
      // console.log("✅ Google login successful:", user);

      // Show toast notification on successful login
      toast.success("Login successful");

      const token = await user.getIdToken();

      const apiResult = await fetch("/api/users/save-user", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: user.displayName || "Anonymous",
          email: user.email,
        }),
      });

      const data = await apiResult.json(); // parse the JSON response

      // console.log(data);

      setUser(data.user); // Set user in context

      const role = data.user?.role; // optional chaining to avoid crashes

      navigate(role ? "/dashboard" : "/role-selection");
    } catch (error) {
      console.error("❌ Google sign-in error:", error);
    }
  };

  return (
    <div className="flex min-h-screen w-full bg-white">
      {/* Left Section - Signup Form */}
      <div className="flex flex-col justify-start p-8 md:p-12 lg:px-16 lg:py-8 w-full md:w-1/2">
        {/* Logo */}
        <div className="mb-10 flex items-center">
          <img
            src={Logo}
            alt="ZeeContest Logo"
            className="mx-auto mb-6 w-48 h-auto"
          />
        </div>

        {/* Heading */}
        <div className="mb-10 text-left">
          <h2 className="text-xl text-gray-600">Create your</h2>
          <h3 className="text-2xl font-bold text-gray-800">
            ZeeContest Account
          </h3>
        </div>

        {/* Signup Form */}
        <div className="w-full mb-6 text-left">
          {/* Name */}
          <div className="mb-4">
            <label className="block text-teal-800 font-medium mb-2">
              Full Name
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Enter your name"
              className="w-full border border-gray-300 rounded-md p-3 focus:outline-none focus:ring-2 focus:ring-teal-500"
            />
          </div>

          {/* Email */}
          <div className="mb-4">
            <label className="block text-teal-800 font-medium mb-2">
              Email
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
              className="w-full border border-gray-300 rounded-md p-3 focus:outline-none focus:ring-2 focus:ring-teal-500"
            />
          </div>

          {/* Password */}
          <div className="mb-4">
            <label className="block text-teal-800 font-medium mb-2">
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password"
              className="w-full border border-gray-300 rounded-md p-3 focus:outline-none focus:ring-2 focus:ring-teal-500"
            />
          </div>

          {/* Confirm Password */}
          <div className="mb-6">
            <label className="block text-teal-800 font-medium mb-2">
              Confirm Password
            </label>
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="Confirm your password"
              className="w-full border border-gray-300 rounded-md p-3 focus:outline-none focus:ring-2 focus:ring-teal-500"
            />
          </div>

          {error && <p className="text-red-500 mb-4">{error}</p>}

          {/* Signup Button */}
          <button
            onClick={handleSignup}
            disabled={loading}
            className={`w-full text-white font-medium py-3 px-4 rounded-md transition duration-300 mb-4 ${
              loading
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-teal-800 hover:bg-teal-700"
            }`}
          >
            {loading ? "Processing..." : "Sign Up"}
          </button>

          {/* OR Divider */}
          <div className="flex items-center w-full my-6">
            <hr className="flex-grow border-t border-gray-300" />
            <span className="mx-4 text-gray-500 font-medium">OR</span>
            <hr className="flex-grow border-t border-gray-300" />
          </div>

          {/* Google Signup */}
          <div
            onClick={!loading ? handleGoogleSignup : undefined}
            className={`flex cursor-pointer items-center justify-center border-2 border-amber-600 text-gray-700 font-medium py-3 px-4 rounded-3xl transition duration-300 mb-4 ${
              loading ? "opacity-50 cursor-not-allowed" : "hover:bg-gray-100"
            }`}
          >
            <svg
              className="w-5 h-5 mr-2"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 48 48"
            >
              <path
                fill="#EA4335"
                d="M24 9.5c3.35 0 6.24 1.14 8.56 3.01l6.38-6.38C34.26 2.31 29.46 0 24 0 14.63 0 6.94 5.97 3.77 14.19l7.41 5.76C12.5 13.12 17.74 9.5 24 9.5z"
              />
              <path
                fill="#4285F4"
                d="M46.1 24.5c0-1.53-.14-3-.4-4.42H24v8.39h12.4c-.53 2.85-2.16 5.26-4.55 6.88l7.24 5.63c4.24-3.91 6.74-9.66 6.74-16.48z"
              />
              <path
                fill="#FBBC05"
                d="M10.16 28.94A14.5 14.5 0 019.5 24c0-1.72.3-3.37.84-4.94L2.93 13.3A23.93 23.93 0 000 24c0 3.84.9 7.47 2.93 10.7l7.23-5.76z"
              />
              <path
                fill="#34A853"
                d="M24 48c6.48 0 11.9-2.13 15.87-5.77l-7.24-5.63c-2.02 1.36-4.6 2.16-8.63 2.16-6.27 0-11.51-3.62-13.81-8.94l-7.41 5.77C6.94 42.03 14.63 48 24 48z"
              />
              <path fill="none" d="M0 0h48v48H0z" />
            </svg>
            {loading ? "Please wait..." : "Sign up with Google"}
          </div>

          {/* Login Redirect */}
          <div className="text-center">
            <span className="text-gray-600">Already have an account? </span>
            <Link to="/" className="text-orange-500 hover:underline">
              Login here
            </Link>
          </div>
        </div>
      </div>

      {/* Right Section - Image */}
      <div className="hidden md:block w-1/2 bg-gray-300">
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

export default Signup;
