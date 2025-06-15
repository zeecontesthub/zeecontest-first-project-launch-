import React from 'react';
import PropTypes from 'prop-types';

const ContestCard = ({ title, image, votes, contestants }) => {
  return (
    <div className="bg-teal-900 rounded-lg overflow-hidden">
      {/* Contest Image */}
      <div className="h-48 overflow-hidden">
        <img 
          src={image} 
          alt={title} 
          className="w-full h-full object-cover"
        />
      </div>
      
      {/* Contest Info */}
      <div className="p-4">
        <h3 className="text-white text-lg font-bold mb-3">{title}</h3>
        
        {/* Stats and View Button */}
        <div className="flex justify-between items-center">
          <div>
            <p className="text-gray-400 text-xs">Votes</p>
            <p className="text-white font-bold">{votes}</p>
          </div>
          
          <div>
            <p className="text-gray-400 text-xs">Contestants</p>
            <p className="text-white font-bold">{contestants}</p>
          </div>
          
          <button 
            className="bg-orange-500 hover:bg-orange-600 text-white px-6 py-2 rounded"
          >
            View
          </button>
        </div>
      </div>
    </div>
  );
};

ContestCard.propTypes = {
  title: PropTypes.string.isRequired,
  image: PropTypes.string.isRequired,
  votes: PropTypes.number.isRequired,
  contestants: PropTypes.number.isRequired
};

export default ContestCard;