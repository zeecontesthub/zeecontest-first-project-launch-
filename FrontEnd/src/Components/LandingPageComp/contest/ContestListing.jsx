import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Users, Clock } from "lucide-react";
import VoteIcon from "../../../assets/VoteIcon";

const getStatusBadge = (status) => {
  const baseClasses =
    "absolute top-4 right-4 px-4 py-1.5 rounded-full text-xs font-bold tracking-wider uppercase backdrop-blur-md shadow-lg border";
  switch (status) {
    case "ongoing":
      return `${baseClasses} bg-green-500/90 text-white border-green-400/50`;
    case "upcoming":
      return `${baseClasses} bg-yellow-500/90 text-white border-yellow-400/50`;
    case "completed":
      return `${baseClasses} bg-red-500/90 text-white border-red-400/50`;
    default:
      return `${baseClasses} bg-gray-500/90 text-white border-gray-400/50`;
  }
};

const getButtonConfig = (status) => {
  const baseClasses =
    "w-full py-3.5 rounded-xl font-bold transition-all duration-300 cursor-pointer overflow-hidden relative group/btn";
  switch (status) {
    case "ongoing":
      return {
        classes: `${baseClasses} bg-gradient-to-r from-[#034045] to-[#0a5a60] hover:from-[#045a60] hover:to-[#034045] text-white`,
        text: "Vote Now",
      };
    default:
      return {
        classes: `${baseClasses} bg-gray-100 hover:bg-gray-200 text-[#034045] border border-gray-200`,
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

  const totalContestants = contest.totalContestants !== undefined ? contest.totalContestants : allContestants.length;
  const positionCount = contest.positionCount !== undefined ? contest.positionCount : (contest?.positions?.length || 0);

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
    () => {
      if (contest.totalVotes !== undefined) return contest.totalVotes;
      return contest?.positions?.reduce(
        (sum, p) => sum + getPositionTotalVotes(p, contest),
        0
      ) || 0;
    },
    [contest]
  );

  return (
    <div
      key={contest._id}
      ref={isLastItem ? lastItemRef : null}
      className="group bg-white rounded-3xl overflow-hidden hover:shadow-[0_20px_40px_rgba(3,64,69,0.1)] hover:-translate-y-2 border border-gray-100 transition-all duration-500 flex flex-col h-full"
    >
      {/* Contest Header */}
      <div className="relative bg-gray-900 h-56 flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-gray-900/40 to-transparent z-10" />
        <img
          src={contest.coverImageUrl}
          alt={contest.title}
          className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
        />
        <div className={getStatusBadge(contest.status)}>
          {contest.status}
        </div>
      </div>

      {/* Contest Details */}
      <div className="p-6 md:p-8 flex flex-col flex-grow bg-gradient-to-b from-white to-gray-50/50">
        <div className="flex-grow">
          <p className="text-xs font-semibold tracking-wider text-gray-400 uppercase mb-2">
            {contest.isClosedContest ? "Private Contest" : "Public Contest"}
          </p>
          <h3 className="text-2xl font-bold text-gray-800 mb-6 line-clamp-2 group-hover:text-[#034045] transition-colors duration-300">
            {contest.title}
          </h3>

          {/* Stats Bar */}
          <div className="grid grid-cols-3 gap-4 mb-8 pt-6 border-t border-gray-100">
            <div className="flex flex-col items-center justify-center relative">
              <div className="w-12 h-12 rounded-full bg-[#034045]/5 flex items-center justify-center mb-3 group-hover:bg-[#034045]/10 group-hover:scale-110 transition-all duration-300">
                <Users className="w-5 h-5 text-[#034045]" />
              </div>
              <div className="font-extrabold text-gray-800 text-lg">
                {totalVotes ? totalVotes.toLocaleString() : 0}
              </div>
              <div className="text-[10px] text-gray-500 font-bold uppercase tracking-widest mt-1">
                Votes
              </div>
            </div>

            <div className="flex flex-col items-center justify-center relative">
              <div className="w-12 h-12 rounded-full bg-[#034045]/5 flex items-center justify-center mb-3 group-hover:bg-[#034045]/10 group-hover:scale-110 transition-all duration-300">
                <VoteIcon />
              </div>
              <div className="font-extrabold text-gray-800 text-lg">
                {positionCount ? positionCount.toLocaleString() : 0}
              </div>
              <div className="text-[10px] text-gray-500 font-bold uppercase tracking-widest mt-1">
                Positions
              </div>
            </div>

            <div className="flex flex-col items-center justify-center relative">
              <div className="w-12 h-12 rounded-full bg-[#034045]/5 flex items-center justify-center mb-3 group-hover:bg-[#034045]/10 group-hover:scale-110 transition-all duration-300">
                <Clock className="w-5 h-5 text-[#034045]" />
              </div>
              <div className="font-extrabold text-gray-800 text-lg">
                {totalContestants ? totalContestants.toLocaleString() : 0}
              </div>
              <div className="text-[10px] text-gray-500 font-bold uppercase tracking-widest mt-1">
                Contestants
              </div>
            </div>
          </div>
        </div>

        {/* Action Button */}
        <button
          className={buttonConfig.classes}
          onClick={() => navigate(`/contest-detail/${contest._id}`)}
        >
          <div className="relative z-10 flex items-center justify-center gap-2">
            <span>{buttonConfig.text}</span>
            <svg
              className="w-5 h-5 transform group-hover/btn:translate-x-1.5 transition-transform duration-300"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M14 5l7 7m0 0l-7 7m7-7H3" />
            </svg>
          </div>
          <div className="absolute inset-0 h-full w-0 bg-white/20 transition-all duration-300 ease-out group-hover/btn:w-full" />
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
    <div className="w-full max-w-[1400px] mx-auto px-4 md:px-12 lg:px-16 py-12">
      {/* Filter Tabs */}
      <div className="flex flex-wrap gap-3 mb-12 pb-6 justify-center md:justify-start">
        {filterTabs.map((tab) => (
          <button
            key={tab.name}
            onClick={() => setActiveFilter(tab?.name?.toLowerCase())}
            className={`flex items-center gap-3 px-7 py-3.5 rounded-2xl font-bold transition-all duration-300 cursor-pointer border ${activeFilter === tab?.name?.toLowerCase()
                ? "bg-gradient-to-r from-[#034045] to-[#0a5a60] text-white shadow-xl shadow-[#034045]/20 border-transparent transform -translate-y-1"
                : "bg-white text-gray-600 hover:bg-gray-50 border-gray-200 hover:border-gray-300 hover:shadow-md hover:-translate-y-0.5"
              }`}
          >
            {tab.name}
            <span
              className={`px-3 py-1 rounded-lg text-xs font-black tracking-widest ${activeFilter === tab?.name?.toLowerCase()
                  ? "bg-white/20 text-white"
                  : "bg-gray-100 text-gray-500"
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
