import React, { useState, useEffect } from "react";
import Sidebar from "../Components/sidebar";
import ContestCard from "../Components/ContestCard";
import Image1 from "../assets/Rectangle_333.png";
import Image2 from "../assets/22222.png";
import Image3 from "../assets/33333.png";
import { useUser } from "../context/UserContext";
// import { useNavigate } from "react-router-dom";

import { useLocation } from "react-router-dom";
import FullPageLoader from "../Components/FullPageLoader";
import axios from "axios";

const Contest = () => {
  const [activeTab, setActiveTab] = useState("All");
  const [isLoading, setIsLoading] = useState(true);
  const [selectionMode, setSelectionMode] = useState(false);
  const [selectedDrafts, setSelectedDrafts] = useState([]);
  const [isDeleting, setIsDeleting] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const { userContests } = useUser(); // get user from context
  const location = useLocation();

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const tabParam = params.get("tab");
    if (
      tabParam &&
      ["All", "Upcoming", "Ongoing", "Completed", "Draft"].includes(tabParam)
    ) {
      setActiveTab(tabParam);
    }
  }, [location.search]);

  useEffect(() => {
    if (userContests === undefined) {
      setIsLoading(true);
    } else {
      setIsLoading(false);
    }
  }, [userContests]);

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

  // Only show Clear Drafts button on Draft tab
  const isDraftTab = activeTab === "Draft";
  const draftContests = userContests.filter((c) => c.status === "draft");

  const handleSelectDraft = (id) => {
    setSelectedDrafts((prev) =>
      prev.includes(id) ? prev.filter((d) => d !== id) : [...prev, id]
    );
  };

  const handleDeleteSelectedDrafts = async () => {
    setIsDeleting(true);
    try {
      await Promise.all(
        selectedDrafts.map((id) => axios.delete(`/api/contest/${id}`))
      );
      setSelectedDrafts([]);
      setSelectionMode(false);
      setShowDeleteConfirm(false);
      // Optionally, refresh contests from backend here
      window.location.reload();
    } catch (err) {
      alert("Failed to delete one or more drafts.");
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <>
      {isLoading && <FullPageLoader />}
      <div className="flex min-h-screen bg-white lg:gap-[10rem]">
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
                onClick={() => {
                  setActiveTab(tab);
                  setSelectionMode(false);
                  setSelectedDrafts([]);
                }}
                className={`px-6 py-3 rounded-lg font-medium transition-colors ${
                  activeTab === tab
                    ? "bg-orange-500 text-white"
                    : "bg-teal-800 text-white hover:bg-teal-700"
                }`}
              >
                {tab === "Draft" ? "Drafts" : tab}
              </button>
            ))}
            {/* Show Clear Drafts button only on Draft tab */}
            {isDraftTab && !selectionMode && draftContests.length > 0 && (
              <button
                className="ml-4 px-6 py-3 rounded-lg font-medium bg-red-600 text-white hover:bg-red-700 transition-colors"
                onClick={() => setSelectionMode(true)}
              >
                Clear Drafts
              </button>
            )}
          </div>

          {/* Selection Mode Controls */}
          {isDraftTab && selectionMode && (
            <div className="flex gap-4 mb-6">
              <button
                className="px-6 py-3 rounded-lg font-medium bg-gray-300 text-gray-800 hover:bg-gray-400"
                onClick={() => {
                  setSelectionMode(false);
                  setSelectedDrafts([]);
                }}
                disabled={isDeleting}
              >
                Cancel
              </button>
              <button
                className={`px-6 py-3 rounded-lg font-medium bg-red-600 text-white hover:bg-red-700 ${selectedDrafts.length === 0 ? 'opacity-50' : ''}`}
                onClick={() => setShowDeleteConfirm(true)}
                disabled={selectedDrafts.length === 0 || isDeleting}
              >
                Delete Selected
              </button>
            </div>
          )}

          {/* Delete Confirmation Modal */}
          {showDeleteConfirm && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#000000]/50 bg-opacity-40">
              <div className="bg-white rounded-xl p-8 max-w-md w-full shadow-lg border border-red-200">
                <h3 className="text-lg font-bold text-red-700 mb-2">Confirm Deletion</h3>
                <p className="text-sm text-gray-700 mb-4">
                  Are you sure you want to delete the selected draft contests? This action cannot be undone.
                </p>
                <div className="flex gap-4 justify-end">
                  <button
                    className="px-4 py-2 rounded-md bg-gray-200 hover:bg-gray-300 text-gray-700 font-medium"
                    onClick={() => setShowDeleteConfirm(false)}
                    disabled={isDeleting}
                  >
                    Cancel
                  </button>
                  <button
                    className={`px-4 py-2 rounded-md bg-red-600 hover:bg-red-700 text-white font-semibold ${isDeleting ? 'opacity-50' : ''}`}
                    onClick={handleDeleteSelectedDrafts}
                    disabled={isDeleting}
                  >
                    {isDeleting ? 'Deleting...' : 'Confirm Delete'}
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Contest Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {userContests
                .filter(
                  (contest) =>
                    activeTab === "All" ||
                    contest.status === activeTab.toLocaleLowerCase()
                ).length > 0 ? (
              userContests
                .filter(
                  (contest) =>
                    activeTab === "All" ||
                    contest.status === activeTab.toLocaleLowerCase()
                )
                .map((contest) => (
                  isDraftTab && selectionMode && contest.status === "draft" ? (
                    <div key={contest._id} className="relative">
                      <input
                        type="checkbox"
                        checked={selectedDrafts.includes(contest._id)}
                        onChange={() => handleSelectDraft(contest._id)}
                        className="absolute top-2 left-2 z-10 w-5 h-5 accent-red-600"
                      />
                      <ContestCard contest={contest} />
                    </div>
                  ) : (
                    <ContestCard key={contest._id} contest={contest} />
                  )
                ))
            ) : (
              <p className="text-gray-500 italic w-120">No contests found.</p>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default Contest;
