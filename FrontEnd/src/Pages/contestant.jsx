import React, { useEffect, useState } from "react";
import Sidebar from "../Components/sidebar";
import BannerImage from "../assets/Rectangle _5189.png";
import LogoImage from "../assets/Ellipse 20.png";
import { Edit, Share2, ChevronLeft } from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";
import ContestantCard from "../Components/ContestantCard";
import axios from "axios";

const Contestant = () => {
  const { contestId } = useParams();
  const [contest, setContest] = useState(null);
  const [selectedPosition, setSelectedPosition] = useState("All");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchContest = async () => {
      try {
        const res = await axios.get(`/api/contest/${contestId}`);
        setContest(res.data.contest);
      } catch (err) {
        console.error("Failed to fetch contest:", err);
      }
    };
    if (contestId) fetchContest();
  }, [contestId]);

  // Get positions from contest data
  const positions = contest?.positions?.map((pos) => pos.name) || [];
  const filterOptions = ["All", ...positions];

  // Flatten all contestants from all positions
  const allContestants =
    contest?.positions?.flatMap((pos) =>
      pos.contestants?.map((contestant) => ({
        ...contestant,
        position: pos.name,
      }))
    ) || [];

  // Filter contestants based on selected position
  const filteredContestants =
    selectedPosition === "All"
      ? allContestants
      : allContestants.filter(
          (contestant) => contestant.position === selectedPosition
        );

  // Total votes and contestants
  const totalGlobalVotes =
    contest?.positions?.reduce(
      (acc, pos) => acc + (pos.voters?.length || 0),
      0
    ) || 0;
  const totalContestants = allContestants.length;

  return (
    <div className="flex min-h-screen">
      <Sidebar />

      <div className="flex-1 w-full p-6 ml-20">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <button
            onClick={() => navigate("/contest-details")}
            className="p-2 rounded-full hover:bg-gray-200 transition-colors"
            aria-label="Back to Contest Details"
          >
            <ChevronLeft size={24} />
          </button>
          <h2 className="text-[30px] text-left font-bold text-gray-900 mb-0">
            Contestant
          </h2>
        </div>

        <div className="relative mb-2  h-65">
          <img
            src={contest?.coverImageUrl || BannerImage}
            alt="Contest Banner"
            className="w-full object-cover rounded-lg h-full absolute inset-0"
          />
        </div>

        {/* Main Header Content */}
        <div className="relative z-10  backdrop-blur-sm rounded-3xl p-6 lg:p-8">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
            {/* Left Section - Logo and Content */}
            <div className="flex items-center gap-6">
              {/* Logo */}
              <div className="h-50 w-50 rounded-full flex items-center justify-center border-4 border-black overflow-hidden -mt-5 ml-5">
                <img
                  src={contest?.contestLogoImageUrl || LogoImage}
                  alt="Logo"
                  className="w-full h-full object-cover"
                />
              </div>

              {/* Content */}
              <div>
                <h2 className="text-[32px] lg:text-[32px] text-left font-bold text-gray-900 mb-2">
                  {contest?.title || "Contest Name"}
                </h2>
                <p className="text-gray-600 max-w-lg text-left text-sm lg:text-base">
                  {contest?.description ||
                    "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua."}
                </p>

                {/* Stats */}
                <div className="flex items-center gap-8 mt-4">
                  <div>
                    <span className="text-3xl lg:text-4xl font-bold text-gray-900">
                      {totalGlobalVotes}
                    </span>
                    <span className="text-gray-600 ml-2 text-sm">
                      Total Votes
                    </span>
                  </div>
                  <div>
                    <span className="text-3xl lg:text-4xl font-bold text-gray-900">
                      {totalContestants}
                    </span>
                    <span className="text-gray-600 ml-2 text-sm">
                      Contestant
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Section - Action Buttons */}
            <div className="flex flex-col gap-3 min-w-fit">
              <button
                onClick={() => navigate(`/edit-contest/${contestId}`)}
                className="flex items-center gap-2 px-4 py-2 border border-[#000000] rounded-lg hover:bg-teal-900 hover:text-white transition-colors text-sm font-medium"
              >
                <Edit size={16} />
                Edit Contest
              </button>
              <button className="flex items-center gap-2 px-4 py-2 border border-[#000000] rounded-lg hover:bg-teal-900 hover:text-white transition-colors text-sm font-medium">
                <Share2 size={16} />
                Share Voters Link
              </button>
            </div>
          </div>
        </div>

        {/* Filter Buttons */}
        <div className="flex flex-wrap gap-3 mb-8 mt-7">
          {filterOptions.map((pos) => (
            <button
              key={pos}
              onClick={() => setSelectedPosition(pos)}
              className={`px-6 py-3 rounded-lg font-medium transition-colors ${
                selectedPosition === pos
                  ? "bg-orange-500 text-white"
                  : "bg-teal-800 text-white hover:bg-teal-700"
              }`}
            >
              {pos}
            </button>
          ))}
        </div>

        {/* Contestants List */}
        <div className="mt-10 grid grid-cols-1 sm:grid-cols-2 text-left md:grid-cols-3 lg:grid-cols-4 gap-6">
          {filteredContestants.map((contestant, index) => (
            <ContestantCard
              key={contestant._id || index}
              name={contestant.name}
              image={contestant.image || contestant.avatar || ""}
              votes={contestant.votes || 0}
              position={contestant.position}
              contestantId={contestant._id}
              contestId={contestId}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default Contestant;
