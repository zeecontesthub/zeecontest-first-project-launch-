import React, { useState } from "react";

const VotersCode = ({ open, onClose, onSubmit }) => {
  const [email, setEmail] = useState("");
  const [code, setCode] = useState("");
  const [error, setError] = useState("");
  const [showToast, setShowToast] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const validateEmail = (email) => {
    // Simple email regex
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };

  const handleEmailChange = (e) => {
    setEmail(e.target.value);
    setError("");
  };

  const handleChange = (e) => {
    const value = e.target.value.replace(/\D/g, "");
    if (value.length <= 6) {
      setCode(value);
      setError("");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (isSubmitting) return; // Prevent multiple submissions
    setIsSubmitting(true);

    if (!validateEmail(email)) {
      setError("Please enter a valid email address.");
      setIsSubmitting(false);
      return;
    }

    if (code.length !== 6) {
      setError("Please enter a valid 6-digit code.");
      setIsSubmitting(false);
      return;
    }

    try {
      const data = await onSubmit({ email, code }); // <— await here!

      if (data?.success) {
        // Show toast notification
        setShowToast(true);
        setCode("");
        setEmail("");
        setError("");
        setTimeout(() => setIsSubmitting(false), 2500);
        setTimeout(() => onClose(), 2500);
      } else {
        setIsSubmitting(false);
      }
    } catch (err) {
      console.error(err);
      setIsSubmitting(false);
    }
  };

  if (!open) return null;

  return (
    <>
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#000000]/50">
        <div className="bg-white rounded-xl shadow-lg p-6 w-full max-w-sm relative">
          <button
            className="absolute top-2 right-2 text-gray-500 hover:text-gray-700 text-xl font-bold"
            onClick={onClose}
          >
            &times;
          </button>
          <h2 className="text-2xl font-bold mb-4 text-center text-[#034045]">
            Enter Email and Code{" "}
          </h2>
          <form
            onSubmit={handleSubmit}
            className="flex flex-col items-center w-full"
          >
            <input
              type="email"
              value={email}
              onChange={handleEmailChange}
              className="text-center text-base border border-gray-300 rounded-lg px-4 py-3 mb-3 w-full focus:outline-none focus:ring-2 focus:ring-[#034045]"
              placeholder="Email address"
              required
              autoFocus
            />
            <input
              type="text"
              inputMode="numeric"
              pattern="[0-9]*"
              maxLength={6}
              value={code}
              onChange={handleChange}
              className="text-center text-xl tracking-widest border border-gray-300 rounded-lg px-4 py-3 mb-3 w-full focus:outline-none focus:ring-2 focus:ring-[#034045]"
              placeholder="6-digit code"
            />
            {error && <p className="text-red-500 text-sm mb-2">{error}</p>}
            <button
              type="submit"
              className={`w-full ${
                isSubmitting ? "bg-gray-300" : "bg-[#034045]"
              } hover:bg-[#045a60] text-white py-3 rounded-lg font-medium transition-colors duration-200 cursor-pointer mt-2`}
              disabled={!validateEmail(email) || code.length !== 6}
            >
              {isSubmitting ? "Submitting..." : "Submit"}
            </button>
          </form>
          <p className="text-gray-500 text-xs mt-3 text-center">
            Check your email for the code.
          </p>
        </div>
      </div>
      {showToast && (
        <div className="fixed bottom-6 left-1/2 transform -translate-x-1/2 z-50 bg-[#034045] text-white px-6 py-3 rounded-lg shadow-lg text-center font-semibold">
          Vote has been casted successfully!
        </div>
      )}
    </>
  );
};

export default VotersCode;
