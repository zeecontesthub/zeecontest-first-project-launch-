import React, { useState } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

const ContestDetailsStep = ({
  formData,
  onInputChange,
  positions,
  onAddPosition,
  onUpdatePosition,
  onRemovePosition,
  setCreateContest,
}) => {
  const [editIndex, setEditIndex] = useState(null);

  const handleEditClick = (index) => {
    setEditIndex(index);
  };

  const handleSaveClick = () => {
    setEditIndex(null);
  };

  return (
    <div className="space-y-8">
      {/* Basic Content Information */}
      <div className="bg-[#FBF7F7] p-10">
        <div>
          <h2 className="text-xl text-left font-semibold text-gray-900 mb-6">
            Basic Content Information
          </h2>

          <div className="space-y-6">
            {/* Contest Name */}
            <div>
              <label className="block text-left text-sm font-medium text-gray-700 mb-2">
                Contest Name
              </label>
              <input
                type="text"
                value={formData.contestName}
                onChange={(e) => {
                  onInputChange("contestName", e.target.value);
                  setCreateContest((prev) => ({
                    ...prev,
                    title: e.target.value,
                  }));
                }}
                placeholder="Enter the Name of your Contest"
                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-md focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none transition-colors"
              />
            </div>

            {/* Contest Description */}
            <div>
              <label className="block text-sm text-left font-medium text-gray-700 mb-2">
                Contest Description
              </label>
              <textarea
                value={formData.contestDescription}
                onChange={(e) => {
                  onInputChange("contestDescription", e.target.value);
                  setCreateContest((prev) => ({
                    ...prev,
                    description: e.target.value,
                  }));
                }}
                placeholder="Describe your contest"
                rows={4}
                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-md focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none transition-colors resize-none"
              />
            </div>

            {/* Date Fields */}
            <div className="grid grid-cols-1 text-left md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Start Date
                </label>
                <DatePicker
                  selected={
                    formData.startDate ? formData.startDate : null
                  }
                  // value={formData?.startDate?.split("T")[0]}
                  onChange={(date) => {
                    onInputChange(
                      "startDate",
                      date ? date.toISOString().split("T")[0] : ""
                    );
                    setCreateContest((prev) => ({
                      ...prev,
                      startDate: date ? date.toISOString().split("T")[0] : "",
                    }));
                  }}
                  minDate={new Date()}
                  dateFormat="yyyy-MM-dd"
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-md focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none transition-colors"
                  placeholderText="Select start date"
                />
              </div>
              <div>
                <label className="block text-sm text-left font-medium text-gray-700 mb-2">
                  End Date
                </label>
                <DatePicker
                  selected={
                    formData.endDate ? formData.endDate : null
                  }
                  // value={formData.endDate?.split("T")[0]}
                  onChange={(date) => {
                    onInputChange(
                      "endDate",
                      date ? date.toISOString().split("T")[0] : ""
                    );
                    setCreateContest((prev) => ({
                      ...prev,
                      endDate: date ? date.toISOString().split("T")[0] : "",
                    }));
                  }}
                  minDate={
                    formData.startDate
                      ? new Date(formData.startDate)
                      : new Date()
                  }
                  dateFormat="yyyy-MM-dd"
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-md focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none transition-colors"
                  placeholderText="Select end date"
                />
              </div>
            </div>

            {/* Time Fields */}
            <div className="grid grid-cols-1 text-left md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Start Time
                </label>
                <div className="flex space-x-2">
                  <select
                    value={formData?.startTime?.startTimeHour || ""}
                    onChange={(e) => {
                      onInputChange("startTime", {
                        ...formData.startTime,
                        startTimeHour: e.target.value,
                      });
                      setCreateContest((prev) => ({
                        ...prev,
                        startTime: {
                          ...prev.startTime,
                          startTimeHour: e.target.value,
                        },
                      }));
                    }}
                    className="w-16 px-2 py-3 bg-gray-50 border border-gray-200 rounded-md focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none transition-colors"
                  >
                    <option value="">HH</option>
                    {[...Array(12)].map((_, i) => {
                      const hour = i + 1;
                      return (
                        <option key={hour} value={hour}>
                          {hour}
                        </option>
                      );
                    })}
                  </select>
                  <span>:</span>
                  <select
                    value={formData?.startTime?.startTimeMinute || ""}
                    onChange={(e) => {
                      onInputChange("startTime", {
                        ...formData.startTime,
                        startTimeMinute: e.target.value,
                      });
                      setCreateContest((prev) => ({
                        ...prev,
                        startTime: {
                          ...prev.startTime,
                          startTimeMinute: e.target.value,
                        },
                      }));
                    }}
                    className="w-16 px-2 py-3 bg-gray-50 border border-gray-200 rounded-md focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none transition-colors"
                  >
                    <option value="">MM</option>
                    {[...Array(60)].map((_, i) => {
                      const minute = i.toString().padStart(2, "0");
                      return (
                        <option key={minute} value={minute}>
                          {minute}
                        </option>
                      );
                    })}
                  </select>
                  <select
                    value={formData?.startTime?.startTimeAmPm || "AM"}
                    onChange={(e) => {
                      onInputChange("startTime", {
                        ...formData.startTime,
                        startTimeAmPm: e.target.value,
                      });
                      setCreateContest((prev) => ({
                        ...prev,
                        startTime: {
                          ...prev.startTime,
                          startTimeAmPm: e.target.value,
                        },
                      }));
                    }}
                    className="w-20 px-2 py-3 bg-gray-50 border border-gray-200 rounded-md focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none transition-colors"
                  >
                    <option value="AM">AM</option>
                    <option value="PM">PM</option>
                  </select>
                </div>
              </div>
              <div>
                <label className="block text-sm text-left font-medium text-gray-700 mb-2">
                  End Time
                </label>
                <div className="flex space-x-2">
                  <select
                    value={formData?.endTime?.endTimeHour || ""}
                    onChange={(e) => {
                      onInputChange("endTime", {
                        ...formData.endTime,
                        endTimeHour: e.target.value,
                      });
                      setCreateContest((prev) => ({
                        ...prev,
                        endTime: {
                          ...prev.endTime,
                          endTimeHour: e.target.value,
                        },
                      }));
                    }}
                    className="w-16 px-2 py-3 bg-gray-50 border border-gray-200 rounded-md focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none transition-colors"
                  >
                    <option value="">HH</option>
                    {[...Array(12)].map((_, i) => {
                      const hour = i + 1;
                      return (
                        <option key={hour} value={hour}>
                          {hour}
                        </option>
                      );
                    })}
                  </select>
                  <span>:</span>
                  <select
                    value={formData?.endTime?.endTimeMinute || ""}
                    onChange={(e) => {
                      onInputChange("endTime", {
                        ...formData.endTime,
                        endTimeMinute: e.target.value,
                      });
                      setCreateContest((prev) => ({
                        ...prev,
                        endTime: {
                          ...prev.endTime,
                          endTimeMinute: e.target.value,
                        },
                      }));
                    }}
                    className="w-16 px-2 py-3 bg-gray-50 border border-gray-200 rounded-md focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none transition-colors"
                  >
                    <option value="">MM</option>
                    {[...Array(60)].map((_, i) => {
                      const minute = i.toString().padStart(2, "0");
                      return (
                        <option key={minute} value={minute}>
                          {minute}
                        </option>
                      );
                    })}
                  </select>
                  <select
                    value={formData?.endTime?.endTimeAmPm || "AM"}
                    onChange={(e) => {
                      onInputChange("endTime", {
                        ...formData.endTime,
                        endTimeAmPm: e.target.value,
                      });
                      setCreateContest((prev) => ({
                        ...prev,
                        endTime: {
                          ...prev.endTime,
                          endTimeAmPm: e.target.value,
                        },
                      }));
                    }}
                    className="w-20 px-2 py-3 bg-gray-50 border border-gray-200 rounded-md focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none transition-colors"
                  >
                    <option value="AM">AM</option>
                    <option value="PM">PM</option>
                  </select>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Position Setup */}
        <div className="bg-[#FBF7F7] p-10 mt-10 rounded-md">
          <div className="flex items-center text-left justify-between mb-6">
            <h2 className="text-xl font-semibold text-gray-900">
              Position Setup
            </h2>
            <button
              onClick={onAddPosition}
              className="bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded-md font-medium transition-colors text-sm"
            >
              Create Position
            </button>
          </div>

          {/* Position Cards */}
          {positions.length === 0 ? (
            <div className="bg-gray-50 rounded-lg px-6 py-12 text-center text-gray-500">
              No positions added yet. Click "Add Position" to get started.
            </div>
          ) : (
            <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
              <div className="grid grid-cols-3 gap-4 px-6 py-4 bg-gray-50 font-medium text-gray-700 text-sm border-b border-gray-200">
                <div>Name</div>
                <div>Description</div>
                <div>Actions</div>
              </div>
              <div className="divide-y divide-gray-200">
                {positions.map((position, index) => (
                  <div
                    key={index}
                    className="grid grid-cols-3 gap-4 px-6 py-4 text-sm items-center"
                  >
                    {editIndex === index ? (
                      <>
                        <input
                          type="text"
                          value={position.name}
                          onChange={(e) =>
                            onUpdatePosition(index, "name", e.target.value)
                          }
                          placeholder="Enter position name"
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none"
                        />
                        <input
                          type="text"
                          value={position.description}
                          onChange={(e) =>
                            onUpdatePosition(
                              index,
                              "description",
                              e.target.value
                            )
                          }
                          placeholder="Enter position description"
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none"
                        />
                        <div className="flex space-x-2">
                          <button
                            onClick={handleSaveClick}
                            className="text-green-600 hover:text-green-800"
                            aria-label="Save position"
                          >
                            <svg
                              className="w-5 h-5"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M5 13l4 4L19 7"
                              />
                            </svg>
                          </button>
                          <button
                            onClick={() => onRemovePosition(index)}
                            className="text-red-600 hover:text-red-800"
                            aria-label="Delete position"
                          >
                            <svg
                              className="w-5 h-5"
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
                      </>
                    ) : (
                      <>
                        <div className="text-gray-900">{position.name}</div>
                        <div className="text-gray-600">
                          {position.description}
                        </div>
                        <div className="flex space-x-4">
                          <button
                            onClick={() => handleEditClick(index)}
                            className="text-gray-400 hover:text-gray-600"
                            aria-label="Edit position"
                          >
                            <svg
                              className="w-5 h-5"
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
                            onClick={() => onRemovePosition(index)}
                            className="text-red-600 hover:text-red-800"
                            aria-label="Delete position"
                          >
                            <svg
                              className="w-5 h-5"
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
                      </>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Paid Contest Section */}
        <div className="bg-[#FBF7F7] p-10 mt-10 rounded-md">
          <h2 className="text-xl font-semibold text-gray-900 text-left mb-4">
            Payment Setup
          </h2>
          <div className="flex items-center space-x-6">
            <span className="text-sm font-medium text-gray-700">
              Is this a paid contest?
            </span>
            <button
              type="button"
              onClick={() => {
                onInputChange("payment", { ...formData.payment, isPaid: true });
                setCreateContest((prev) => ({
                  ...prev,
                  payment: {
                    ...prev.payment,
                    isPaid: true,
                  },
                }));
              }}
              className={`px-4 py-2 rounded-md font-medium text-sm transition-colors ${
                formData.payment?.isPaid === true
                  ? "bg-orange-500 text-white"
                  : "bg-gray-200 text-gray-700"
              }`}
            >
              Yes
            </button>
            <button
              type="button"
              onClick={() => {
                onInputChange("payment", {
                  ...formData.payment,
                  isPaid: false,
                });
                setCreateContest((prev) => ({
                  ...prev,
                  payment: {
                    ...prev.payment,
                    isPaid: false,
                  },
                }));
              }}
              className={`px-4 py-2 rounded-md font-medium text-sm transition-colors ${
                formData.payment?.isPaid === false
                  ? "bg-orange-500 text-white"
                  : "bg-gray-200 text-gray-700"
              }`}
            >
              No
            </button>
          </div>
          {formData?.payment?.isPaid && (
            <div className="mt-4">
              <label
                htmlFor="voterFee"
                className="block text-sm font-medium text-left text-gray-700 mb-2"
              >
                Amount each voter should pay
              </label>
              <input
                id="voterFee"
                type="number"
                min="0"
                step="0.01"
                value={formData?.payment?.amount || ""}
                onChange={(e) => {
                  onInputChange("payment", {
                    ...formData.payment,
                    amount: e.target.value,
                  });
                  setCreateContest((prev) => ({
                    ...prev,
                    payment: {
                      ...prev.payment,
                      amount: e.target.value,
                    },
                  }));
                }}
                placeholder="Enter amount"
                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-md focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none transition-colors"
              />
            </div>
          )}
        </div>

        {/* Voters Setting Section */}
        <div className="bg-[#FBF7F7] p-10 mt-10 rounded-md">
          <h2 className="text-xl font-semibold text-gray-900 text-left mb-4">
            Voters Setting
          </h2>
          <div className="flex items-center space-x-6">
            <span className="text-sm font-medium text-gray-700">
              Allow multiple votes
            </span>
            <button
              type="button"
              onClick={() => {
                onInputChange("allowMultipleVotes", true);
                setCreateContest((prev) => ({
                  ...prev,
                  allowMultipleVotes: true,
                }));
              }}
              className={`px-4 py-2 rounded-md font-medium text-sm transition-colors ${
                formData.allowMultipleVotes
                  ? "bg-orange-500 text-white"
                  : "bg-gray-200 text-gray-700"
              }`}
            >
              Yes
            </button>
            <button
              type="button"
              onClick={() => {
                onInputChange("allowMultipleVotes", false);
                setCreateContest((prev) => ({
                  ...prev,
                  allowMultipleVotes: false,
                }));
              }}
              className={`px-4 py-2 rounded-md font-medium text-sm transition-colors ${
                formData.allowMultipleVotes === false
                  ? "bg-orange-500 text-white"
                  : "bg-gray-200 text-gray-700"
              }`}
            >
              No
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContestDetailsStep;
