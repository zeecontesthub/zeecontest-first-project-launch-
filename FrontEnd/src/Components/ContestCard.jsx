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
  };

  // Flatten all contestants from all positions

  const allContestants =
    contest?.positions?.flatMap((pos) =>
      pos.contestants?.map((contestant) => ({
        ...contestant,
        position: pos?.name,
      }))
    ) || [];

  const totalContestants = allContestants.length;

  return (
    <div className="bg-teal-900 rounded-lg overflow-hidden">
      {/* Contest Image */}
      <div className="h-48 overflow-hidden">
        <img
          src={contest?.coverImageUrl || PlaceHolderImage}
          alt={contest?.title}
          className="w-full h-full object-cover"
        />
      </div>

      {/* Contest Info */}
      <div className="p-4">
        <h3 className="text-white text-left text-lg font-bold mb-3">
          {contest?.title}
        </h3>

        {/* Stats and View Button */}
        <div className="flex justify-between items-center">
          <div>
            <p className="text-gray-400 text-xs">Votes</p>
            <p className="text-white font-bold">
              {contest?.voters?.length || 0}
            </p>
          </div>

          <div>
            <p className="text-gray-400 text-xs">Contestants</p>
            <p className="text-white font-bold">{totalContestants}</p>
          </div>

          <button
            className="bg-orange-500 hover:bg-orange-600 text-white px-6 py-2 rounded"
            onClick={() => handleViewClick()}
          >
            {contest?.status === "draft" ? "Edit" : "View"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ContestCard;
