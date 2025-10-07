import React, { useEffect } from "react";
import Sidebar from "../Components/sidebar";
import ContestCard from "../Components/ContestCard";
import { Bell, Target, ChevronDown } from "lucide-react";
// import Image1 from "../assets/Rectangle 333.png";
// import Image2 from "../assets/22222.png";
// import Image3 from "../assets/33333.png";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { useUser } from "../context/UserContext"; // if you store user in context
import FullPageLoader from "../Components/FullPageLoader";

const ContestTypeOption = ({ icon, title, onClick }) => {
  return (
    <div
      className="flex flex-col items-center cursor-pointer"
      onClick={onClick}
    >
      <div className="bg-orange-500 rounded-full p-4 flex items-center justify-center">
        {icon}
      </div>
      <p className="text-white mt-2">{title}</p>
    </div>
  );
};

const Dashboard = () => {
  const navigate = useNavigate();
  const { user, setUserContests, userContests, setCreateContest } = useUser(); // get user from context
  const [isLoading, setIsLoading] = React.useState(true);
  const [showPageLoader, setShowPageLoader] = React.useState(true);

  useEffect(() => {
    // Show loader for at least 1s, then allow contest fetch to control isLoading
    const timer = setTimeout(() => setShowPageLoader(false), 1000);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    const fetchContests = async () => {
      if (!user?._id) return;
      setIsLoading(true);
      try {
        const res = await axios.get(`/api/contest/organizer/${user._id}`);
        const allContests = res.data.contests || [];
        setUserContests(allContests);
      } catch (err) {
        console.error("Failed to fetch contests:", err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchContests();
  }, [user, setUserContests]);

  const handleSpotlightClick = () => {
    navigate("/create-spotlight-contest");
  };

  if (showPageLoader || isLoading) {
    return <FullPageLoader />;
  }

  return (
    <div className="flex min-h-screen bg-white overflow-x-hidden lg:gap-[10rem]">
      <Sidebar />
      <div className="flex-1 p-6 md:ml-20 ">
        {/* Menu Area Section */}
        <div className="w-full bg-teal-900 rounded-lg p-6 mb-8">
          {/* Top right notification bell */}
          <div className="flex justify-end">
            <button className="bg-gray-200 p-2 rounded-full">
              <Bell size={20} />
            </button>
          </div>

          {/* Title and description */}
          <div className="text-center mt-6 mb-8">
            <h className="text-white text-3xl font-bold">
              What contest are you creating today?
            </h>
            <p className="text-white mt-2">
              Create your contest in a few easy steps!
            </p>
          </div>

          {/* Contest type options */}
          <div className="flex justify-center gap-16">
            <ContestTypeOption
              icon={<Target className="h-8 w-8 text-white" />}
              title="Spotlight"
              onClick={() => {
                setCreateContest([]);
                handleSpotlightClick();
              }}
            />
          </div>
        </div>

        {/* UpComing Contests Section */}
        <div className="mb-8">
          <div className="flex justify-between items-center mb-6">
            <div className="flex items-center">
              <h2 className="text-xl font-bold ml-2">Upcoming Contest</h2>
            </div>
            <button
              className="text-teal-600 hover:underline bg-transparent border-none p-0 cursor-pointer"
              onClick={() => navigate("/contest?tab=Upcoming")}
            >
              View All
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {isLoading ? (
              <SkeletonLoader lines={4} className="col-span-3" />
            ) : Array.isArray(userContests) &&
              userContests.filter((c) => c.status === "upcoming").length > 0 ? (
              userContests
                .filter((c) => c.status === "upcoming")
                .map((contest) => (
                  <ContestCard key={contest._id} contest={contest} />
                ))
            ) : (
              <p className="text-gray-500 italic w-120">No upcoming contest.</p>
            )}
          </div>
        </div>

        {/* Ongoing Contests Section */}
        <div className="mb-8">
          <div className="flex justify-between items-center mb-6">
            <div className="flex items-center">
              <h2 className="text-xl font-bold ml-2">Ongoing Contest</h2>
            </div>
            <button
              className="text-teal-600 hover:underline bg-transparent border-none p-0 cursor-pointer"
              onClick={() => navigate("/contest?tab=Ongoing")}
            >
              View All
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {isLoading ? (
              <SkeletonLoader lines={4} className="col-span-3" />
            ) : Array.isArray(userContests) &&
              userContests.filter((c) => c.status === "ongoing").length > 0 ? (
              userContests
                .filter((c) => c.status === "ongoing")
                .map((contest) => (
                  <ContestCard key={contest._id} contest={contest} />
                ))
            ) : (
              <p className="text-gray-500 italic w-120">No ongoing contest.</p>
            )}
          </div>
        </div>

        {/* Completed Contests Section */}
        <div className="mb-8">
          <div className="flex justify-between items-center mb-6">
            <div className="flex items-center">
              <h2 className="text-xl font-bold ml-2">Completed Contest</h2>
            </div>
            <button
              className="text-teal-600 hover:underline bg-transparent border-none p-0 cursor-pointer"
              onClick={() => navigate("/contest?tab=Completed")}
            >
              View All
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {isLoading ? (
              <SkeletonLoader lines={4} className="col-span-3" />
            ) : Array.isArray(userContests) &&
              userContests.filter((c) => c.status === "completed").length > 0 ? (
              userContests
                .filter((c) => c.status === "completed")
                .map((contest) => (
                  <ContestCard key={contest._id} contest={contest} />
                ))
            ) : (
              <p className="text-gray-500 italic w-120">
                No completed contest.
              </p>
            )}
          </div>
        </div>

        {/*Draft Contests Section */}
        <div className="mb-8">
          <div className="flex justify-between items-center mb-6">
            <div className="flex items-center">
              <h2 className="text-xl font-bold ml-2">Draft Contest</h2>
            </div>
            <button
              className="text-teal-600 hover:underline bg-transparent border-none p-0 cursor-pointer"
              onClick={() => navigate("/contest?tab=Draft")}
            >
              View All
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {isLoading ? (
              <SkeletonLoader lines={4} className="col-span-3" />
            ) : Array.isArray(userContests) &&
              userContests.filter((c) => c.status === "draft").length > 0 ? (
              userContests
                .filter((c) => c.status === "draft")
                .map((contest) => (
                  <ContestCard key={contest._id} contest={contest} />
                ))
            ) : (
              <p className="text-gray-500 italic">
                No contest saved as drafts.
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
