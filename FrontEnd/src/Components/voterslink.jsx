import React, { useRef, useEffect, useState } from "react";

const VotersLink = ({ open, onClose, link }) => {
  const modalRef = useRef(null);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    function handleClickOutside(event) {
      if (modalRef.current && !modalRef.current.contains(event.target)) {
        onClose();
      }
    }
    if (open) {
      document.addEventListener("mousedown", handleClickOutside);
      setCopied(false); // Reset copied state when modal opens
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [open, onClose]);

  if (!open) return null;

  const handleCopy = () => {
    navigator.clipboard.writeText(link);
    setCopied(true);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div
        ref={modalRef}
        className="bg-white rounded-2xl shadow-xl p-6 w-full max-w-md mx-2 sm:mx-0 mb-500 sm:mb-150"
        style={{ minWidth: "0", width: "100%", maxWidth: "400px" }}
      >
        <h2 className="text-lg font-bold mb-4 text-gray-900 text-center">Share Voters Link</h2>
        <div className="mb-4">
          <input
            type="text"
            value={link}
            readOnly
            className="w-full px-3 py-2 border border-gray-300 rounded-lg text-gray-700 bg-gray-100"
          />
        </div>
        <div className="flex gap-3 justify-center">
          <button
            onClick={handleCopy}
            disabled={copied}
            className={`px-4 py-2 rounded-lg font-medium transition-colors w-32 ${copied ? "bg-gray-300 text-gray-500 cursor-not-allowed" : "bg-orange-500 text-white hover:bg-orange-600"}`}
          >
            {copied ? "Copied" : "Copy Link"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default VotersLink;
