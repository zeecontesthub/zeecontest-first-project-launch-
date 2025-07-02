import { FileText } from "lucide-react";

const ContestantDetailsStep = ({
  contestantForm,
  onContestantInputChange,
  onContestantImageUpload,
  onAddContestant,
  onRemoveContestant,
  contestants,
  onBulkUpload,
  handleDragOver,
  handleDrop,
  positions,
}) => {
  return (
    <div className="space-y-8 bg-[#FBF7F7] p-10">
      {/* Manual Contestant Entry */}
      <div>
        <h2 className="text-xl text-left font-semibold text-gray-900 mb-6">
          Manual Contestant Entry
        </h2>

        <div className="space-y-6">
          {/* Contestant Name */}
          <div>
            <label className="block text-left text-sm font-medium text-gray-700 mb-2">
              Contestant Name
            </label>
            <input
              type="text"
              value={contestantForm.name}
              onChange={(e) => onContestantInputChange("name", e.target.value)}
              placeholder="Enter Contestant Name"
              className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-md focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none transition-colors"
            />
          </div>

          {/* Short Bio */}
          <div>
            <label className="block text-sm text-left font-medium text-gray-700 mb-2">
              Short Bio
            </label>
            <textarea
              value={contestantForm.bio}
              onChange={(e) => onContestantInputChange("bio", e.target.value)}
              placeholder="Enter Contest Bio"
              rows={4}
              className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-md focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none transition-colors resize-none"
            />
          </div>

          {/* Position */}
          <div>
            <label className="block text-sm text-left font-medium text-gray-700 mb-2">
              Position
            </label>
            <select
              value={contestantForm.position}
              onChange={(e) =>
                onContestantInputChange("position", e.target.value)
              }
              className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-md focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none transition-colors appearance-none"
            >
              <option value="">Select Position</option>
              {positions
                ? positions.map((position, id) => (
                    <option key={id} value={position.name}>
                      {position.name}
                    </option>
                  ))
                : null}
            </select>
          </div>

          {/* Email */}
          <div>
            <label className="block text-sm text-left font-medium text-gray-700 mb-2">
              Email
            </label>
            <input
              type="email"
              value={contestantForm?.email}
              onChange={(e) => onContestantInputChange("email", e.target.value)}
              placeholder="Enter Contestant Email"
              className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-md focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none transition-colors"
            />
          </div>

          {/* Contestant Image */}
          <div>
            <label className="block text-sm text-left font-medium text-gray-700 mb-2">
              Contestant Image
            </label>
            <div className="flex items-center space-x-4">
              <div className="flex-1 px-4 py-3 bg-gray-50 border border-gray-200 rounded-md text-gray-500">
                {contestantForm.image
                  ? contestantForm.image.name
                  : "No file selected"}
              </div>
              <button
                onClick={() =>
                  document.getElementById("contestant-image-input").click()
                }
                className="bg-teal-700 hover:bg-teal-800 text-white px-6 py-3 rounded-md font-medium transition-colors"
              >
                Browse
              </button>
              <input
                id="contestant-image-input"
                type="file"
                accept="image/*"
                onChange={(e) => onContestantImageUpload(e.target.files[0])}
                className="hidden"
              />
            </div>
          </div>

          {/* Add Contestant Button */}
          <div className="flex justify-end">
            <button
              onClick={onAddContestant}
              className="bg-orange-500 hover:bg-orange-600 text-white px-8 py-3 rounded-md font-medium transition-colors"
            >
              Add Contestant
            </button>
          </div>
        </div>
      </div>

      {/* Bulk Upload */}
      <div>
        <h2 className="text-xl font-semibold text-left text-gray-900 mb-6">
          Bulk Upload
        </h2>

        <div className="bg-gray-50 border border-gray-200 rounded-lg p-8">
          <div
            className="border-2 border-dashed border-gray-300 rounded-lg p-12 text-center hover:border-orange-400 transition-colors cursor-pointer"
            onDragOver={handleDragOver}
            onDrop={(e) => handleDrop(e, "bulk")}
            onClick={() => document.getElementById("bulk-upload-input").click()}
          >
            <FileText className="mx-auto h-12 w-12 text-gray-400 mb-4" />
            <p className="text-gray-600 mb-2">
              Drag and Drop your CSV file here
            </p>
            <p className="text-gray-500 mb-4">Or</p>
            <button className="bg-orange-500 hover:bg-orange-600 text-white px-6 py-2 rounded-md font-medium transition-colors">
              Browse
            </button>
            <p className="text-xs text-gray-500 mt-4">
              File must include Contestant Name, Position, and Bio
            </p>
            <input
              id="bulk-upload-input"
              type="file"
              accept=".csv"
              onChange={(e) => onBulkUpload(e.target.files[0])}
              className="hidden"
            />
          </div>
        </div>
      </div>

      {/* Contestant List */}
      <div>
        <h2 className="text-xl font-semibold text-left text-gray-900 mb-6">
          Contestant List
        </h2>

        <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
          <div className="grid grid-cols-5 gap-4 px-6 py-4 bg-gray-50 font-medium text-gray-700 text-sm border-b border-gray-200">
            <div>Image</div>
            <div>Name</div>
            <div>Position</div>
            <div>Bio</div>
            <div>Actions</div>
          </div>

          {contestants.length === 0 ? (
            <div className="px-6 py-12 text-center text-gray-500">
              No contestants added yet.
            </div>
          ) : (
            <div className="divide-y divide-gray-200">
              {contestants.map((contestant) => (
                <div
                  key={contestant.id}
                  className="grid grid-cols-5 gap-4 px-6 py-4 text-sm items-center"
                >
                  <div>
                    <div className="w-10 h-10 bg-gray-300 rounded-full flex items-center justify-center">
                      {contestant.image ? (
                        <img
                          src={
                            contestant.image
                              ? typeof contestant.image === "string"
                                ? contestant.image
                                : URL.createObjectURL(contestant.image)
                              : ""
                          }
                          alt={contestant.name}
                          className="w-10 h-10 rounded-full object-cover"
                        />
                      ) : (
                        <span className="text-gray-600 text-xs font-medium">
                          {contestant.name?.charAt(0) || "J"}
                        </span>
                      )}
                    </div>
                  </div>
                  <div className="text-gray-900 font-medium">
                    {contestant.name}
                  </div>
                  <div className="text-gray-600">{contestant.position}</div>
                  <div className="text-gray-600 truncate">{contestant.bio}</div>
                  <div className="flex items-center space-x-2">
                    <button className="text-gray-400 hover:text-gray-600">
                      <svg
                        className="w-4 h-4"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"
                        />
                      </svg>
                    </button>
                    <button
                      onClick={() => onRemoveContestant(contestant.id)}
                      className="text-red-400 hover:text-red-600"
                    >
                      <svg
                        className="w-4 h-4"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                        />
                      </svg>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ContestantDetailsStep;
