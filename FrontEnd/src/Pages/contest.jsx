import React, { useState, useEffect } from "react";
import Sidebar from "../Components/sidebar";
import ContestCard from "../Components/ContestCard";
import Image1 from "../assets/Rectangle_333.png";
import Image2 from "../assets/22222.png";
import Image3 from "../assets/33333.png";
import { useUser } from "../context/UserContext";
// import { useNavigate } from "react-router-dom";

import { useLocation } from "react-router-dom";

const Contest = () => {
  const [activeTab, setActiveTab] = useState("All");

  const { userContests } = useUser(); // get user from context
  const location = useLocation();

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const tabParam = params.get("tab");
    if (tabParam && ["All", "Upcoming", "Ongoing", "Completed", "Draft"].includes(tabParam)) {
      setActiveTab(tabParam);
    }
  }, [location.search]);

  const stats = [
    { label: "Total Contests", value: userContests.length || "0" },
    {
      label: "Upcoming Contest",
      value: userContests.filter((c) => c.status === "upcoming").length || "0",
    },
    {
      label: "Ongoing Contest",
      value: userContests.filter((c) => c.status === "ongoing").length || "0",
    },
    {
      label: "Completed Contest",
      value: userContests.filter((c) => c.status === "completed").length || "0",
    },
    {
      label: "Drafts",
      value: userContests.filter((c) => c.status === "draft").length || "0",
    },
  ];

  const tabs = ["All", "Upcoming", "Ongoing", "Completed", "Draft"];

  return (
    <div className="flex min-h-screen bg-white">
      <Sidebar />
      <div className="flex-1 w-full p-6 md:ml-20">
        {/* Header */}
        <h2 className="text-[30px] text-left font-bold text-gray-900 mb-8">
          Contest
        </h2>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 mb-8">
          {stats.map((stat, index) => (
            <div key={index} className="bg-gray-200 text-left rounded-xl p-5">
              <h3 className="text-sm font-medium text-gray-600 mb-2">
                {stat.label}
              </h3>
              <p className="text-4xl font-bold text-gray-900">{stat.value}</p>
            </div>
          ))}
        </div>

        {/* Filter Tabs */}
        <div className="flex flex-wrap gap-3 mb-8">
          {tabs.map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-6 py-3 rounded-lg font-medium transition-colors ${
                activeTab === tab
                  ? "bg-orange-500 text-white"
                  : "bg-teal-800 text-white hover:bg-teal-700"
              }`}
            >
              {tab === "Draft" ? "Drafts" : tab}
            </button>
          ))}
        </div>

        {/* Contest Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {userContests
            .filter(
              (contest) =>
                activeTab === "All" ||
                contest.status === activeTab.toLocaleLowerCase()
            )
            .map((contest) => (
              <ContestCard
                key={contest._id}
                contest={contest}
                // Pass isDraft prop if needed
              />
            ))}
        </div>
      </div>
    </div>
  );
};

export default Contest;
