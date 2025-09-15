import React, { useState } from "react";

// Mock DatePicker component since react-datepicker isn't available
// eslint-disable-next-line no-unused-vars
const DatePicker = ({ selected, onChange, minDate, dateFormat, className, placeholderText }) => {
  const formatDate = (date) => {
    if (!date) return '';
    return date.toISOString().split('T')[0];
  };

  const handleDateChange = (e) => {
    const value = e.target.value;
    if (value) {
      onChange(new Date(value));
    } else {
      onChange(null);
    }
  };

  return (
    <input
      type="date"
      value={selected ? formatDate(selected) : ''}
      onChange={handleDateChange}
      min={minDate ? formatDate(minDate) : ''}
      className={className}
      placeholder={placeholderText}
    />
  );
};

const ContestDetailsStep = ({
  formData = {
    contestName: '',
    contestDescription: '',
    startDate: null,
    endDate: null,
    startTime: { startTimeHour: '', startTimeMinute: '', startTimeAmPm: 'AM' },
    endTime: { endTimeHour: '', endTimeMinute: '', endTimeAmPm: 'AM' },
    payment: { isPaid: false, amount: '' },
    allowMultipleVotes: false
  },
  onInputChange = () => {},
  positions = [],
  onAddPosition = () => {},
  onUpdatePosition = () => {},
  onRemovePosition = () => {},
  setCreateContest = () => {},
}) => {
  const [editIndex, setEditIndex] = useState(null);

  const handleEditClick = (index) => {
    setEditIndex(index);
  };

  const handleSaveClick = () => {
    setEditIndex(null);
  };

  return (
    <div className="space-y-6 sm:space-y-8">
      {/* Basic Content Information */}
      <div className="bg-[#FBF7F7] p-4 sm:p-6 lg:p-10 rounded-lg">
        <div>
          <h2 className="text-lg sm:text-xl text-left font-semibold text-gray-900 mb-4 sm:mb-6">
            Basic Content Information
          </h2>
          <div className="space-y-4 sm:space-y-6">
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
                className="w-full px-3 sm:px-4 py-2 sm:py-3 bg-gray-50 border border-gray-200 rounded-md focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none transition-colors text-sm sm:text-base"
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
                className="w-full px-3 sm:px-4 py-2 sm:py-3 bg-gray-50 border border-gray-200 rounded-md focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none transition-colors resize-none text-sm sm:text-base"
              />
            </div>

            {/* Date Fields */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6 text-left">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Start Date
                </label>
                <DatePicker
                  selected={formData.startDate ? new Date(formData.startDate) : null}
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
                  className="w-full px-3 sm:px-4 py-2 sm:py-3 bg-gray-50 border border-gray-200 rounded-md focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none transition-colors text-sm sm:text-base"
                  placeholderText="Select start date"
                />
              </div>
              <div>
                <label className="block text-sm text-left font-medium text-gray-700 mb-2">
                  End Date
                </label>
                <DatePicker
                  selected={formData.endDate ? new Date(formData.endDate) : null}
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
                  className="w-full px-3 sm:px-4 py-2 sm:py-3 bg-gray-50 border border-gray-200 rounded-md focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none transition-colors text-sm sm:text-base"
                  placeholderText="Select end date"
                />
              </div>
            </div>

            {/* Time Fields */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6 text-left">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Start Time
                </label>
                <div className="flex space-x-1 sm:space-x-2">
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
                    className="flex-1 min-w-0 px-2 py-2 sm:py-3 bg-gray-50 border border-gray-200 rounded-md focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none transition-colors text-sm"
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
                  <span className="flex items-center text-sm sm:text-base">:</span>
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
                    className="flex-1 min-w-0 px-2 py-2 sm:py-3 bg-gray-50 border border-gray-200 rounded-md focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none transition-colors text-sm"
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
                    className="flex-1 min-w-0 px-2 py-2 sm:py-3 bg-gray-50 border border-gray-200 rounded-md focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none transition-colors text-sm"
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
                <div className="flex space-x-1 sm:space-x-2">
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
                    className="flex-1 min-w-0 px-2 py-2 sm:py-3 bg-gray-50 border border-gray-200 rounded-md focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none transition-colors text-sm"
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
                  <span className="flex items-center text-sm sm:text-base">:</span>
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
                    className="flex-1 min-w-0 px-2 py-2 sm:py-3 bg-gray-50 border border-gray-200 rounded-md focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none transition-colors text-sm"
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
                    className="flex-1 min-w-0 px-2 py-2 sm:py-3 bg-gray-50 border border-gray-200 rounded-md focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none transition-colors text-sm"
                  >
                    <option value="AM">AM</option>
                    <option value="PM">PM</option>
                  </select>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Position Setup */}
      <div className="bg-[#FBF7F7] p-4 sm:p-6 lg:p-10 rounded-lg">
        <div className="flex flex-col sm:flex-row sm:items-center text-left justify-between mb-4 sm:mb-6 space-y-3 sm:space-y-0">
          <h2 className="text-lg sm:text-xl font-semibold text-gray-900">
            Position Setup
          </h2>
          <button
            onClick={onAddPosition}
            className="bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded-md font-medium transition-colors text-sm w-full sm:w-auto"
          >
            Create Position
          </button>
        </div>

        {/* Position Cards */}
        {positions.length === 0 ? (
          <div className="bg-gray-50 rounded-lg px-4 sm:px-6 py-8 sm:py-12 text-center text-gray-500 text-sm sm:text-base">
            No positions added yet. Click "Create Position" to get started.
          </div>
        ) : (
          <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
            {/* Desktop Table Header - Hidden on mobile */}
            <div className="hidden md:grid grid-cols-3 gap-4 px-6 py-4 bg-gray-50 font-medium text-gray-700 text-sm border-b border-gray-200">
              <div>Name</div>
              <div>Description</div>
              <div>Actions</div>
            </div>
            
            {/* Position Items */}
            <div className="divide-y divide-gray-200">
              {positions.map((position, index) => (
                <div key={index} className="p-4 sm:p-6">
                  {editIndex === index ? (
                    /* Edit Mode */
                    <div className="space-y-4 md:grid md:grid-cols-3 md:gap-4 md:space-y-0 md:items-start">
                      <div className="space-y-2 md:space-y-0">
                        <label className="block text-sm font-medium text-gray-700 md:hidden">
                          Position Name
                        </label>
                        <input
                          type="text"
                          value={position.name}
                          onChange={(e) =>
                            onUpdatePosition(index, "name", e.target.value)
                          }
                          placeholder="Enter position name"
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none text-sm"
                        />
                      </div>
                      <div className="space-y-2 md:space-y-0">
                        <label className="block text-sm font-medium text-gray-700 md:hidden">
                          Description
                        </label>
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
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none text-sm"
                        />
                      </div>
                      <div className="flex space-x-2 justify-center md:justify-start">
                        <button
                          onClick={handleSaveClick}
                          className="text-green-600 hover:text-green-800 p-2"
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
                          className="text-red-600 hover:text-red-800 p-2"
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
                    </div>
                  ) : (
                    /* View Mode */
                    <div className="space-y-3 md:grid md:grid-cols-3 md:gap-4 md:space-y-0 md:items-center">
                      <div className="space-y-1 md:space-y-0">
                        <div className="text-xs font-medium text-gray-500 uppercase tracking-wide md:hidden">
                          Position Name
                        </div>
                        <div className="text-gray-900 text-sm sm:text-base font-medium md:font-normal">
                          {position.name}
                        </div>
                      </div>
                      <div className="space-y-1 md:space-y-0">
                        <div className="text-xs font-medium text-gray-500 uppercase tracking-wide md:hidden">
                          Description
                        </div>
                        <div className="text-gray-600 text-sm sm:text-base">
                          {position.description}
                        </div>
                      </div>
                      <div className="flex space-x-4 pt-2 md:pt-0 justify-center md:justify-start">
                        <button
                          onClick={() => handleEditClick(index)}
                          className="text-gray-400 hover:text-gray-600 p-2"
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
                          className="text-red-600 hover:text-red-800 p-2"
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
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Payment Setup */}
      <div className="bg-[#FBF7F7] p-4 sm:p-6 lg:p-10 rounded-lg">
        <h2 className="text-lg sm:text-xl font-semibold text-gray-900 text-left mb-4">
          Payment Setup
        </h2>
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center space-y-3 sm:space-y-0 sm:space-x-6">
            <span className="text-sm font-medium text-gray-700">
              Is this a paid contest?
            </span>
            <div className="flex space-x-3">
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
                className={`px-4 py-2 rounded-md font-medium text-sm transition-colors min-w-[60px] ${
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
                className={`px-4 py-2 rounded-md font-medium text-sm transition-colors min-w-[60px] ${
                  formData.payment?.isPaid === false
                    ? "bg-orange-500 text-white"
                    : "bg-gray-200 text-gray-700"
                }`}
              >
                No
              </button>
            </div>
          </div>
          {formData?.payment?.isPaid && (
            <div>
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
                className="w-full px-3 sm:px-4 py-2 sm:py-3 bg-gray-50 border border-gray-200 rounded-md focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none transition-colors text-sm sm:text-base"
              />
            </div>
          )}
        </div>
      </div>

      {/* Voters Setting */}
      <div className="bg-[#FBF7F7] p-4 sm:p-6 lg:p-10 rounded-lg">
        <h2 className="text-lg sm:text-xl font-semibold text-gray-900 text-left mb-4">
          Voters Setting
        </h2>
        <div className="flex flex-col sm:flex-row sm:items-center space-y-3 sm:space-y-0 sm:space-x-6">
          <span className="text-sm font-medium text-gray-700">
            Allow multiple votes
          </span>
          <div className="flex space-x-3">
            <button
              type="button"
              onClick={() => {
                onInputChange("allowMultipleVotes", true);
                setCreateContest((prev) => ({
                  ...prev,
                  allowMultipleVotes: true,
                }));
              }}
              className={`px-4 py-2 rounded-md font-medium text-sm transition-colors min-w-[60px] ${
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
              className={`px-4 py-2 rounded-md font-medium text-sm transition-colors min-w-[60px] ${
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