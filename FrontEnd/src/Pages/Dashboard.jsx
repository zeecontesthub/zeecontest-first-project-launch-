import React, { useEffect, useMemo, useState } from "react";
import TopNav from "../Components/TopNav";
import ContestCard from "../Components/ContestCard";
import { LayoutGrid, Clock, CheckCircle2, TrendingUp, BarChart2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { useUser } from "../context/UserContext";
import FullPageLoader from "../Components/FullPageLoader";

// ─── Mini Stat Tile ──────────────────────────────────────────────────────────
const StatTile = ({ icon: Icon, label, value, accent }) => (
  <div className="bg-white border border-gray-100 rounded-2xl p-5 flex items-center gap-4 shadow-sm">
    <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${accent}`}>
      <Icon className="w-5 h-5 text-white" />
    </div>
    <div>
      <p className="text-2xl font-bold text-gray-900 leading-none mb-0.5">{value}</p>
      <p className="text-xs text-gray-400 font-medium">{label}</p>
    </div>
  </div>
);

// ─── Section Header ──────────────────────────────────────────────────────────
const SectionHeader = ({ title, count, onViewAll }) => (
  <div className="flex items-center justify-between mb-5">
    <div className="flex items-center gap-2">
      <h2 className="text-sm font-semibold text-gray-900">{title}</h2>
      {count > 0 && (
        <span className="text-xs font-medium text-gray-400 bg-gray-100 px-2 py-0.5 rounded-full">
          {count}
        </span>
      )}
    </div>
    {count > 0 && (
      <button
        className="text-xs font-medium text-gray-400 hover:text-gray-700 transition-colors"
        onClick={onViewAll}
      >
        View all →
      </button>
    )}
  </div>
);

// ─── Empty State ─────────────────────────────────────────────────────────────
const EmptyState = ({ label }) => (
  <div className="col-span-full py-10 flex flex-col items-center gap-2 text-center">
    <div className="w-10 h-10 rounded-2xl bg-gray-50 flex items-center justify-center">
      <LayoutGrid className="w-5 h-5 text-gray-300" />
    </div>
    <p className="text-sm text-gray-400">No {label} contests yet.</p>
  </div>
);

// ─── Tabbed Contests ──────────────────────────────────────────────────────────
const TabbedContests = ({ tabs, navigate }) => {
  const [activeTab, setActiveTab] = React.useState(0);
  const active = tabs[activeTab];

  return (
    <div>
      {/* Tab bar */}
      <div className="flex items-center gap-0 border-b border-gray-100 mb-6">
        {tabs.map((t, i) => (
          <button
            key={t.tab}
            onClick={() => setActiveTab(i)}
            className={`relative pb-3 px-4 text-sm font-medium transition-colors duration-150 ${activeTab === i
                ? "text-gray-900 after:absolute after:bottom-0 after:left-0 after:right-0 after:h-0.5 after:bg-gray-900 after:rounded-full"
                : "text-gray-400 hover:text-gray-600"
              }`}
          >
            {t.label}
            {t.data.length > 0 && (
              <span className={`ml-1.5 text-xs px-1.5 py-0.5 rounded-full ${activeTab === i ? "bg-gray-900 text-white" : "bg-gray-100 text-gray-400"}`}>
                {t.data.length}
              </span>
            )}
          </button>
        ))}
        <div className="ml-auto">
          {active.data.length > 0 && active.tab !== 'All' && (
            <button
              onClick={() => navigate(`/contest?tab=${active.tab}`)}
              className="text-xs font-medium text-gray-400 hover:text-gray-700 transition-colors pb-3"
            >
              View all →
            </button>
          )}
        </div>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {active.data.length > 0 ? (
          active.data.slice(0, 8).map((contest) => (
            <ContestCard key={contest._id} contest={contest} />
          ))
        ) : (
          <EmptyState label={active.label.toLowerCase()} />
        )}
      </div>
    </div>
  );
};

// ─── Dashboard ────────────────────────────────────────────────────────────────
const Dashboard = () => {
  const navigate = useNavigate();
  const { user, setUserContests, userContests } = useUser();
  const [isLoading, setIsLoading] = React.useState(true);
  const [showPageLoader, setShowPageLoader] = React.useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setShowPageLoader(false), 800);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    const fetchContests = async () => {
      if (!user?._id) return;
      setIsLoading(true);
      try {
        const res = await axios.get(`/api/contest/organizer/${user._id}`);
        setUserContests(res.data.contests || []);
      } catch (err) {
        console.error("Failed to fetch contests:", err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchContests();
  }, [user, setUserContests]);

  // Derived counts
  const upcoming = useMemo(() => (userContests || []).filter((c) => c.status === "upcoming"), [userContests]);
  const ongoing = useMemo(() => (userContests || []).filter((c) => c.status === "ongoing"), [userContests]);
  const completed = useMemo(() => (userContests || []).filter((c) => c.status === "completed"), [userContests]);
  const draft = useMemo(() => (userContests || []).filter((c) => c.status === "draft"), [userContests]);

  const totalVotes = useMemo(() =>
    (userContests || []).reduce((sum, c) => {
      if (c.isClosedContest) {
        return sum + (c.closedContestVoters?.length || 0);
      }
      return sum + (c.positions || []).reduce((s, p) => s + (p.voters?.length || 0), 0);
    }, 0), [userContests]);

  if (showPageLoader || isLoading) return <FullPageLoader />;

  const firstName = user?.name?.split(" ")[0] || "there";

  return (
    <div className="min-h-screen bg-[#f8f8f8]">
      <TopNav />

      <div className="px-4 sm:px-8 py-6 max-w-5xl mx-auto">

        {/* ── Greeting ── */}
        <div className="mb-8">
          <p className="text-base font-semibold text-gray-800">
            Good {getGreeting()}, {firstName} 👋
          </p>
          <p className="text-xs text-gray-400 mt-0.5">Here's an overview of your contests.</p>
        </div>

        {/* ── Stat Tiles ── */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
          <StatTile icon={Clock} label="Upcoming" value={upcoming.length} accent="bg-blue-400" />
          <StatTile icon={TrendingUp} label="Ongoing" value={ongoing.length} accent="bg-emerald-400" />
          <StatTile icon={CheckCircle2} label="Completed" value={completed.length} accent="bg-gray-400" />
          <StatTile icon={BarChart2} label="Total Votes" value={totalVotes} accent="bg-violet-400" />
        </div>

        {/* ── Tabbed Contest Sections ── */}
        {(() => {
          const TABS = [
            { label: "All", data: userContests || [], tab: "All" },
            { label: "Upcoming", data: upcoming, tab: "Upcoming" },
            { label: "Ongoing", data: ongoing, tab: "Ongoing" },
            { label: "Completed", data: completed, tab: "Completed" },
          ];
          return <TabbedContests tabs={TABS} navigate={navigate} />;
        })()}
      </div>
    </div>
  );
};

// Helper
function getGreeting() {
  const h = new Date().getHours();
  if (h < 12) return "morning";
  if (h < 17) return "afternoon";
  return "evening";
}

export default Dashboard;
