<<<<<<< HEAD
<<<<<<< HEAD
import React from 'react';
import PropTypes from 'prop-types';
import { useNavigate } from 'react-router-dom';
=======
import { useNavigate } from "react-router-dom";
import { useUser } from "../context/UserContext";
import PlaceHolderImage from "../assets/Imagecre.png";
>>>>>>> 4cb84f74b69a8693bca6b47fe8eeddbf07295aa8

const ContestCard = ({ contest }) => {
  const navigate = useNavigate();

  // console.log(contest);

  const { setCreateContest } = useUser(); // get user from context

  const handleViewClick = () => {
<<<<<<< HEAD
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
=======
>>>>>>> 4cb84f74b69a8693bca6b47fe8eeddbf07295aa8
    setCreateContest(contest);
    contest.status === "draft"
      ? navigate(`/create-spotlight-contest`)
      : navigate(`/contest-details/${contest?._id}`);
<<<<<<< HEAD
>>>>>>> oscar-branch
=======
>>>>>>> 4cb84f74b69a8693bca6b47fe8eeddbf07295aa8
  };

  return (
    <div className="bg-teal-900 rounded-lg overflow-hidden">
      {/* Contest Image */}
      <div className="h-48 overflow-hidden">
<<<<<<< HEAD
<<<<<<< HEAD
        <img 
          src={image} 
          alt={title} 
=======
        <img
          src={contest?.contestLogoImageUrl || PlaceHolderImage}
          alt={contest?.title}
>>>>>>> 4cb84f74b69a8693bca6b47fe8eeddbf07295aa8
          className="w-full h-full object-cover"
        />
      </div>

      {/* Contest Info */}
      <div className="p-4">
<<<<<<< HEAD
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
=======
>>>>>>> 4cb84f74b69a8693bca6b47fe8eeddbf07295aa8
        <h3 className="text-white text-left text-lg font-bold mb-3">
          {contest?.title}
        </h3>

<<<<<<< HEAD
>>>>>>> oscar-branch
=======
>>>>>>> 4cb84f74b69a8693bca6b47fe8eeddbf07295aa8
        {/* Stats and View Button */}
        <div className="flex justify-between items-center">
          <div>
            <p className="text-gray-400 text-xs">Votes</p>
<<<<<<< HEAD
<<<<<<< HEAD
            <p className="text-white font-bold">{votes}</p>
=======
            <p className="text-white font-bold">
              {contest?.voters?.length || 0}
            </p>
>>>>>>> 4cb84f74b69a8693bca6b47fe8eeddbf07295aa8
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
<<<<<<< HEAD
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
=======
            {contest?.status === "draft" ? "Edit" : "View"}
>>>>>>> 4cb84f74b69a8693bca6b47fe8eeddbf07295aa8
          </button>
        </div>
      </div>
    </div>
  );
};
<<<<<<< HEAD
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
=======

export default ContestCard;
>>>>>>> 4cb84f74b69a8693bca6b47fe8eeddbf07295aa8
