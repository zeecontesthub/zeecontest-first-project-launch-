const VotingPositionsSection = ({
  activePosition,
  onPositionChange,
  contest,
}) => {
  // const positions = [
  //   {
  //     name: "President",
  //     candidates: 8,
  //     votes: 1250,
  //     isActive: true,
  //   },
  //   {
  //     name: "Vice-President",
  //     candidates: 6,
  //     votes: 890,
  //     isActive: false,
  //   },
  //   {
  //     name: "Secretary",
  //     candidates: 5,
  //     votes: 675,
  //     isActive: false,
  //   },
  //   {
  //     name: "PRO",
  //     candidates: 4,
  //     votes: 542,
  //     isActive: false,
  //   },
  //   {
  //     name: "Treasurer",
  //     candidates: 7,
  //     votes: 823,
  //     isActive: false,
  //   },
  // ];

  const getPositionColors = (position, isActive) => {
    if (isActive) {
      return "bg-[#034045] text-white";
    }
    return "bg-gray-200 text-gray-700 hover:bg-gray-300";
  };

  const getRankBadgeColor = (position) => {
    switch (position) {
      case 1:
        return "bg-[#034045] text-white";
      case 2:
        return "bg-orange-500 text-white";
      case 3:
        return "bg-yellow-600 text-white";
      case 4:
        return "bg-gray-400 text-white";
      case 5:
        return "bg-gray-300 text-gray-700";
      default:
        return "bg-gray-200 text-gray-700";
    }
  };

  const currentCandidates =
    contest?.positions?.find((pos) => pos.name === activePosition)
      ?.contestants || [];

  return (
    <div className="w-full mx-auto mt-6">
      <div className="flex overflow-x-auto gap-3 mb-8 shadow-sm p-4 rounded-xl">
        {contest?.positions.map((position) => (
          <button
            key={position.name}
            onClick={() => onPositionChange(position.name)}
            className={`flex-shrink-0 px-6 py-3 rounded-xl font-medium transition-all duration-200 cursor-pointer whitespace-nowrap ${getPositionColors(
              position.name,
              activePosition === position.name
            )}`}
          >
            <div className="font-semibold">{position.name}</div>

            {/* Show details on medium screens and up */}
            <div className="text-xs opacity-80 hidden md:block">
              {position?.contestants?.length} Candidates •{" "}
              {position?.voters?.length} votes
            </div>
          </button>
        ))}
      </div>

      <div className="bg-white rounded-xl shadow-sm overflow-hidden p-4 md:p-6">
        <div className="pl-0 py-4 md:p-6">
          <h2 className="text-2xl font-bold text-gray-900">
            {activePosition} Leaderboard
          </h2>
        </div>

        <div className="bg-white rounded-xl overflow-hidden p-0 md:p-6">
          <div>
            {currentCandidates.map((candidate, index) => {
              // Count votes for each candidate
              const votes =
                currentCandidates?.voters?.filter(
                  (voter) =>
                    voter.votedFor?.toString() === candidate._id?.toString()
                ).length || 0;

              return (
                <div
                  key={candidate._id}
                  className="p-4 md:p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between bg-[#D9D9D94D] hover:bg-gray-50 transition-colors duration-200 rounded-xl mb-4"
                >
                  <div className="flex items-center gap-2 md:gap-4">
                    <div
                      className={`w-10 h-10 md:w-12 md:h-12 rounded-full flex items-center justify-center font-bold text-sm md:text-lg ${getRankBadgeColor(
                        index + 1 // index can be used as "rank" if you sort them
                      )}`}
                    >
                      {index + 1}
                    </div>

                    <div className="w-10 h-10 md:w-12 md:h-12 bg-black rounded-full flex items-center justify-center overflow-hidden">
                      {candidate.image ? (
                        <img
                          src={candidate.image}
                          alt={candidate.name}
                          className="w-full h-full object-cover rounded-full"
                        />
                      ) : (
                        <span className="text-white text-xs">No Img</span>
                      )}
                    </div>

                    <div>
                      <h3 className="text-base md:text-lg font-semibold text-gray-900">
                        {candidate.name}
                      </h3>
                      <p className="text-gray-600 text-sm">{votes} Votes</p>
                    </div>
                  </div>

                  {index === 0 && (
                    <div className="mt-3 sm:mt-0 bg-[#00B25F] text-white px-4 md:px-6 py-2 rounded-[20px] font-medium text-sm">
                      Leading
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default VotingPositionsSection;
