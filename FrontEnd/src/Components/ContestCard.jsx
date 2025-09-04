<<<<<<< HEAD
import React from 'react';
import PropTypes from 'prop-types';
import { useNavigate } from 'react-router-dom';

const ContestCard = ({ title, image, votes, contestants }) => {
  const navigate = useNavigate();

  const handleViewClick = () => {
    navigate('/contest-details', { state: { id: title } });
=======
import { useNavigate } from "react-router-dom";
import { useUser } from "../context/UserContext";
import PlaceHolderImage from "../assets/Imagecre.png";

const ContestCard = ({ contest }) => {
  const navigate = useNavigate();

  // console.log(contest);

  const { setCreateContest } = useUser(); // get user from context

  const handleViewClick = () => {
    setCreateContest(contest);
    contest.status === "draft"
      ? navigate(`/create-spotlight-contest`)
      : navigate(`/contest-details/${contest?._id}`);
>>>>>>> oscar-branch
  };

  return (
    <div className="bg-teal-900 rounded-lg overflow-hidden">
      {/* Contest Image */}
      <div className="h-48 overflow-hidden">
<<<<<<< HEAD
        <img 
          src={image} 
          alt={title} 
          className="w-full h-full object-cover"
        />
      </div>
      
      {/* Contest Info */}
      <div className="p-4">
        <h3 className="text-white text-left text-lg font-bold mb-3">{title}</h3>
        
=======
        <img
          src={contest?.contestLogoImageUrl || PlaceHolderImage}
          alt={contest?.title}
          className="w-full h-full object-cover"
        />
      </div>

      {/* Contest Info */}
      <div className="p-4">
        <h3 className="text-white text-left text-lg font-bold mb-3">
          {contest?.title}
        </h3>

>>>>>>> oscar-branch
        {/* Stats and View Button */}
        <div className="flex justify-between items-center">
          <div>
            <p className="text-gray-400 text-xs">Votes</p>
<<<<<<< HEAD
            <p className="text-white font-bold">{votes}</p>
          </div>
          
          <div>
            <p className="text-gray-400 text-xs">Contestants</p>
            <p className="text-white font-bold">{contestants}</p>
          </div>
          
          <button 
            className="bg-orange-500 hover:bg-orange-600 text-white px-6 py-2 rounded"
            onClick={handleViewClick}
          >
            View
=======
            <p className="text-white font-bold">
              {contest?.voters?.length || 0}
            </p>
          </div>

          <div>
            <p className="text-gray-400 text-xs">Contestants</p>
            <p className="text-white font-bold">
              {contest?.participants?.length}
            </p>
          </div>

          <button
            className="bg-orange-500 hover:bg-orange-600 text-white px-6 py-2 rounded"
            onClick={() => handleViewClick()}
          >
            {contest?.status === "draft" ? "Edit" : "View"}
>>>>>>> oscar-branch
          </button>
        </div>
      </div>
    </div>
  );
};
<<<<<<< HEAD
ContestCard.propTypes = {
  title: PropTypes.string.isRequired,
  image: PropTypes.string.isRequired,
  votes: PropTypes.number.isRequired,
  contestants: PropTypes.number.isRequired
};

export default ContestCard;
=======

export default ContestCard;
>>>>>>> oscar-branch
