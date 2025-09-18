import React, { useRef, useEffect } from "react";

const ContestActionConfirm = ({ open, onClose, action, onConfirm }) => {
  const modalRef = useRef(null);

  useEffect(() => {
    function handleClickOutside(event) {
      if (modalRef.current && !modalRef.current.contains(event.target)) {
        onClose();
      }
    }
    if (open) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [open, onClose]);

  if (!open) return null;

  let title = "";
  let message = "";
  if (action === "Start Contest") {
    title = "Start Contest";
    message = "Are you sure you want to start this contest? This action cannot be undone.";
  } else if (action === "Pause Contest") {
    title = "Pause Contest";
    message = "Are you sure you want to pause this contest? Voting will be temporarily halted.";
  } else if (action === "End Contest") {
    title = "End Contest";
    message = "Are you sure you want to end this contest? This will finalize results and cannot be undone.";
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-20">
      <div
        ref={modalRef}
        className="bg-white rounded-2xl shadow-xl p-6 w-full max-w-md mx-4 sm:mx-0"
        style={{ minWidth: "0", width: "100%", maxWidth: "400px" }}
      >
        <h2 className="text-lg font-bold mb-4 text-gray-900 text-center">{title}</h2>
        <p className="text-gray-700 mb-6 text-center">{message}</p>
        <div className="flex gap-3 justify-center">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg font-medium hover:bg-gray-300 transition-colors w-24"
          >
            No
          </button>
          <button
            onClick={onConfirm}
            className="px-4 py-2 bg-orange-500 text-white rounded-lg font-medium hover:bg-orange-600 transition-colors w-24"
          >
            Yes
          </button>
        </div>
      </div>
    </div>
  );
};

export default ContestActionConfirm;
