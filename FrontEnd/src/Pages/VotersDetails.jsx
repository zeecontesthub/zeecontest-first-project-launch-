import React, { useState, useMemo, useEffect } from "react";
import Sidebar from "../Components/sidebar";
import BannerImage from "../assets/Rectangle _5189.png";
import LogoImage from "../assets/Ellipse 20.png";
import {
  Edit,
  Eye,
  Share2,
  ChevronLeft,
  Search,
  Users,
  Download,
  ChevronUp,
  ChevronDown,
} from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";

const VotersDetails = () => {
  const { contestId } = useParams();
  const [contest, setContest] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortField, setSortField] = useState("name");
  const [sortDirection, setSortDirection] = useState("asc");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;
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

  // Get voters from contest state
  const voterDetails = useMemo(
    () =>
      contest?.voters?.map((voter) => ({
        id: voter._id,
        name: voter.name,
        email: voter.email,
        votingDate:
          new Date(voter.votingDate).toLocaleDateString("en-US") || "", // adjust field name if needed
      })) || [],
    [contest]
  );

  // Filtered and sorted data
  const filteredData = useMemo(() => {
    let filtered = voterDetails.filter((voter) => {
      const matchesSearch =
        voter.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        voter.email?.toLowerCase().includes(searchTerm.toLowerCase());
      return matchesSearch;
    });

    // Sort data
    filtered.sort((a, b) => {
      const aValue = a[sortField] || "";
      const bValue = b[sortField] || "";
      if (sortDirection === "asc") {
        return aValue.localeCompare(bValue);
      } else {
        return bValue.localeCompare(aValue);
      }
    });

    return filtered;
  }, [voterDetails, searchTerm, sortField, sortDirection]);

  // Pagination
  const totalPages = Math.ceil(filteredData.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedData = filteredData.slice(
    startIndex,
    startIndex + itemsPerPage
  );

  const handleSort = (field) => {
    if (sortField === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortDirection("asc");
    }
  };

  const SortIcon = ({ field }) => {
    if (sortField !== field)
      return <ChevronUp className="w-4 h-4 opacity-30" />;
    return sortDirection === "asc" ? (
      <ChevronUp className="w-4 h-4 text-blue-600" />
    ) : (
      <ChevronDown className="w-4 h-4 text-blue-600" />
    );
  };

  return (
    <div className="flex min-h-screen">
      <Sidebar />

      <div className="flex-1 w-full p-6 ml-20">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <button
            onClick={() => navigate(-1)}
            className="p-2 rounded-full hover:bg-gray-200 transition-colors"
            aria-label="Back to Contest Details"
          >
            <ChevronLeft size={24} />
          </button>
          <h2 className="text-[30px] text-left font-bold text-gray-900 mb-0">
            Voters Details
          </h2>
        </div>

        <div className="relative mb-2  h-65">
          <img
            src={contest?.coverImageUrl || BannerImage}
            alt="Contest Banner"
            className="w-full object-cover rounded-lg h-full absolute inset-0"
          />
        </div>

        <div className="relative z-10  backdrop-blur-sm rounded-3xl p-6 lg:p-8">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
            {/* Left Section - Logo and Content */}
            <div className="flex items-center gap-6">
              {/* Logo */}
              <div className="h-50 w-50 rounded-full flex items-center justify-center border-4 border-black overflow-hidden -mt-5 ml-5 mb-4">
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
                      {contest?.voters?.length || 0}
                    </span>
                    <span className="text-gray-600 ml-2 text-sm">
                      Total Votes
                    </span>
                  </div>
                  <div>
                    <span className="text-3xl lg:text-4xl font-bold text-gray-900">
                      {contest?.participants?.length || 0}
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
          {/* Voter Details Table */}
          <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 p-6">
            <div className="max-w-6xl mx-auto">
              {/* Header Section */}
              <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 mb-6">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-blue-100 rounded-xl">
                      <Users className="w-6 h-6 text-blue-600" />
                    </div>
                    <div className="text-left">
                      <h2 className="text-md font-bold text-gray-900">
                        Voters Details
                      </h2>
                      <p className="text-gray-600 text-sm">
                        {filteredData.length} of {voterDetails.length} voters
                      </p>
                    </div>
                  </div>
                  <div className="flex gap-3">
                    <button className="flex items-center gap-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg transition-colors">
                      <Download className="w-4 h-4" />
                      Export
                    </button>
                  </div>
                </div>
              </div>

              {/* Controls Section */}
              <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 mb-6">
                <div className="flex flex-col md:flex-row gap-4">
                  {/* Search */}
                  <div className="flex-1 relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      type="text"
                      placeholder="Search by name or email..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                    />
                  </div>
                </div>
              </div>

              {/* Table Section */}
              <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full text-left">
                    <thead className="bg-gray-50 border-b border-gray-200">
                      <tr>
                        <th
                          className="text-left py-4 px-6 font-semibold text-gray-900 cursor-pointer hover:bg-gray-100 transition-colors"
                          onClick={() => handleSort("name")}
                        >
                          <div className="flex  items-center gap-2">
                            Full Name
                            <SortIcon field="name" />
                          </div>
                        </th>
                        <th
                          className="text-left py-4 px-6 font-semibold text-gray-900 cursor-pointer hover:bg-gray-100 transition-colors"
                          onClick={() => handleSort("email")}
                        >
                          <div className="flex items-center gap-2">
                            Email Address
                            <SortIcon field="email" />
                          </div>
                        </th>
                        <th className="text-left py-4 px-6 font-semibold text-gray-900">
                          Voting Date
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                      {paginatedData.length > 0 ? (
                        paginatedData.map((voter) => (
                          <tr
                            key={voter?.id}
                            className="hover:bg-gray-50 transition-colors group"
                          >
                            <td className="py-4 px-6">
                              <div className="font-medium text-gray-900">
                                {voter.name}
                              </div>
                            </td>
                            <td className="py-4 px-6">
                              <div className="text-gray-600">{voter.email}</div>
                            </td>
                            <td className="py-4 px-6">
                              <div className="text-gray-600">
                                {voter.votingDate
                                  ? new Date(
                                      voter.votingDate
                                    ).toLocaleDateString()
                                  : "--"}
                              </div>
                            </td>
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td colSpan="3" className="py-12 text-center">
                            <div className="flex flex-col items-center gap-3">
                              <div className="p-3 bg-gray-100 rounded-full">
                                <Users className="w-8 h-8 text-gray-400" />
                              </div>
                              <div>
                                <h3 className="text-lg font-medium text-gray-900">
                                  No voters found
                                </h3>
                                <p className="text-gray-500">
                                  Try adjusting your search or filter criteria
                                </p>
                              </div>
                            </div>
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>

                {/* Pagination */}
                {totalPages > 1 && (
                  <div className="flex items-center justify-between px-6 py-4 bg-gray-50 border-t border-gray-200">
                    <div className="text-sm text-gray-700">
                      Showing {startIndex + 1} to{" "}
                      {Math.min(startIndex + itemsPerPage, filteredData.length)}{" "}
                      of {filteredData.length} results
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={() =>
                          setCurrentPage(Math.max(1, currentPage - 1))
                        }
                        disabled={currentPage === 1}
                        className="px-3 py-1 text-sm border border-gray-300 rounded-md hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                      >
                        Previous
                      </button>
                      {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                        (page) => (
                          <button
                            key={page}
                            onClick={() => setCurrentPage(page)}
                            className={`px-3 py-1 text-sm border rounded-md transition-colors ${
                              currentPage === page
                                ? "bg-orange-600 text-white border-blue-600"
                                : "border-gray-300 hover:bg-gray-100"
                            }`}
                          >
                            {page}
                          </button>
                        )
                      )}
                      <button
                        onClick={() =>
                          setCurrentPage(Math.min(totalPages, currentPage + 1))
                        }
                        disabled={currentPage === totalPages}
                        className="px-3 py-1 text-sm border border-gray-300 rounded-md hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                      >
                        Next
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VotersDetails;
