import React, { useState } from "react";

const VoterRegistration = () => {
  const [form, setForm] = useState({ name: "", email: "" });
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const contestName = "Your Contest Name"; // Replace with actual contest name or fetch it from props/context

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    // Simulate API call
    setTimeout(() => {
      setLoading(false);
      setSubmitted(true);
    }, 1200);
    // TODO: Replace with actual API call to send code to email
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-white to-indigo-50 p-4">
      <div className="bg-white rounded-2xl shadow-xl p-6 w-full max-w-md mx-auto">
        <h2 className="text-2xl font-bold text-center text-gray-900 mb-6">Voter Registration</h2>
        <p className="text-gray-700 text-center mb-4">
          Kindly Drop your Full Name and Email to be a registered voter for this {contestName ? contestName : "contest"}
        </p>
        {submitted ? (
          <div className="text-center">
            <h3 className="text-lg font-semibold text-green-700 mb-2">Registration Successful!</h3>
            <p className="text-gray-700 mb-4">A code has been sent to your email. Use it to access the voting interface.</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
              <input
                type="text"
                name="name"
                value={form.name}
                onChange={handleChange}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Enter your full name"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
              <input
                type="email"
                name="email"
                value={form.email}
                onChange={handleChange}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Enter your email"
              />
            </div>
            {error && <p className="text-red-600 text-sm">{error}</p>}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-orange-600 text-white rounded-lg font-semibold hover:bg-orange-700 transition-colors"
            >
              {loading ? "Registering..." : "Register"}
            </button>
          </form>
        )}
      </div>
    </div>
  );
};

export default VoterRegistration;
