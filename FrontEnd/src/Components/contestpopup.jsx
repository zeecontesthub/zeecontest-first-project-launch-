/* eslint-disable no-unused-vars */
import React from "react";
import { useState } from "react";
import { X, Target, Megaphone } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useUser } from "../context/UserContext";

const ContestPopup = ({ isOpen = true, onClose }) => {
  const { setCreateContest } = useUser();
  const navigate = useNavigate();

  const [selectedType, setSelectedType] = useState(null);

  const handleSpotlightClick = () => {
    setCreateContest([]);
    setSelectedType("spotlight");
    // console.log("Spotlight contest selected");
    navigate("/create-spotlight-contest");
  };

  const handleOpenSpotlightClick = () => {
    setSelectedType("open-spotlight");
    // console.log("Open Spotlight contest selected");
    // Handle open spotlight contest selection
  };

  const handleClose = () => {
    if (onClose) {
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-[#000000]/50 flex items-center justify-center z-50">
      <div className="bg-white rounded-2xl p-8 max-w-2xl w-full mx-4 relative">
        {/* Close Button */}
        <button
          onClick={handleClose}
          className="absolute top-6 right-6 text-gray-500 hover:text-gray-700 transition-colors"
        >
          <X className="h-6 w-6" />
        </button>

        {/* Header */}
        <div className="text-center mb-12">
          <h2 className="text-2xl font-bold text-gray-900">
            What contest are you creating today?
          </h2>
        </div>

        {/* Contest Type Options */}
        <div className="flex justify-center gap-12">
          {/* Spotlight Option */}
          <div
            className="flex flex-col items-center cursor-pointer group bg-white shadow-md rounded-lg p-4 mb-4 hover:bg-gray-50 transition-colors"
            onClick={handleSpotlightClick}
          >
            <div className="rounded-full bg-teal-800 p-4 mb-4">
              <Target className="h-8 w-8  text-white" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">Spotlight</h3>
            <p className="text-gray-600 text-center max-w-68">
              Contest where contestants are chosen by you
            </p>
          </div>

          {/* Open Spotlight Option */}
          {/* <div
                        className="flex flex-col items-center cursor-pointer group"
                        onClick={handleOpenSpotlightClick}
                    >
                        <div className="bg-orange-500 rounded-full p-6 mb-4 group-hover:bg-orange-400 transition-colors">
                            <Megaphone className="h-8 w-8 text-white" />
                        </div>
                        <h3 className="text-xl font-bold text-gray-900 mb-2">Open Spotlight</h3>
                        <p className="text-gray-600 text-center max-w-48">
                            Contest open for anyone to join and showcase their talent
                        </p>
                    </div> */}
        </div>
      </div>
    </div>
  );
};

export default ContestPopup;
