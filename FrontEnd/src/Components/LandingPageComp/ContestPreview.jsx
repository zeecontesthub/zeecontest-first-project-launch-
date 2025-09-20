/* eslint-disable no-unused-vars */
import { useNavigate } from "react-router-dom";
import {
  Users,
  Clock,
  ArrowRight,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { useState, useEffect, useMemo } from "react";
import VoteIcon from "../../assets/VoteIcon";
import axios from "axios";

// const contests = [
//   {
//     id: 1,
//     title: "Student Union Elections 2024",
//     status: "Active",
//     votes: 1234,
//     positions: 5,
//     contestants: 10,
//     voters: 2456,
//   },
//   {
//     id: 2,
//     title: "Student Union Elections 2024",
//     status: "Upcoming",
//     votes: 1234,
//     positions: 5,
//     contestants: 10,
//     voters: 2456,
//   },
//   {
//     id: 3,
//     title: "Student Union Elections 2024",
//     status: "Completed",
//     votes: 1234,
//     positions: 5,
//     contestants: 10,
//     voters: 2456,
//   },
//   {
//     id: 4,
//     title: "Student Union Elections 2024",
//     status: "Active",
//     votes: 1234,
//     positions: 5,
//     contestants: 10,
//     voters: 2456,
//   },
//   {
//     id: 5,
//     title: "Student Union Elections 2024",
//     status: "Upcoming",
//     votes: 1234,
//     positions: 5,
//     contestants: 10,
//     voters: 2456,
//   },
//   {
//     id: 6,
//     title: "Student Union Elections 2024",
//     status: "Completed",
//     votes: 1234,
//     positions: 5,
//     contestants: 10,
//     voters: 2456,
//   },
// ];

// const getStatusBadge = (status) => {
//   const baseClasses =
//     "absolute top-2 right-2 sm:top-4 sm:right-4 px-2 py-1 sm:px-3 sm:py-1 rounded-full text-xs sm:text-sm font-medium";
//   switch (status) {
//     case "Active":
//       return `${baseClasses} bg-green-500 text-white`;
//     case "Upcoming":
//       return `${baseClasses} bg-yellow-500 text-white`;
//     case "Completed":
//       return `${baseClasses} bg-red-500 text-white`;
//     default:
//       return `${baseClasses} bg-gray-500 text-white`;
//   }
// };

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

const ContestCard = ({ contest, slidesPerView }) => {
  const navigate = useNavigate();
  const buttonConfig = getButtonConfig(contest.status);

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
      className="px-2 sm:px-3 flex-shrink-0"
      style={{ width: `${100 / slidesPerView}%` }}
    >
      <div className="bg-[#84818133] rounded-xl overflow-hidden hover:shadow-xl transition-shadow duration-300">
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
        <div className="p-4 sm:p-6">
          <p className="text-base sm:text-lg md:text-xl font-bold text-[#034045] mb-3 sm:mb-4 leading-tight">
            {contest.title}
          </p>

          {/* Stats Section */}
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-4 sm:mb-6 text-xs sm:text-sm text-gray-600 gap-3 sm:gap-2">
            <div className="flex items-center gap-2">
              <Users className="w-3 h-3 sm:w-4 sm:h-4 text-[#034045] flex-shrink-0" />
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
              <Clock className="w-3 h-3 sm:w-4 sm:h-4 text-[#034045] flex-shrink-0" />
              <div>
                <div className="font-semibold text-[#034045]">
                  {totalContestants}
                </div>
                <div>Contestants</div>
              </div>
            </div>
          </div>

          <button
            className={buttonConfig.classes}
            onClick={() => navigate(`/contest-detail/${contest._id}`)}
          >
            {buttonConfig.text}
          </button>
        </div>
      </div>
    </div>
  );
};

