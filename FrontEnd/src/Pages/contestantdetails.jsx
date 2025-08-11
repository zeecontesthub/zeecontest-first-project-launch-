import React, { useState, useEffect, useMemo } from "react";
import Sidebar from "../Components/sidebar";
import { useNavigate, useParams } from "react-router-dom";
import {
  Edit,
  Share2,
  TrendingUp,
  TrendingDown,
  Clock,
  Target,
  Users,
  Trophy,
  ChevronLeft,
  Crown,
  Medal,
  Award,
  AlertTriangle,
} from "lucide-react";
import axios from "axios";
import { toast } from "react-toastify";
import { uploadToCloudinary } from "../actions/cloudinaryAction";

const ContestantDetails = () => {
  const navigate = useNavigate();
  const { position, contestantId, contestId } = useParams();
  const [contest, setContest] = useState(null);
  const [showRemoveModal, setShowRemoveModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editForm, setEditForm] = useState({
    name: "",
    bio: "",
    avatar: "",
    position: "",
    email: "",
  });

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

  // Get position info and contestants
  const positionInfo = useMemo(() => {
    return contest?.positions?.find((pos) => pos.name === position);
  }, [contest, position]);

  const allContestants = useMemo(() => {
    if (!positionInfo?.contestants) return [];

    const totalVoters = positionInfo.voters?.length || 0;

    // Step 1: Count votes for each contestant
    const voteCounts = {};
    positionInfo.voters.forEach((voter) => {
      const id = voter.votedFor?.toString();
      if (id) {
        voteCounts[id] = (voteCounts[id] || 0) + 1;
      }
    });

    // Step 2: Build contestants array with votes & percentage
    const contestantsWithVotes = positionInfo.contestants.map((c, idx) => {
      const id = c._id?.toString() || idx.toString();
      const votes = voteCounts[id] || 0;
      const percentage =
        totalVoters > 0 ? ((votes / totalVoters) * 100).toFixed(1) : "0.0";

      return {
        ...c,
        id,
        votes,
        percentage,
      };
    });

    // Step 3: Sort by votes descending and assign rank
    contestantsWithVotes.sort((a, b) => b.votes - a.votes);

    contestantsWithVotes.forEach((c, idx) => {
      c.rank = idx + 1;
    });

    return contestantsWithVotes;
  }, [positionInfo]);

  // Find current contestant
  const currentContestant = useMemo(() => {
    if (!allContestants.length) return null;
    return (
      allContestants.find(
        (c) => c._id === contestantId || c.id === contestantId
      ) || allContestants[0]
    );
  }, [allContestants, contestantId]);

  // Remove contestant handler (dummy, you can add API logic)
  const handleRemoveContestant = async () => {
    try {
      await axios.delete(
        `/api/contest/${contestId}/contestant/${contestantId}`
      );
      toast.success("Contestant removed successfully!");
      setShowRemoveModal(false);
      navigate(`/contestant/${contestId}`);
    } catch (err) {
      console.error("Failed to remove contestant:", err);
      toast.error("Failed to remove contestant.");
    }
  };

  // Add this function inside your ContestantDetails component
  const handleEditContestant = async (e) => {
    e.preventDefault();
    try {
      await axios.put(`/api/contest/${contestId}/contestant/${contestantId}`, {
        name: editForm.name,
        bio: editForm.bio,
        avatar: editForm.avatar,
        position: editForm.position,
        email: editForm.email,
      });
      setShowEditModal(false);
      // Optionally, refetch contest data to update UI
      const res = await axios.get(`/api/contest/${contestId}`);
      toast.success("Contestant updated successfully!");
      setContest(res.data.contest);
    } catch (err) {
      console.error("Failed to update contestant:", err);
      toast.error("Failed to update contestant.");
    }
  };

  if (!currentContestant) {
    return (
      <div className="flex min-h-screen">
        <Sidebar />
        <div className="flex-1 w-full p-6 flex items-center justify-center">
          <div className="text-center">
            <AlertTriangle className="w-16 h-16 text-yellow-500 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              Contestant Not Found
            </h2>
            <p className="text-gray-600 mb-4">
              The requested contestant could not be found.
            </p>
            <button
              onClick={() => navigate(`/contestant/${contestId}`)}
              className="px-4 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition-colors"
            >
              Back to Contestants
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen">
      <Sidebar />
      <div className="flex-1 p-6 md:ml-20 ">
        <div className="mx-auto p-6 min-h-screen">
          <div className="flex items-center gap-4 mb-8">
            <button
              onClick={() => navigate(`/contestant/${contestId}`)}
              className="p-2 rounded-full hover:bg-gray-200 transition-colors"
              aria-label="Back to Contestants"
            >
              <ChevronLeft size={24} />
            </button>
            <h2 className="text-[30px] text-left font-bold text-gray-900 mb-0">
              Contestant Details
            </h2>
          </div>
          {/* Profile Section */}
          <div className="bg-white rounded-lg p-6 mb-6 shadow-sm">
            <div className="flex items-start gap-6">
              <div className="w-32 h-32 rounded-full overflow-hidden flex-shrink-0 bg-gradient-to-r from-orange-400 to-red-400 flex items-center justify-center text-white text-4xl font-bold">
                {currentContestant.image ? (
                  <img
                    src={currentContestant.image}
                    alt={currentContestant.name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  currentContestant.name.charAt(0)
                )}
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-3">
                  <h1 className="text-3xl text-left font-bold text-gray-900">
                    {currentContestant.name}
                  </h1>
                  {currentContestant.rank === 1 && (
                    <Crown className="w-8 h-8 text-yellow-500" />
                  )}
                  {currentContestant.rank === 2 && (
                    <Medal className="w-8 h-8 text-gray-400" />
                  )}
                  {currentContestant.rank === 3 && (
                    <Award className="w-8 h-8 text-orange-600" />
                  )}
                </div>
                <p className="text-gray-500 text-left mb-6 leading-relaxed">
                  {currentContestant.email || "Email not provided."}
                </p>
                <p className="text-gray-500 text-left mb-6 leading-relaxed">
                  {currentContestant.bio ||
                    "Dedicated candidate committed to excellence and positive change in leadership."}
                </p>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                  <div className="text-center">
                    <div className="text-3xl font-bold text-gray-900">
                      {currentContestant.votes}
                    </div>
                    <div className="text-sm text-gray-600">Total Votes</div>
                  </div>
                  <div className="text-center">
                    <div
                      className={`text-3xl font-bold ${
                        currentContestant.rank === 1
                          ? "text-yellow-600"
                          : currentContestant.rank === 2
                          ? "text-gray-600"
                          : currentContestant.rank === 3
                          ? "text-orange-600"
                          : "text-gray-600"
                      }`}
                    >
                      #{currentContestant.rank}
                    </div>
                    <div className="text-sm text-gray-600">Current Rank</div>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-bold text-blue-600">
                      {currentContestant.percentage}%
                    </div>
                    <div className="text-sm text-gray-600">Vote Share</div>
                  </div>
                </div>
                <div className="flex flex-wrap gap-6 mb-6 text-sm">
                  <div>
                    <span className="text-gray-600">Contest: </span>
                    <span className="font-semibold text-gray-900">
                      {contest?.title || "Contest Name"}
                    </span>
                  </div>
                  <div>
                    <span className="text-gray-600">Position: </span>
                    <span className="font-semibold text-gray-900">
                      {position}
                    </span>
                  </div>
                </div>
                <div className="flex gap-3">
                  <button
                    onClick={() => {
                      setEditForm({
                        name: currentContestant.name || "",
                        bio: currentContestant.bio || "",
                        avatar: currentContestant.image || "",
                        position: position || "",
                        email: currentContestant.email || "",
                      });
                      setShowEditModal(true);
                    }}
                    className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
                  >
                    <Edit size={16} />
                    Edit Details
                  </button>
                  <button className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors">
                    <Share2 size={16} />
                    Share Candidate Link
                  </button>
                </div>
              </div>
            </div>
          </div>
          {/* Position Competition */}
          <div className="bg-white rounded-lg p-6 mb-6 shadow-sm">
            <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <Users className="w-5 h-5" />
              {position} Race Standings
            </h2>
            <div className="space-y-3">
              {allContestants.map((candidate, index) => (
                <div
                  key={candidate.id || index}
                  className={`flex items-center gap-4 p-3 rounded-lg transition-all duration-200 ${
                    candidate.id === currentContestant.id
                      ? "bg-gradient-to-r from-yellow-50 to-orange-50 border-2 border-yellow-200 transform scale-102"
                      : "bg-gray-50 hover:bg-gray-100"
                  }`}
                >
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
                      index === 0
                        ? "bg-yellow-500 text-white"
                        : index === 1
                        ? "bg-gray-400 text-white"
                        : index === 2
                        ? "bg-orange-500 text-white"
                        : "bg-gray-300 text-gray-700"
                    }`}
                  >
                    {candidate.rank}
                  </div>
                  <div className="w-8 h-8 bg-gradient-to-r from-orange-400 to-red-400 rounded-full flex items-center justify-center text-white text-sm font-bold">
                    {candidate.image ? (
                      <img
                        src={candidate.image}
                        alt={candidate.name}
                        className="w-full h-full object-cover rounded-full"
                      />
                    ) : (
                      candidate.name.charAt(0)
                    )}
                  </div>
                  <div className="flex-1">
                    <div className="text-left items-left gap-2">
                      <div className="font-semibold  text-gray-900">
                        {candidate.name}
                      </div>
                    </div>
                    <div className="text-sm text-left items-left text-gray-600">
                      {candidate.votes} votes • {candidate.percentage}%
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
          {/* Remove Contestant Section */}
          <div className="bg-white rounded-lg p-6 shadow-sm border-2 border-red-100">
            <h2 className="text-xl font-semibold text-red-800 mb-4 flex items-center gap-2">
              <AlertTriangle className="w-5 h-5" />
              Danger Zone
            </h2>
            <p className="text-gray-600 mb-4">
              Removing this contestant will permanently delete their profile and
              all associated votes. This action cannot be undone.
            </p>
            <button
              onClick={() => setShowRemoveModal(true)}
              className="w-full bg-red-600 hover:bg-red-700 text-white font-medium py-4 px-6 rounded-lg transition-colors"
            >
              Remove {currentContestant.name}
            </button>
          </div>
          {/* Remove Modal */}
          {showRemoveModal && (
            <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
              <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4 shadow-2xl">
                <div className="flex items-center gap-3 mb-4">
                  <AlertTriangle className="w-8 h-8 text-red-500" />
                  <h3 className="text-lg font-semibold text-gray-900">
                    Confirm Removal
                  </h3>
                </div>
                <p className="text-gray-600 mb-6">
                  Are you sure you want to remove{" "}
                  <strong>{currentContestant.name}</strong> from the {position}{" "}
                  position? This will delete their votes and cannot be undone.
                </p>
                <div className="flex gap-3 justify-end">
                  <button
                    onClick={() => setShowRemoveModal(false)}
                    className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleRemoveContestant}
                    className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors"
                  >
                    Remove Contestant
                  </button>
                </div>
              </div>
            </div>
          )}
          {/* Edit Details Modal */}
          {showEditModal && (
            <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
              <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4 shadow-2xl">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  Edit Contestant Details
                </h3>
                <form onSubmit={handleEditContestant}>
                  <div className="mb-4 flex flex-col items-left">
                    <input
                      type="file"
                      accept="image/*"
                      id="avatarFileInput"
                      className="hidden"
                      onChange={async (e) => {
                        const file = e.target.files[0];
                        const imgUrl = await uploadToCloudinary(
                          e.target.files[0]
                        );
                        if (file) {
                          const reader = new FileReader();
                          reader.onloadend = () => {
                            setEditForm((prev) => ({
                              ...prev,
                              avatar: imgUrl,
                            }));
                          };
                          reader.readAsDataURL(file);
                        }
                      }}
                    />
                    <div
                      className="w-20 h-20 rounded-full overflow-hidden bg-gradient-to-r from-orange-400 to-red-400 flex items-center justify-center text-white text-4xl font-bold cursor-pointer"
                      onClick={() =>
                        document.getElementById("avatarFileInput").click()
                      }
                    >
                      {editForm.avatar ? (
                        <img
                          src={editForm.avatar}
                          alt={editForm.name}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        editForm.name.charAt(0)
                      )}
                    </div>
                  </div>
                  <div className="mb-4">
                    <label className="block text-left text-sm font-medium text-gray-700 mb-1">
                      Name
                    </label>
                    <input
                      type="text"
                      value={editForm.name}
                      onChange={(e) =>
                        setEditForm({ ...editForm, name: e.target.value })
                      }
                      className="w-full border border-gray-300 rounded px-3 py-2"
                      required
                    />
                  </div>
                  <div className="mb-4">
                    <label className="block text-left text-sm font-medium text-gray-700 mb-1">
                      Bio
                    </label>
                    <textarea
                      value={editForm.bio || ""}
                      onChange={(e) =>
                        setEditForm({ ...editForm, bio: e.target.value })
                      }
                      className="w-full border border-gray-300 rounded px-3 py-2"
                      rows={3}
                    />
                  </div>

                  <div className="mb-4">
                    <label className="block text-left text-sm font-medium text-gray-700 mb-1">
                      Email
                    </label>
                    <input
                      type="email"
                      value={editForm.email || ""}
                      onChange={(e) =>
                        setEditForm({ ...editForm, email: e.target.value })
                      }
                      className="w-full border border-gray-300 rounded px-3 py-2"
                    />
                  </div>

                  <div className="mb-4">
                    <label className="block text-left text-sm font-medium text-gray-700 mb-1">
                      Position
                    </label>
                    <select
                      value={editForm.position}
                      onChange={(e) =>
                        setEditForm({ ...editForm, position: e.target.value })
                      }
                      className="w-full border border-gray-300 rounded px-3 py-2"
                    >
                      {contest?.positions?.map((pos) => (
                        <option key={pos.name} value={pos.name}>
                          {pos.name}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="flex justify-end gap-3">
                    <button
                      type="button"
                      onClick={() => setShowEditModal(false)}
                      className="px-4 py-2 border border-gray-300 rounded text-gray-700 hover:bg-gray-50 transition-colors"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="px-4 py-2 bg-teal-600 text-white rounded hover:bg-teal-700 transition-colors"
                    >
                      Save
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ContestantDetails;
