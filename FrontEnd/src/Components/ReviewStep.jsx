// import { useUser } from "../context/UserContext";

const ReviewStep = ({
  coverImage,
  logoImage,
  formData,
  contestants,
  onEditStep,
}) => {
  //   const { createContest } = useUser();
  return (
    <div className="space-y-8 bg-[#FBF7F7] p-10">
      {/* Cover Image Section */}
      <div className="mb-8">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-semibold">Cover Images</h2>
          <button
            className="text-teal-600 hover:text-black"
            onClick={() => onEditStep(1)}
          >
            Edit
          </button>
        </div>
        <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center">
          {coverImage ? (
            <img
              src={
                typeof coverImage === "string"
                  ? coverImage
                  : URL.createObjectURL(coverImage)
              }
              alt="Cover"
              className="max-h-64 mx-auto rounded"
            />
          ) : (
            <p className="text-gray-500 mb-2">No cover image uploaded</p>
          )}
        </div>
      </div>

      {/* Contest Logo Section */}
      <div className="mb-8">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-semibold">Contest Logo Image</h2>
          <button
            className="text-teal-600 hover:text-black"
            onClick={() => onEditStep(1)}
          >
            Edit
          </button>
        </div>
        <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center">
          {logoImage ? (
            <img
              src={
                typeof logoImage === "string"
                  ? logoImage
                  : URL.createObjectURL(logoImage)
              }
              alt="Logo"
              className="max-h-32 mx-auto rounded"
            />
          ) : (
            <p className="text-gray-500 mb-2">No logo image uploaded</p>
          )}
        </div>
      </div>

      {/* Basic Contest Information */}
      <div className="mb-8">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-semibold">Basic Contest Information</h2>
          <button
            className="text-teal-600 hover:text-black"
            onClick={() => onEditStep(2)}
          >
            Edit
          </button>
        </div>
        <div className="bg-gray-50 p-4 rounded-lg">
          <div className="mb-4">
            <label className="block text-sm text-left font-medium text-gray-700 mb-1">
              Contest Name
            </label>
            <p className="bg-white p-2 rounded border border-gray-200">
              {formData.contestName || "Not specified"}
            </p>
          </div>
          <div className="mb-4">
            <label className="block text-sm text-left font-medium text-gray-700 mb-1">
              Contest Description
            </label>
            <p className="bg-white p-2 rounded border border-gray-200">
              {formData.contestDescription || "Not specified"}
            </p>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm text-left font-medium text-gray-700 mb-1">
                Start Date
              </label>
              <p className="bg-white p-2 rounded border border-gray-200">
                {formData.startDate || "Not specified"}
              </p>
            </div>
            <div>
              <label className="block text-sm text-left font-medium text-gray-700 mb-1">
                End Date
              </label>
              <p className="bg-white p-2 rounded border border-gray-200">
                {formData.endDate || "Not specified"}
              </p>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4 mt-4">
            <div>
              <label className="block text-sm text-left font-medium text-gray-700 mb-1">
                Start Time
              </label>
              <p className="bg-white p-2  rounded border border-gray-200">
                {formData?.startTime.startTimeHour +
                  ":" +
                  formData?.startTime.startTimeMinute +
                  " " +
                  (formData?.startTime.startTimeAmPm || "AM") ||
                  "Not specified"}
              </p>
            </div>
            <div>
              <label className="block text-sm text-left font-medium text-gray-700 mb-1">
                End Time
              </label>
              <p className="bg-white p-2 rounded border border-gray-200">
                {formData.endTime.endTimeHour +
                  ":" +
                  formData.endTime.endTimeMinute +
                  " " +
                  (formData.endTime.endTimeAmPm || "AM") || "Not specified"}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Contestant List */}
      <div className="mb-8">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-semibold">Contestant List</h2>
          <button
            className="text-teal-600 hover:text-black"
            onClick={() => onEditStep(3)}
          >
            Edit
          </button>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white border border-gray-200">
            <thead>
              <tr className="bg-gray-50">
                <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">
                  Image
                </th>
                <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">
                  Name
                </th>
                <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">
                  Position
                </th>
                <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">
                  Bio
                </th>
              </tr>
            </thead>
            <tbody>
              {contestants.length === 0 ? (
                <tr>
                  <td
                    colSpan="4"
                    className="px-4 py-6 text-center text-gray-500"
                  >
                    No contestants added yet
                  </td>
                </tr>
              ) : (
                contestants.map((contestant, index) => (
                  <tr
                    key={contestant.id}
                    className={index % 2 === 0 ? "bg-white" : "bg-gray-50"}
                  >
                    <td className="px-4 py-2 border-t border-gray-200">
                      {contestant.image ? (
                        <img
                          src={
                            typeof contestant.image === "string"
                              ? contestant.image
                              : URL.createObjectURL(contestant.image)
                          }
                          alt={contestant.name}
                          className="w-10 h-10 rounded-full object-cover"
                        />
                      ) : (
                        <div className="w-10 h-10 bg-gray-300 rounded-full flex items-center justify-center">
                          <span className="text-xs font-medium">
                            {contestant.name?.charAt(0) || "?"}
                          </span>
                        </div>
                      )}
                    </td>
                    <td className="px-4 py-2 border-t border-gray-200">
                      {contestant.name}
                    </td>
                    <td className="px-4 py-2 border-t border-gray-200">
                      {contestant.position}
                    </td>
                    <td className="px-4 py-2 border-t border-gray-200">
                      {contestant.bio}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default ReviewStep;