const ContestPreview = () => {
  const navigate = useNavigate();
  const [currentSlide, setCurrentSlide] = useState(0);
  const [slidesPerView, setSlidesPerView] = useState(3);
  const [contests, setContests] = useState([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Fetch contests
  useEffect(() => {
    let cancelled = false;
    const fetchContests = async () => {
      setLoading(true);
      setError("");
      try {
        const { data } = await axios.get(
          `/api/contest/get-contests/contests?page=${page}&limit=6&q=${encodeURIComponent(
            ""
          )}`
        );

        if (cancelled) return;

        console.log(data);

        setContests((prev) =>
          page === 1 ? data.contests : [...prev, ...data.contests]
        );
        setHasMore(Boolean(data.hasMore));
      } catch (err) {
        if (cancelled) return;
        console.error("Error fetching contests", err);
        setError("Failed to load contests. Please try again.");
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    fetchContests();
    return () => {
      cancelled = true;
    };
  }, []);

  // Update slides per view based on screen size
  useEffect(() => {
    const updateSlidesPerView = () => {
      const width = window.innerWidth;
      if (width < 768) {
        setSlidesPerView(1);
      } else if (width < 1024) {
        setSlidesPerView(2);
      } else {
        setSlidesPerView(3);
      }
    };

    updateSlidesPerView();
    window.addEventListener("resize", updateSlidesPerView);
    return () => window.removeEventListener("resize", updateSlidesPerView);
  }, []);

  const maxSlides = contests.length - slidesPerView;

  // Auto-scroll functionality
  useEffect(() => {
    if (contests.length <= slidesPerView) return;

    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev >= maxSlides ? 0 : prev + 1));
    }, 3000);

    return () => clearInterval(interval);
  }, [slidesPerView, maxSlides]);

  // Reset current slide when slides per view changes to avoid issues
  useEffect(() => {
    setCurrentSlide(0);
  }, [slidesPerView]);

  const nextSlide = () => {
    if (contests.length <= slidesPerView) return;
    setCurrentSlide((prev) => (prev >= maxSlides ? 0 : prev + 1));
  };

  const prevSlide = () => {
    if (contests.length <= slidesPerView) return;
    setCurrentSlide((prev) => (prev <= 0 ? maxSlides : prev - 1));
  };

  const goToSlide = (index) => {
    if (index >= 0 && index <= maxSlides) {
      setCurrentSlide(index);
    }
  };

  return (
    <div className="w-full mx-auto px-4 sm:px-6 md:px-12 lg:px-30 py-6 sm:py-8">
      {/* Section Header */}
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-4 sm:mb-6 gap-3 sm:gap-0">
        <p className="text-lg sm:text-xl md:text-3xl font-bold text-[#034045]">
          Latest Contests
        </p>
        <button
          onClick={() => navigate("/contests")}
          className="text-[#E67347] font-semibold flex items-center gap-1 transition-all duration-200 hover:gap-2 text-sm sm:text-base self-start sm:self-auto"
        >
          View All
          <ArrowRight className="w-3 h-3 sm:w-4 sm:h-4" />
        </button>
      </div>

      {/* Carousel Wrapper */}
      <div className="relative">
        {/* Navigation Arrows - Hidden on mobile */}
        {contests.length > slidesPerView && (
          <>
            <button
              onClick={prevSlide}
              className="absolute left-0 top-1/2 -translate-y-1/2 z-10 bg-white shadow-lg rounded-full p-2 hover:bg-gray-50 transition-colors duration-200 hidden md:flex items-center justify-center"
              style={{ marginLeft: "-20px" }}
            >
              <ChevronLeft className="w-5 h-5 text-[#034045]" />
            </button>

            <button
              onClick={nextSlide}
              className="absolute right-0 top-1/2 -translate-y-1/2 z-10 bg-white shadow-lg rounded-full p-2 hover:bg-gray-50 transition-colors duration-200 hidden md:flex items-center justify-center"
              style={{ marginRight: "-20px" }}
            >
              <ChevronRight className="w-5 h-5 text-[#034045]" />
            </button>
          </>
        )}

        {/* Carousel Container */}
        <div className="overflow-hidden">
          <div
            className="flex transition-transform duration-500 ease-in-out"
            style={{
              transform: `translateX(-${
                currentSlide * (100 / slidesPerView)
              }%)`,
            }}
          >
            {contests.map((contest, index) => {
              // const buttonConfig = getButtonConfig(contest.status);
              return (
                <ContestCard contest={contest} slidesPerView={slidesPerView} />
              );
            })}
          </div>
        </div>

        {/* Dots Navigation */}
        {contests.length > slidesPerView && (
          <div className="flex justify-center mt-6 gap-2">
            {Array.from({ length: maxSlides + 1 }, (_, index) => (
              <button
                key={index}
                onClick={() => goToSlide(index)}
                className={`w-2 h-2 sm:w-3 sm:h-3 rounded-full transition-all duration-200 ${
                  currentSlide === index
                    ? "bg-[#034045] scale-125"
                    : "bg-gray-300 hover:bg-gray-400"
                }`}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ContestPreview;
