import PropTypes from "prop-types";
import { useNavigate } from "react-router-dom";

const ContestantCard = ({ name, image, votes, position, contestantId, contestId }) => {
  const navigate = useNavigate();

  const handleViewClick = () => {
    navigate(`/contestantdetails/${position}/${contestantId}/${contestId}`);
  };

  return (
    <div className="bg-teal-900 rounded-lg overflow-hidden max-w-xs">
      {/* Contestant Image or Avatar */}
      <div className="h-48 overflow-hidden flex items-center justify-center text-6xl bg-gray-800">
        {image ? (
          <img src={image} alt={name} className="w-full h-full object-cover" />
        ) : (
          <span>{name}</span>
        )}
      </div>

      {/* Contestant Info */}
      <div className="p-4">
        <h3 className="text-white text-left text-lg font-bold mb-3">{name}</h3>
        <p className="text-gray-400 text-xs mb-2">{position}</p>
        {/* Votes and View Details Button */}
        <div className="flex justify-between items-center">
          <div>
            <p className="text-gray-400 text-xs">Votes</p>
            <p className="text-white font-bold">{votes}</p>
          </div>

          <button
            className="bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded"
            onClick={handleViewClick}
          >
            View Details
          </button>
        </div>
      </div>
    </div>
  );
};

ContestantCard.propTypes = {
  name: PropTypes.string.isRequired,
  image: PropTypes.string.isRequired,
  votes: PropTypes.number.isRequired,
  position: PropTypes.string.isRequired,
};

export default ContestantCard;
