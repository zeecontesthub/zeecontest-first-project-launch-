import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ChevronLeft, Check } from "lucide-react";
import axios from "axios";

const VotingFlow = () => {
  const [currentStep, setCurrentStep] = useState("cast");
  const [currentPositionIndex, setCurrentPositionIndex] = useState(0);
  const [votes, setVotes] = useState({});

  const { contestId } = useParams();
  const [contest, setContest] = useState(null);
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

  // Dynamically pull positions from contest
  const positions = contest?.positions || [];
  const currentPosition = positions[currentPositionIndex];

  const handleCandidateSelect = (candidate) => {
    setVotes((prev) => ({
      ...prev,
      [currentPosition.name]: candidate,
    }));
  };

  const handleNextPosition = () => {
    if (currentPositionIndex < positions.length - 1) {
      setCurrentPositionIndex((prev) => prev + 1);
    } else {
      setCurrentStep("review");
    }
  };

  const handleSkipToReview = () => {
    setCurrentStep("review");
  };

  const handleBackToCasting = () => {
    setCurrentStep("cast");
  };

  const handleSubmitVotes = async () => {
    try {
      // await axios.post(`/api/contest/${contestId}/vote`, { votes });
      console.log(votes);
      alert("Votes submitted successfully!");
      navigate("/thank-you"); // redirect after voting
    } catch (err) {
      console.error("Failed to submit votes:", err);
      alert("Failed to submit votes, please try again.");
    }
  };

  // =========================
  // Casting Screen
  // =========================
  if (currentStep === "cast") {
    return (
      <div className="px-4 md:px-30 py-8 bg-[#F8F8F8]">
        <div className="mx-auto">
          <div className="flex items-center gap-4 mb-8">
            <button
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              onClick={() => navigate(-1)}
            >
              <ChevronLeft className="w-8 h-8 text-gray-900" />
            </button>
            <h1 className="text-2xl font-bold text-gray-900">Cast your vote</h1>
          </div>

          {/* Positions Tabs */}
          <div className="mb-8">
            <p className="text-gray-700 mb-4">Select your position</p>
            <div className="flex flex-wrap gap-3">
              {positions.map((position, index) => (
                <button
                  key={position._id || position.name}
                  onClick={() => setCurrentPositionIndex(index)}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                    index === currentPositionIndex
                      ? "bg-[#034045] text-white"
                      : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                  }`}
                >
                  {position.name}
                  <span className="ml-2 text-xs">
                    {position?.contestants?.length || 0}
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* Candidates List */}
          <div className="mb-8">
            <p className="text-gray-700 mb-4">
              Select the contestant you want to vote for
            </p>
            <div className="space-y-3">
              {currentPosition?.contestants?.map((candidate) => (
                <div
                  key={candidate._id}
                  onClick={() => handleCandidateSelect(candidate)}
                  className="flex items-center justify-between p-4 bg-[#D9D9D94D] rounded-lg border-2 border-gray-200 hover:border-gray-300 cursor-pointer transition-colors"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-black rounded-full overflow-hidden">
                      {candidate.image ? (
                        <img
                          src={candidate.image}
                          alt={candidate.name}
                          className="w-full h-full object-cover"
                        />
                      ) : null}
                    </div>
                    <span className="text-lg font-medium text-gray-900">
                      {candidate.name}
                    </span>
                  </div>
                  <div
                    className={`w-6 h-6 border-2 rounded ${
                      votes[currentPosition.name]?._id === candidate._id
                        ? "bg-[#034045] border-[#034045]"
                        : "border-gray-300"
                    } flex items-center justify-center`}
                  >
                    {votes[currentPosition.name]?._id === candidate._id && (
                      <Check className="w-4 h-4 text-white" />
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Navigation */}
          <div className="space-y-4">
            <button
              onClick={handleNextPosition}
              disabled={!votes[currentPosition?.name]}
              className={`w-full py-4 rounded-lg font-semibold text-lg transition-colors ${
                votes[currentPosition?.name]
                  ? "bg-[#034045] hover:bg-[#045a60] text-white"
                  : "bg-gray-200 text-gray-400 cursor-not-allowed"
              }`}
            >
              {currentPositionIndex < positions.length - 1
                ? "Next Position"
                : "Review Votes"}
            </button>

            <div className="text-center">
              <button
                onClick={handleSkipToReview}
                className="text-[#034045] underline hover:text-[#045a60] transition-colors"
              >
                Skip other Positions and Submit my Vote
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // =========================
  // Review Screen
  // =========================
  return (
    <div className="px-4 md:px-30 py-8 bg-[#F8F8F8] p-4">
      <div className="mx-auto">
        <div className="flex items-center gap-4 mb-8">
          <button
            onClick={handleBackToCasting}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <ChevronLeft className="w-8 h-8 text-gray-900" />
          </button>
          <h1 className="text-2xl font-bold text-gray-900">
            Review your votes
          </h1>
        </div>

        <div className="space-y-4 mb-8">
          {positions.map((position) => (
            <div
              key={position._id || position.name}
              className="bg-[#D9D9D94D] rounded-lg p-6 border border-gray-200"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500 mb-1">{position.name}</p>
                  <p className="text-xl font-bold text-gray-900">
                    {votes[position.name]?.name || "No selection"}
                  </p>
                </div>
              </div>

              {!votes[position.name] && (
                <button
                  onClick={() => {
                    const positionIndex = positions.findIndex(
                      (p) => p.name === position.name
                    );
                    setCurrentPositionIndex(positionIndex);
                    setCurrentStep("cast");
                  }}
                  className="mt-3 text-[#034045] hover:text-[#045a60] transition-colors text-sm underline"
                >
                  Select candidate
                </button>
              )}
            </div>
          ))}
        </div>

        <div className="space-y-4">
          <button
            onClick={handleSubmitVotes}
            disabled={Object.keys(votes).length === 0}
            className={`w-full py-4 rounded-lg font-semibold text-lg transition-colors ${
              Object.keys(votes).length > 0
                ? "bg-[#034045] hover:bg-[#045a60] text-white"
                : "bg-gray-200 text-gray-400 cursor-not-allowed"
            }`}
          >
            Cast my votes
          </button>

          <button
            onClick={handleBackToCasting}
            className="w-full py-4 rounded-lg font-semibold text-lg border-2 border-[#034045] text-[#034045] hover:bg-[#034045] hover:text-white transition-colors"
          >
            Continue Voting
          </button>
        </div>
      </div>
    </div>
  );
};

export default VotingFlow;
