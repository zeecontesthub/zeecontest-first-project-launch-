import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import backgroundImage from "../assets/Image.png";
import Logo from "../assets/Logo.png";
import {
  signInWithEmailAndPassword,
  GoogleAuthProvider,
  signInWithPopup,
} from "firebase/auth";
import { auth } from "../firebase";
import { Link, useNavigate } from "react-router-dom";
import { useUser } from "../context/UserContext";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false); // ✅ Loading state
  const { setUser, user } = useUser();

  const navigate = useNavigate();

  useEffect(() => {
    if (user) {
      navigate("/dashboard");
    }
  }, [user, navigate]);

  const handleLogin = async () => {
    if (!email || !password) {
      setError("Please enter both email and password");
      return;
    }
    setError("");
    setLoading(true);

    const loginPromise = signInWithEmailAndPassword(auth, email, password).then(
      async (result) => {
        const user = result.user;
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

        const data = await apiResult.json();
        setUser(data.user);

        navigate("/dashboard");
      }
    );

    toast.promise(loginPromise, {
      pending: "Logging in...",
      success: "Login successful 🎉",
      error: {
        render({ data }) {
          return data?.message || "Login failed ❌";
        },
      },
    });

    loginPromise.finally(() => setLoading(false));
  };

  const handleGoogleSignIn = async () => {
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
      {/* Left Section */}
      <div className="flex flex-col justify-start p-8 md:p-12 lg:px-16 lg:py-8 w-full md:w-1/2">
        {/* Logo */}
        <div className="mb-16 flex items-center justify-center">
          <img src={Logo} alt="ZeeContest Logo" className="w-48 h-auto" />
        </div>

        {/* Heading */}
        <div className="mb-10 text-left">
          <h2 className="text-xl text-gray-600">Login to your</h2>
          <h3 className="text-2xl font-bold text-gray-800">
            ZeeContest Account
          </h3>
        </div>

        {/* Email Field */}
        <div className="mb-6">
          <label className="block text-teal-800 font-medium mb-2">Email</label>
          <input
            type="email"
            value={email}
            placeholder="Enter your Email"
            onChange={(e) => setEmail(e.target.value)}
            className="w-full border border-gray-300 rounded-md p-3 focus:outline-none focus:ring-2 focus:ring-teal-500"
          />
        </div>

        {/* Password Field */}
        <div className="mb-6">
          <label className="block text-teal-800 font-medium mb-2">
            Password
          </label>
          <input
            type="password"
            value={password}
            placeholder="Enter your Password"
            onChange={(e) => setPassword(e.target.value)}
            className="w-full border border-gray-300 rounded-md p-3 focus:outline-none focus:ring-2 focus:ring-teal-500"
          />
        </div>

        {error && <p className="text-red-500 mb-4">{error}</p>}

        {/* Login Button */}
        <button
          onClick={handleLogin}
          disabled={loading}
          className={`w-full bg-teal-800 text-white font-medium py-3 px-4 rounded-md transition duration-300 mb-4 ${
            loading ? "opacity-60 cursor-not-allowed" : "hover:bg-teal-700"
          }`}
        >
          {loading ? "Logging in..." : "Login"}
        </button>

        {/* Forgot Password */}
        <div className="text-right mb-6">
          <a
            href="/forgot-password"
            className="text-teal-700 hover:underline text-sm"
          >
            Forgot password?
          </a>
        </div>

        {/* OR divider */}
        <div className="flex items-center w-full my-6">
          <hr className="flex-grow border-t border-gray-300" />
          <span className="mx-4 text-gray-500 font-medium">OR</span>
          <hr className="flex-grow border-t border-gray-300" />
        </div>

        {/* Google Button */}
        <div
          onClick={handleGoogleSignIn}
          className={`flex cursor-pointer items-center justify-center border-2 border-amber-600 text-gray-700 font-medium py-3 px-4 rounded-3xl transition duration-300 mb-4 ${
            loading ? "opacity-60 cursor-not-allowed" : "hover:bg-gray-100"
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
          <span>{loading ? "Signing in..." : "Sign in with Google"}</span>
        </div>

        {/* Login Redirect */}
        <div className="text-center">
          <span className="text-gray-600">Do not have an account? </span>
          <Link to="/register" className="text-orange-500 hover:underline">
            Register here
          </Link>
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

export default Login;
