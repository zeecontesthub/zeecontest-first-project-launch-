/* eslint-disable no-unused-vars */
import React from 'react';
import { useState } from 'react';
import { X, Target, Megaphone } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useUser } from '../context/UserContext';

const ContestPopup = ({ isOpen = true, onClose }) => {
  const { setCreateContest } = useUser();
  const navigate = useNavigate();

  const [selectedType, setSelectedType] = useState(null);

  const handleSpotlightClick = () => {
    setCreateContest([]);
    setSelectedType('spotlight');
    // console.log("Spotlight contest selected");
    navigate('/create-spotlight-contest');
  };

  const handleOpenSpotlightClick = () => {
    setSelectedType('open-spotlight');
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
    <div className='fixed inset-0 bg-[#000000]/50 flex items-center justify-center z-50 p-4 sm:p-0'>
      <div className='bg-white rounded-2xl p-6 sm:p-8 max-w-2xl w-full relative'>
        {/* Close Button */}
        <button
          onClick={handleClose}
          className='absolute top-4 right-4 sm:top-6 sm:right-6 text-gray-600 hover:text-gray-700 transition-colors'
        >
          <X className='h-5 w-5 sm:h-6 sm:w-6' />
        </button>

        {/* Header */}
        <div className='text-center mb-8 sm:mb-12'>
          <h2 className='text-xl sm:text-2xl font-bold text-gray-900'>
            What contest are you creating today?
          </h2>
        </div>

        {/* Contest Type Options */}
        <div className='flex flex-col sm:flex-row justify-center items-center gap-6 sm:gap-12'>
          {/* Spotlight Option */}
          <div
            className='flex flex-col items-center cursor-pointer group bg-white shadow-md rounded-lg p-4 mb-4 hover:bg-gray-50 transition-colors w-full sm:w-auto'
            onClick={handleSpotlightClick}
          >
            <div className='rounded-full bg-teal-800 p-4 mb-4'>
              <Target className='h-8 w-8  text-white' />
            </div>
            <h3 className='text-xl font-bold text-gray-900 mb-2 text-center'>
              Spotlight
            </h3>
            <p className='text-gray-600 text-center max-w-68'>
              Contest where contestants are chosen by you
            </p>
          </div>

          {/* Open Spotlight Option */}
          {/* <div
            className="flex flex-col items-center cursor-pointer group bg-white shadow-md rounded-lg p-4 mb-4 hover:bg-gray-50 transition-colors w-full sm:w-auto"
            onClick={handleOpenSpotlightClick}
          >
            <div className="bg-orange-500 rounded-full p-4 sm:p-6 mb-4 group-hover:bg-orange-400 transition-colors">
              <Megaphone className="h-8 w-8 text-white" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2 text-center">Open Spotlight</h3>
            <p className="text-gray-600 text-center max-w-68">
              Contest open for anyone to join and showcase their talent
            </p>
          </div> */}
        </div>
      </div>
    </div>
  );
};

export default ContestPopup;
