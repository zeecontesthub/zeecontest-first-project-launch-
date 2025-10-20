import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Users, Clock } from "lucide-react";
import VoteIcon from "../../../assets/VoteIcon";

const getStatusBadge = (status) => {
  const baseClasses =
    "absolute top-4 right-4 px-3 py-1 rounded-full text-sm font-medium";
  switch (status) {
    case "ongoing":
      return `${baseClasses} bg-green-500 text-white`;
    case "upcoming":
      return `${baseClasses} bg-yellow-500 text-white`;
    case "completed":
      return `${baseClasses} bg-red-500 text-white`;
    default:
      return `${baseClasses} bg-gray-500 text-white`;
  }
};

const getButtonConfig = (status) => {
  const baseClasses =
    "w-full py-3 rounded-lg font-medium transition-all duration-200 cursor-pointer";
  switch (status) {
    case "ongoing":
      return {
        classes: `${baseClasses} bg-[#034045] hover:bg-[#045a60] text-white`,
        text: "Vote Now",
      };
    default:
      return {
        classes: `${baseClasses} bg-[#034045] hover:bg-[#045a60] text-white`,
        text: "View Details",
      };
  }
};

const ContestCard = ({
  contest,
  filteredContests,
  index,
  lastItemRef,
}) => {
  const navigate = useNavigate();
  const buttonConfig = getButtonConfig(contest.status);
  const isLastItem = filteredContests.length === index + 1;

  const allContestants =
    contest?.positions?.flatMap((pos) =>
      pos.contestants?.map((contestant) => ({
        ...contestant,
        position: pos?.name,
      }))
    ) || [];

  const totalContestants = allContestants.length;

  const getPositionTotalVotes = (pos, contest) => {
    if (!pos || !contest) return 0;

    if (contest.isClosedContest) {
      // closed: look at contest.closedContestVoters
      return (
        contest.closedContestVoters?.reduce((sum, voter) => {
          const count =
            voter.votedFor?.filter((v) => v.positionTitle === pos.name)
              .length || 0;
          return sum + count * (voter.multiplier || 1);
        }, 0) || 0
      );
    }

    // open: normal position.voters array
    return pos.voters?.reduce((sum, v) => sum + (v.multiplier || 1), 0) || 0;
  };

  const totalVotes = useMemo(
    () =>
      contest?.positions?.reduce(
        (sum, p) => sum + getPositionTotalVotes(p, contest),
        0
      ) || 0,
    [contest]
  );

  return (
    <div
      key={contest._id}
      ref={isLastItem ? lastItemRef : null}
      className="bg-[#84818133] rounded-xl overflow-hidden hover:shadow-xl transition-shadow duration-300"
    >
      {/* Contest Header */}
      <div className="relative bg-black h-48 flex items-center justify-center">
        <img
          src={contest.coverImageUrl}
          alt={contest.title}
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className={getStatusBadge(contest.status)}>
          {contest.status.charAt(0).toUpperCase() + contest.status.slice(1)}
        </div>
      </div>

      {/* Contest Details */}
      <div className="p-6">
        <h3 className="text-xl font-bold text-[#034045] mb-4">
          {contest.title}
        </h3>

        {/* Stats */}
        <div className="flex justify-between items-center mb-6 text-sm text-gray-600">
          <div className="flex items-center gap-2">
            <Users className="w-4 h-4 text-[#034045]" />
            <div>
              <div className="font-semibold text-[#034045]">
                {totalVotes || 0}
              </div>
              <div>Votes</div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <VoteIcon />
            <div>
              <div className="font-semibold text-[#034045]">
                {contest?.positions?.length || 0}
              </div>
              <div>Positions</div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4 text-[#034045]" />
            <div>
              <div className="font-semibold text-[#034045]">
                {totalContestants || 0}
              </div>
              <div>Contestants</div>
            </div>
          </div>
        </div>

        {/* Action Button */}
        <button
          className={buttonConfig.classes}
          onClick={() => navigate(`/contest-detail/${contest._id}`)}
        >
          {buttonConfig.text}
        </button>
      </div>
    </div>
  );
};

const ContestListing = ({ contests, loading, error, lastItemRef }) => {
  const [activeFilter, setActiveFilter] = useState("all contests");

  const filterTabs = [
    { name: "All Contests", count: contests.length },
    {
      name: "Ongoing",
      count: contests.filter((contest) => contest.status === "ongoing").length,
    },
    {
      name: "Upcoming",
      count: contests.filter((contest) => contest.status === "upcoming").length,
    },
    {
      name: "Completed",
      count: contests.filter((contest) => contest.status === "completed")
        .length,
    },
  ];

  // Filter contests based on active filter
  const filteredContests =
    activeFilter === "all contests"
      ? contests
      : contests.filter((contest) => contest.status === activeFilter);

  // Get status badge styling

  return (
    <div className="w-full mx-auto px-4 md:px-12 lg:px-30 py-8">
      {/* Filter Tabs */}
      <div className="flex flex-wrap gap-2 mb-8 border-b border-gray-200 pb-6">
        {filterTabs.map((tab) => (
          <button
            key={tab.name}
            onClick={() => setActiveFilter(tab?.name?.toLowerCase())}
            className={`flex items-center gap-2 px-6 py-3 rounded-full font-medium transition-all duration-200 cursor-pointer ${
              activeFilter === tab?.name?.toLowerCase()
                ? "bg-[#034045] text-white shadow-lg"
                : "bg-gray-200 text-gray-700 hover:bg-gray-300"
            }`}
          >
            {tab.name}
            <span
              className={`px-2 py-1 rounded-full text-xs ${
                activeFilter === tab?.name?.toLowerCase()
                  ? "bg-white/20 text-white"
                  : "bg-gray-400 text-white"
              }`}
            >
              {tab.count}
            </span>
          </button>
        ))}
      </div>

      {/* Contest Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredContests.length === 0 && !loading && (
          <p className="col-span-full text-center text-gray-500">
            No contests found.
          </p>
        )}

        {filteredContests.map((contest, index) => {
          return (
            <ContestCard
              key={contest._id}
              contest={contest}
              filteredContests={filteredContests}
              index={index}
              lastItemRef={lastItemRef}
            />
          );
        })}
      </div>

      {loading && <p className="text-center text-gray-500 mt-6">Loading...</p>}
      {error && <p className="text-center text-red-500 mt-6">{error}</p>}
    </div>
  );
};

export default ContestListing;
