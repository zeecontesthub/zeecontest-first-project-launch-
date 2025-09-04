import React, { useEffect, useState } from "react";
<<<<<<< HEAD
<<<<<<< HEAD
// import { Link, useNavigate } from "react-router-dom";
=======
import { toast } from "react-toastify";
>>>>>>> oscar-branch
=======
import { toast } from "react-toastify";
>>>>>>> 4cb84f74b69a8693bca6b47fe8eeddbf07295aa8
import backgroundImage from "../assets/Image.png";
import Logo from "../assets/Logo.png";
import { sendOTPLink } from "../actions/userActions";
import {
  GoogleAuthProvider,
  isSignInWithEmailLink,
  signInWithEmailLink,
  signInWithPopup,
} from "firebase/auth";
import { auth } from "../firebase";
import { useNavigate } from "react-router-dom";
<<<<<<< HEAD
<<<<<<< HEAD
=======
import { useUser } from "../context/UserContext";
>>>>>>> oscar-branch
=======
import { useUser } from "../context/UserContext";
>>>>>>> 4cb84f74b69a8693bca6b47fe8eeddbf07295aa8

const Login = () => {
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [infoMsg, setInfoMsg] = useState("");
<<<<<<< HEAD
<<<<<<< HEAD
=======
  const { setUser, user } = useUser();
>>>>>>> oscar-branch
=======
  const { setUser, user } = useUser();
>>>>>>> 4cb84f74b69a8693bca6b47fe8eeddbf07295aa8

  const navigate = useNavigate();

  useEffect(() => {
<<<<<<< HEAD
<<<<<<< HEAD
=======
=======
>>>>>>> 4cb84f74b69a8693bca6b47fe8eeddbf07295aa8
    if (user) {
      navigate("/dashboard");
    }
  }, [user, navigate]);

  useEffect(() => {
<<<<<<< HEAD
>>>>>>> oscar-branch
=======
>>>>>>> 4cb84f74b69a8693bca6b47fe8eeddbf07295aa8
    const email = window.localStorage.getItem("emailForSignIn");

    if (isSignInWithEmailLink(auth, window.location.href)) {
      if (!email) {
        // If email not found in localStorage, ask user to re-enter it (optional enhancement)
        alert("Email not found in localStorage.");
        return;
      }

      signInWithEmailLink(auth, email, window.location.href)
        .then(async (result) => {
          const user = result.user;
          console.log("✅ Logged in user:", user);

<<<<<<< HEAD
<<<<<<< HEAD
=======
          // Show toast notification on successful login
          toast.success("Login successful");

>>>>>>> oscar-branch
=======
          // Show toast notification on successful login
          toast.success("Login successful");

>>>>>>> 4cb84f74b69a8693bca6b47fe8eeddbf07295aa8
          // Get Firebase token
          const token = await user.getIdToken();

          // Save user to your backend

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

          const role = data.user?.role; // optional chaining to avoid crashes

          navigate(role ? "/dashboard" : "/role-selection");
        })
        .catch((err) => {
          console.error("❌ Error signing in", err);
        });
    }
  }, [navigate]);

  const handleLogin = () => {
    if (!email) {
      setError("Please enter your email");
      return;
    }
    setError("");
    sendOTPLink(email);
    setInfoMsg("We have sent you an email with a link to sign in");

    // navigate("/input-code", { state: { email } });
  };

  const handleGoogleSignIn = async () => {
    const provider = new GoogleAuthProvider();
    try {
      const result = await signInWithPopup(auth, provider).catch((err) =>
        console.log(err)
      );
      const user = result.user;
      // console.log("✅ Google login successful:", user);

<<<<<<< HEAD
<<<<<<< HEAD
=======
      // Show toast notification on successful login
      toast.success("Login successful");

>>>>>>> oscar-branch
=======
      // Show toast notification on successful login
      toast.success("Login successful");

>>>>>>> 4cb84f74b69a8693bca6b47fe8eeddbf07295aa8
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

<<<<<<< HEAD
<<<<<<< HEAD
=======
      setUser(data.user); // Set user in context

>>>>>>> oscar-branch
=======
      setUser(data.user); // Set user in context

>>>>>>> 4cb84f74b69a8693bca6b47fe8eeddbf07295aa8
      const role = data.user?.role; // optional chaining to avoid crashes

      navigate(role ? "/dashboard" : "/role-selection");
    } catch (error) {
      console.error("❌ Google sign-in error:", error);
    }
  };

  return (
    <div className="flex min-h-screen w-full bg-white">
      {/* Left Section - Login Form */}
      <div className="flex flex-col justify-start p-8 md:p-12 lg:px-16 lg:py-8 w-full md:w-1/2">
        {/* Logo */}
        <div className="mb-16">
          <div className="flex items-center">
            <img
              src={Logo}
              alt="LeeContest Logo"
              className="mx-auto mb-10 mr-100 w-48 h-auto"
            />
          </div>
        </div>

        {/* Heading */}
        <div className="mb-10 text-left">
          <h2 className="text-xl text-gray-600">Login to your</h2>
          <h3 className="text-2xl font-bold text-gray-800">
            ZeeContest Account
          </h3>
        </div>

        {/* Login Form */}
        <div className="w-full mb-6 text-left">
          {/* Email Field */}
          <div className="mb-6">
            <label
              htmlFor="email"
              className="block text-teal-800 font-medium mb-2"
            >
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
            Send Link
          </button>

          {/* show info msg */}
          {infoMsg !== "" && (
            <div className="text-green-500 font-semibold text-md place-self-center mb-4">
              {infoMsg}
            </div>
          )}

          <div className="flex items-center w-full my-6">
            <hr className="flex-grow border-t border-gray-300" />
            <span className="mx-4 text-gray-500 font-medium">OR</span>
            <hr className="flex-grow border-t border-gray-300" />
          </div>

          {/* google button */}
          <div
            onClick={handleGoogleSignIn}
            className="flex cursor-pointer items-center justify-center place-self-center border-2 border-amber-600 text-gray-700 font-medium py-3 px-4 rounded-3xl hover:bg-gray-100 transition duration-300 mb-4"
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
            Sign in with Google
          </div>

          {/* Register Link
          <div className="text-center mb-16">
            <span className="text-gray-600">Don't have an Account? </span>
            <a
              href="/create-account"
              className="text-orange-500 hover:underline"
            >
              Register here
            </a>
          </div> */}
        </div>

        {/* Terms Agreement */}
        <div className="text-sm text-gray-600 mt-auto">
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

export default Login;
