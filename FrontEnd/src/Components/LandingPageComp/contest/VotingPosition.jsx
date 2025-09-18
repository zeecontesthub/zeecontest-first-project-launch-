/* eslint-disable no-unused-vars */
const VotingPositionsSection = ({
  activePosition,
  onPositionChange,
  contest,
}) => {
  // const positions = [
  //   {
  //     name: "President",
  //     candidates: 8,
  //     votes: 1250,
  //     isActive: true,
  //   },
  //   {
  //     name: "Vice-President",
  //     candidates: 6,
  //     votes: 890,
  //     isActive: false,
  //   },
  //   {
  //     name: "Secretary",
  //     candidates: 5,
  //     votes: 675,
  //     isActive: false,
  //   },
  //   {
  //     name: "PRO",
  //     candidates: 4,
  //     votes: 542,
  //     isActive: false,
  //   },
  //   {
  //     name: "Treasurer",
  //     candidates: 7,
  //     votes: 823,
  //     isActive: false,
  //   },
  // ];

  // Canonical positions data for ID lookup
  // const canonicalPositions = [
  //   {
  //     name: "President",
  //     candidates: [
  //       { id: 1, name: "James Williamson", avatar: null },
  //       { id: 2, name: "Sarah Johnson", avatar: null },
  //       { id: 3, name: "Michael Brown", avatar: null },
  //       { id: 4, name: "Emily Davis", avatar: null },
  //       { id: 5, name: "David Wilson", avatar: null },
  //     ],
  //   },
  //   {
  //     name: "Vice-President",
  //     candidates: [
  //       { id: 6, name: "Alice Cooper", avatar: null },
  //       { id: 7, name: "Bob Miller", avatar: null },
  //       { id: 8, name: "Carol White", avatar: null },
  //       { id: 9, name: "Daniel Green", avatar: null },
  //       { id: 10, name: "Eva Martinez", avatar: null },
  //     ],
  //   },
  //   {
  //     name: "Secretary",
  //     candidates: [
  //       { id: 11, name: "Frank Anderson", avatar: null },
  //       { id: 12, name: "Grace Taylor", avatar: null },
  //       { id: 13, name: "Henry Lee", avatar: null },
  //     ],
  //   },
  //   {
  //     name: "PRO",
  //     candidates: [
  //       { id: 14, name: "Kate Phillips", avatar: null },
  //       { id: 15, name: "Liam Murphy", avatar: null },
  //       { id: 16, name: "Maya Patel", avatar: null },
  //     ],
  //   },
  //   {
  //     name: "Treasurer",
  //     candidates: [
  //       { id: 17, name: "Olivia Scott", avatar: null },
  //       { id: 18, name: "Paul Robinson", avatar: null },
  //       { id: 19, name: "Quinn Adams", avatar: null },
  //     ],
  //   },
  // ];

  const getPositionColors = (position, isActive) => {
    if (isActive) {
      return "bg-[#034045] text-white";
    }
    return "bg-gray-200 text-gray-700 hover:bg-gray-300";
  };

  const getRankBadgeColor = (position) => {
    switch (position) {
      case 1:
        return "bg-[#034045] text-white";
      case 2:
        return "bg-orange-500 text-white";
      case 3:
        return "bg-yellow-600 text-white";
      case 4:
        return "bg-gray-400 text-white";
      case 5:
        return "bg-gray-300 text-gray-700";
      default:
        return "bg-gray-200 text-gray-700";
    }
  };

  const currentCandidates =
    contest?.positions?.find((pos) => pos.name === activePosition)
      ?.contestants || [];

  const currentCandidatesVoters =
    contest?.positions?.find((pos) => pos.name === activePosition)?.voters ||
    [];

  // const getCanonicalCandidateId = (positionName, candidateName) => {
  //   const pos = canonicalPositions.find((p) => p.name === positionName);
  //   if (!pos) return null;
  //   const cand = pos.candidates.find((c) => c.name === candidateName);
  //   return cand ? cand.id : null;
  // };

  return (
    <div className="w-full mx-auto mt-6">
      <div className="flex overflow-x-auto gap-3 mb-8 shadow-sm p-4 rounded-xl">
        {contest?.positions.map((position) => (
          <button
            key={position.name}
            onClick={() => onPositionChange(position.name)}
            className={`flex-shrink-0 px-6 py-3 rounded-xl font-medium transition-all duration-200 cursor-pointer whitespace-nowrap ${getPositionColors(
              position.name,
              activePosition === position.name
            )}`}
          >
            <div className="font-semibold">{position.name}</div>

            {/* Show details on medium screens and up */}
            <div className="text-xs opacity-80 hidden md:block">
              {position?.contestants?.length ?? 0} Candidates •{" "}
              {!contest?.isClosedContest
                ? // ✅ OPEN contest: sum multipliers of voters for this position
                  position?.voters?.reduce(
                    (total, voter) => total + (voter.multiplier || 0),
                    0
                  ) ?? 0
                : // ✅ CLOSED contest: sum multipliers of matching votes
                  contest?.closedContestVoters?.reduce((total, voter) => {
                    const count =
                      voter.votedFor?.filter(
                        (v) => v.positionTitle === position?.name
                      ).length || 0;
                    return total + count * (voter.multiplier || 0);
                  }, 0) ?? 0}{" "}
              votes
            </div>
          </button>
        ))}
      </div>

      <div className="bg-white rounded-xl shadow-sm overflow-hidden p-4 md:p-6">
        <div className="pl-0 py-4 md:p-6">
          <h2 className="text-2xl font-bold text-gray-900">
            {activePosition} Leaderboard
          </h2>
        </div>

        <div className="bg-white rounded-xl overflow-hidden p-0 md:p-6">
          <div>
            {(() => {
              // 1️⃣ Pre-compute vote totals for all candidates
              const candidatesWithVotes = currentCandidates.map((candidate) => {
                let votes = 0;

                if (!contest?.isClosedContest) {
                  votes =
                    currentCandidatesVoters
                      ?.filter(
                        (voter) =>
                          voter.votedFor?.toString() ===
                          candidate._id?.toString()
                      )
                      .reduce(
                        (total, voter) => total + (voter.multiplier || 0),
                        0
                      ) || 0;
                } else {
                  votes =
                    contest.closedContestVoters?.reduce((total, voter) => {
                      const count =
                        voter.votedFor?.filter(
                          (v) =>
                            v.votedFor?.toString() === candidate._id?.toString()
                        ).length || 0;
                      return total + count * (voter.multiplier || 0);
                    }, 0) || 0;
                }

                return { ...candidate, votes };
              });

              // 2️⃣ Find the highest vote total
              const maxVotes = Math.max(
                0,
                ...candidatesWithVotes.map((c) => c.votes)
              );

              // 3️⃣ Sort by votes (descending) for ranking badges
              const sorted = [...candidatesWithVotes].sort(
                (a, b) => b.votes - a.votes
              );

              // 4️⃣ Render
              return sorted.map((candidate, index) => (
                <div
                  key={candidate._id}
                  className="p-4 md:p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between
                   bg-[#D9D9D94D] hover:bg-gray-50 transition-colors duration-200 rounded-xl mb-4"
                >
                  <div className="flex items-center gap-2 md:gap-4">
                    <div
                      className={`w-10 h-10 md:w-12 md:h-12 rounded-full flex items-center justify-center
                        font-bold text-sm md:text-lg ${getRankBadgeColor(
                          index + 1
                        )}`}
                    >
                      {index + 1}
                    </div>

                    <div className="w-10 h-10 md:w-12 md:h-12 bg-black rounded-full flex items-center justify-center overflow-hidden">
                      {candidate.image ? (
                        <img
                          src={candidate.image}
                          alt={candidate.name}
                          className="w-full h-full object-cover rounded-full"
                        />
                      ) : (
                        <span className="text-white text-xs">No Img</span>
                      )}
                    </div>

                    <div>
                      <h3 className="text-base md:text-lg font-semibold text-gray-900">
                        {candidate.name}
                      </h3>
                      <p className="text-gray-600 text-sm">
                        {candidate.votes} Votes
                      </p>
                    </div>
                  </div>

                  {/* ✅ Show “Leading” only if this candidate has the highest votes */}

                  <div className="flex items-center gap-3 mt-3 sm:mt-0">
                    {candidate.votes === maxVotes && maxVotes > 0 && (
                      <div className="bg-[#00B25F] text-white px-4 md:px-6 py-2 rounded-[20px] font-medium text-sm">
                        Leading
                      </div>
                    )}
                    <button
                      className="bg-orange-500 hover:bg-orange-600 text-white px-4 md:px-6 py-2 rounded-[20px] font-medium text-sm transition-colors"
                      onClick={() => {
                        window.location.href = `/vote/${
                          contest._id
                        }?position=${encodeURIComponent(
                          activePosition
                        )}&candidateId=${encodeURIComponent(
                          candidate._id
                        )}&candidateName=${encodeURIComponent(candidate.name)}`;
                      }}
                    >
                      Vote
                    </button>
                  </div>
                </div>
              ));
            })()}
          </div>
        </div>
      </div>
    </div>
  );
};

export default VotingPositionsSection;
