import { useNavigate } from "react-router-dom";
import { useUser } from "../context/UserContext";
import PlaceHolderImage from "../assets/Imagecre.png";
import { useMemo } from "react";
import { Users, BarChart2, ArrowRight, Clock } from "lucide-react";

const STATUS_STYLES = {
  upcoming: { dot: "bg-blue-400", text: "text-blue-600", bg: "bg-blue-50", label: "Upcoming" },
  ongoing: { dot: "bg-emerald-400", text: "text-emerald-600", bg: "bg-emerald-50", label: "Ongoing" },
  completed: { dot: "bg-gray-400", text: "text-gray-500", bg: "bg-gray-100", label: "Completed" },
  draft: { dot: "bg-amber-400", text: "text-amber-600", bg: "bg-amber-50", label: "Draft" },
};

const ContestCard = ({ contest }) => {
  const navigate = useNavigate();
  const { setCreateContest } = useUser();

  const handleViewClick = () => {
    setCreateContest(contest);
    contest.status === "draft"
      ? navigate(`/create-spotlight-contest`)
      : navigate(`/contest-details/${contest?._id}`);
  };

  const allContestants =
    contest?.positions?.flatMap((pos) =>
      pos.contestants?.map((c) => ({ ...c, position: pos?.name }))
    ) || [];
  const totalContestants = allContestants.length;

  const getPositionTotalVotes = (pos, contest) => {
    if (!pos || !contest) return 0;
    if (contest.isClosedContest) {
      return (
        contest.closedContestVoters?.reduce((sum, voter) => {
          const count =
            voter.votedFor?.filter((v) => v.positionTitle === pos.name).length || 0;
          return sum + count * (voter.multiplier || 1);
        }, 0) || 0
      );
    }
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

  const statusStyle = STATUS_STYLES[contest?.status] || STATUS_STYLES.draft;

  return (
    <div
      className="group bg-white border border-gray-100 rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-all duration-200 cursor-pointer flex flex-col"
      onClick={handleViewClick}
    >
      {/* Cover Image */}
      <div className="relative h-40 overflow-hidden bg-gray-50">
        <img
          src={contest?.coverImageUrl || PlaceHolderImage}
          alt={contest?.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
        />
        {/* Status badge */}
        <div className={`absolute top-3 left-3 flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${statusStyle.bg} ${statusStyle.text}`}>
          <span className={`w-1.5 h-1.5 rounded-full ${statusStyle.dot}`} />
          {statusStyle.label}
        </div>
      </div>

      {/* Content */}
      <div className="p-4 flex flex-col flex-1">
        <h3 className="text-gray-900 font-semibold text-sm mb-3 line-clamp-2 leading-snug">
          {contest?.title || "Untitled Contest"}
        </h3>

        {/* Stats row */}
        <div className="flex items-center gap-4 mt-auto">
          <div className="flex items-center gap-1.5 text-gray-500">
            <BarChart2 className="w-3.5 h-3.5" />
            <span className="text-xs">{totalVotes} votes</span>
          </div>
          <div className="flex items-center gap-1.5 text-gray-500">
            <Users className="w-3.5 h-3.5" />
            <span className="text-xs">{totalContestants} contestants</span>
          </div>
          <div className="ml-auto">
            <div className="w-7 h-7 rounded-full bg-gray-50 group-hover:bg-gray-900 group-hover:text-white flex items-center justify-center transition-colors duration-200">
              <ArrowRight className="w-3.5 h-3.5 text-gray-400 group-hover:text-white" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContestCard;
