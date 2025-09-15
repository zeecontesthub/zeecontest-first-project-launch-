/* eslint-disable no-unused-vars */
import React, { useState, useRef, useEffect } from "react";
import Sidebar from "../Components/sidebar";
import { Edit2, Trash2, ChevronLeft, Check, X } from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";
import BannerImage from "../assets/Rectangle _5189.png";
import LogoImage from "../assets/Ellipse 20.png";
import PositionPopup from "../Components/PositionPopup";
import ContestantPopup from "../Components/contestantpopup";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import axios from "axios";
import { uploadToCloudinary } from "../actions/cloudinaryAction";
import { toast } from "react-toastify";
import { useUser } from "../context/UserContext";
import { set } from "date-fns";

const Editcontest = () => {
  const { user } = useUser();

  const { contestId } = useParams();
  const [contest, setContest] = useState(null);
  const [isUploading, setIsUploading] = useState(false);

  useEffect(() => {
    const fetchContest = async () => {
      try {
        const res = await axios.get(`/api/contest/${contestId}`);
        console.log(res);
        setContest(res.data.contest);
      } catch (err) {
        console.error("Failed to fetch contest:", err);
      }
    };
    if (contestId) fetchContest();
  }, [contestId]);

  //   console.log(contest);

  const [isPositionPopupOpen, setIsPositionPopupOpen] = useState(false);
  const [isContestantPopupOpen, setIsContestantPopupOpen] = useState(false);

  // State for images
  const [coverImage, setCoverImage] = useState(BannerImage);
  const [logoImage, setLogoImage] = useState(LogoImage);
  // Flatten all contestants from all positions
  const allContestants =
    contest?.positions?.flatMap((pos) =>
      pos.contestants?.map((contestant) => ({
        ...contestant,
        position: pos?.name,
      }))
    ) || [];

  // const totalContestants = allContestants.length;

  useEffect(() => {
    if (contest) {
      setCoverImage(contest.coverImageUrl || BannerImage);
      setLogoImage(contest.contestLogoImageUrl || LogoImage);
      setFormData({
        ...formData,
        contestName: contest.title,
        contestDescription: contest.description,
        startDate: contest.startDate,
        endDate: contest.endDate,
        startTime: contest.startTime || {
          startTimeHour: "",
          startTimeMinute: "00",
          startTimeAmPm: "AM",
        },
        endTime: contest.endTime || {
          endTimeHour: "",
          endTimeMinute: "00",
          endTimeAmPm: "AM",
        },
        payment: contest.payment || {
          isPaid: false,
          amount: 0,
        },
        allowMultipleVotes: contest.allowMultipleVotes || false,
      });
      setPositions(contest?.positions || []);
      setContestants(allContestants || []);
    }
  }, [contest]);

  // State for contest details
  const [formData, setFormData] = useState({
    contestName: contest?.title || "",
    contestDescription: contest?.description || "",
    startDate: contest?.startDate || "",
    endDate: contest?.endDate || "",
    startTime: contest?.startTime || {
      startTimeHour: "",
      startTimeMinute: "00",
      startTimeAmPm: "AM",
    },
    endTime: contest?.endTime || {
      endTimeHour: "",
      endTimeMinute: "00",
      endTimeAmPm: "AM",
    },
    payment: contest?.payment || {
      isPaid: false,
      amount: 0,
    },
    allowMultipleVotes: contest?.allowMultipleVotes || false,
  });

  const fileInputRef = useRef(null);
  const logoInputRef = useRef(null);

  const [positions, setPositions] = useState(
    contest?.positions && contest?.positions.length > 0
      ? contest?.positions
      : []
  );

  // Enhanced editing state management
  const [editingPositionId, setEditingPositionId] = useState(null);
  const [tempPositionName, setTempPositionName] = useState("");
  const [tempPositionDescription, setTempPositionDescription] = useState("");
  const [originalPositionData, setOriginalPositionData] = useState(null);

  const [contestants, setContestants] = useState(contest?.contestants || []);
  // Enhanced editing state management for contestants

  const addPosition = () => {
    const newPosition = {
      id: positions.length + 1,
      name: "New Position",
      description: "Description of position",
    };
    setPositions([...positions, newPosition]);
  };

  const deletePosition = (id) => {
    setPositions(positions.filter((pos) => pos._id !== id));
  };

  // Start editing a position
  const startEditing = (position) => {
    setEditingPositionId(position._id);
    setTempPositionName(position?.name);
    setTempPositionDescription(position.description);
    // Store original data for cancel functionality
    setOriginalPositionData({
      name: position?.name,
      description: position?.description,
    });
  };

  // Cancel editing and restore original values
  const cancelEditing = () => {
    if (originalPositionData && editingPositionId) {
      // Restore original values
      setPositions(
        positions.map((pos) =>
          pos.id === editingPositionId
            ? {
                ...pos,
                name: originalPositionData?.name,
                description: originalPositionData?.description,
              }
            : pos
        )
      );
    }

    // Reset editing state
    setEditingPositionId(null);
    setTempPositionName("");
    setTempPositionDescription("");
    setOriginalPositionData(null);
  };

  // Save the edited position
  const saveEditing = () => {
    setPositions(
      positions.map((pos) =>
        pos._id === editingPositionId
          ? {
              ...pos,
              name: tempPositionName,
              description: tempPositionDescription,
            }
          : pos
      )
    );

    // Reset editing state
    setEditingPositionId(null);
    setTempPositionName("");
    setTempPositionDescription("");
    setOriginalPositionData(null);
  };

  // Update temporary values while editing
  const updateTempPosition = (field, value) => {
    if (field === "name") {
      setTempPositionName(value);
    } else if (field === "description") {
      setTempPositionDescription(value);
    }
  };

  const navigate = useNavigate();

  // Start editing a contestant
  const startEditingContestant = (contestant) => {};
  const cancelEditingContestant = () => {};
  const saveEditingContestant = () => {};
  const updateTempContestant = (field, value) => {};

  const handleBrowseClick = () => {
    fileInputRef.current.click();
  };
  const [coverIsUploading, setCoverIsUploading] = useState(false);
  const handleFileChange = async (event) => {
    const file = event.target.files[0];

    if (file) {
      setCoverIsUploading(true);
      setIsUploading(true);
      const imageFileUrl = URL.createObjectURL(file);
      setCoverImage(imageFileUrl);
      const imgURL = await uploadToCloudinary(file);
      setIsUploading(false);
      setCoverIsUploading(false);
      setFormData((prev) => ({
        ...prev,
        coverImageUrl: imgURL,
      }));
      setCoverImage(imgURL);
    }
  };

  const handleLogoClick = () => {
    logoInputRef.current.click();
  };

  const [logoIsUploading, setLogoIsUploading] = useState(false);

  const handleLogoChange = async (e) => {
    const file = e.target.files[0];
    if (file) {
      setLogoIsUploading(true);
      setIsUploading(true);
      const imageFileUrl = URL.createObjectURL(file);
      setLogoImage(imageFileUrl);
      const imgURL = await uploadToCloudinary(file);
      setIsUploading(false);
      setLogoIsUploading(false);
      setFormData((prev) => ({
        ...prev,
        contestLogoImageUrl: imgURL,
      }));
      setLogoImage(imgURL);
    }
  };

  // Handlers for Contest Details Step
  const onInputChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const onPublishEdit = async () => {
    try {
      let status = "upcoming"; // default

      if (formData.startDate) {
        const now = new Date();

        // Build start datetime
        const startDateTime = new Date(formData.startDate);

        if (formData.startTime) {
          let hour = parseInt(formData.startTime.startTimeHour, 10);
          if (formData.startTime.startTimeAmPm === "PM" && hour < 12)
            hour += 12;
          startDateTime.setHours(
            hour,
            parseInt(formData.startTime.startTimeMinute, 10),
            0,
            0
          );
        }

        if (now >= startDateTime) {
          // If start datetime is past, set status to "ongoing" or keep existing
          status = contest?.status === "completed" ? "completed" : "ongoing";
        }
      }

      const payload = {
        title: formData.contestName,
        description: formData.contestDescription,
        startDate: formData.startDate,
        endDate: formData.endDate,
        startTime: formData.startTime,
        endTime: formData.endTime,
        positions: positions,
        participants: contestants,
        coverImageUrl: coverImage,
        contestLogoImageUrl: logoImage,
        payment: formData.payment,
        allowMultipleVotes: formData.allowMultipleVotes,
        status, // computed status
        type: "spot-light",
        uid: user?.firebaseUid,
        _id: contest?._id || null,
      };

      const res = await axios.post("/api/contest/create-contest", payload);

      if (res.data && res.data.contest) {
        toast.success("Contest Edited successfully");
      }
    } catch (err) {
      console.error("Failed to create contest:", err);
      toast.error("Failed to create contest. Please try again.");
    }
  };

  return (
    <div className="flex min-h-screen overflow-x-hidden">
      <Sidebar />

      <div className="flex-1 p-4 sm:p-6 md:ml-20 overflow-x-hidden ">
        {/* Header */}
        <div className="flex items-center mb-6 sm:mb-8 gap-4">
          <button
            onClick={() => navigate(-1)}
            className="p-2 rounded-full hover:bg-gray-200 transition-colors"
            aria-label="Back to Contest Details"
          >
            <ChevronLeft size={24} />
          </button>
          <h2 className="text-xl sm:text-2xl lg:text-[30px] text-left font-bold text-gray-900">
            Edit Contest
          </h2>
        </div>

        <div className="min-h-screen p-2 sm:p-4 lg:p-6">
          <div className="mx-auto space-y-6 sm:space-y-8">
            {/* Header */}
            <div className="bg-white rounded-lg shadow-sm">
              <div className="p-4 border-b border-gray-200">
                <h2 className="text-lg text-left font-semibold text-gray-900">
                  Edit Contest Banner
                </h2>
              </div>

              {/* Banner Upload Area */}
              <div className="p-4 sm:p-6">
                <div
                  className="relative h-32 sm:h-40 lg:h-48 rounded-lg overflow-hidden"
                  style={{
                    backgroundImage: `url(${coverImage || BannerImage})`,
                    backgroundSize: "cover",
                    backgroundPosition: "center",
                    opacity: coverIsUploading ? 0.7 : 1,
                  }}
                >
                  {coverIsUploading ? (
                    <div className="flex flex-col items-center space-y-2 animate-pulse h-full justify-center">
                      <svg
                        className="w-6 h-6 sm:w-8 sm:h-8 animate-spin text-teal-300"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                        ></circle>
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8v8H4z"
                        ></path>
                      </svg>
                      <p className="text-xs sm:text-sm text-teal-300">
                        Uploading...
                      </p>
                    </div>
                  ) : (
                    <div className="absolute inset-0 bg-[#000000]/50 flex flex-col items-center justify-center text-white">
                      <p className="text-xs sm:text-sm mb-3 text-center px-4">
                        Drag and Drop your Cover Image here
                      </p>
                      <p className="text-xs mb-4">Or</p>
                      <button
                        onClick={handleBrowseClick}
                        className="bg-orange-500 hover:bg-orange-600 px-4 sm:px-6 py-2 rounded text-xs sm:text-sm font-medium transition-colors"
                      >
                        Browse
                      </button>
                      <input
                        type="file"
                        accept="image/*"
                        ref={fileInputRef}
                        onChange={handleFileChange}
                        className="hidden"
                      />
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Logo Section */}
            <div className="p-4 sm:p-6">
              <div
                className={`${
                  logoIsUploading ? "opacity-70" : ""
                } relative w-20 h-20 sm:w-24 sm:h-24`}
              >
                <div className="w-full h-full bg-white border-2 border-gray-200 rounded-full flex items-center justify-center">
                  <img
                    src={logoImage}
                    alt="Contest Logo"
                    className="w-16 h-16 sm:w-20 sm:h-20 object-cover rounded-full"
                  />
                  {logoIsUploading && (
                    <div className="flex flex-col items-center space-y-2 animate-pulse h-full justify-center absolute">
                      <svg
                        className="w-6 h-6 sm:w-8 sm:h-8 animate-spin text-teal-300"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <circle
                          className="opacity-45"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                        ></circle>
                        <path
                          className="opacity-85"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8v8H4z"
                        ></path>
                      </svg>
                    </div>
                  )}
                </div>
                <button
                  onClick={handleLogoClick}
                  className="absolute -bottom-1 -right-1 w-6 h-6 sm:w-8 sm:h-8 rounded-full border border-gray-200 flex items-center justify-center text-black bg-white hover:bg-gray-200 text-sm sm:text-base"
                >
                  +
                </button>
                <input
                  type="file"
                  accept="image/*"
                  ref={logoInputRef}
                  onChange={handleLogoChange}
                  className="hidden"
                  disabled={logoIsUploading}
                />
              </div>
            </div>

            {/* Basic Contest Information */}
            <div className="p-4 sm:p-6 space-y-4 sm:space-y-6">
              {/* Contest Name */}
              <div>
                <label className="block text-sm text-left font-medium text-gray-700 mb-2">
                  Contest Name
                </label>
                <input
                  type="text"
                  value={formData?.contestName}
                  onChange={(e) => onInputChange("contestName", e.target.value)}
                  placeholder="Enter the Name of your Contest"
                  className="w-full px-3 py-2 text-sm sm:text-base border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                />
              </div>

              {/* Contest Description */}
              <div>
                <label className="block text-sm text-left font-medium text-gray-700 mb-2">
                  Contest Description
                </label>
                <textarea
                  value={formData?.contestDescription}
                  onChange={(e) =>
                    onInputChange("contestDescription", e.target.value)
                  }
                  placeholder="Describe your contest"
                  rows={4}
                  className="w-full px-3 py-2 text-sm sm:text-base border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent resize-none"
                />
              </div>

              {/* Date and Time Fields - RESPONSIVE GRID */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6 text-left">
                <div className="col-span-1 sm:col-span-2 md:col-span-1">
                  <label className="block text-sm font-medium text-left text-gray-700 mb-2">
                    Start Date
                  </label>
                  <DatePicker
                    selected={formData.startDate ? formData.startDate : null}
                    onChange={(date) => {
                      onInputChange(
                        "startDate",
                        date ? date.toISOString().split("T")[0] : ""
                      );
                      setFormData((prev) => ({
                        ...prev,
                        startDate: date ? date.toISOString().split("T")[0] : "",
                      }));
                    }}
                    minDate={new Date()}
                    dateFormat="yyyy-MM-dd"
                    className="w-full px-3 sm:px-4 py-2 sm:py-3 text-sm sm:text-base border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                    placeholderText="Select start date"
                  />
                </div>

                <div className="col-span-1 sm:col-span-2 md:col-span-1">
                  <label className="block text-sm font-medium text-left text-gray-700 mb-2">
                    End Date
                  </label>
                  <DatePicker
                    selected={formData.endDate ? formData.endDate : null}
                    onChange={(date) => {
                      onInputChange(
                        "endDate",
                        date ? date.toISOString().split("T")[0] : ""
                      );
                      setFormData((prev) => ({
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
                    className="w-full px-3 py-2 text-sm sm:text-base border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                    placeholderText="Select end date"
                  />
                </div>

                <div className="col-span-1 sm:col-span-2 md:col-span-1">
                  <label className="block text-sm font-medium text-left text-gray-700 mb-2">
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
                        setFormData((prev) => ({
                          ...prev,
                          startTime: {
                            ...prev.startTime,
                            startTimeHour: e.target.value,
                          },
                        }));
                      }}
                      className="flex-1 min-w-0 px-1 sm:px-2 py-2 sm:py-3 text-sm bg-gray-50 border border-gray-200 rounded-md focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none transition-colors"
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
                    <span className="flex items-center text-sm sm:text-base">
                      :
                    </span>
                    <select
                      value={formData?.startTime?.startTimeMinute || ""}
                      onChange={(e) => {
                        onInputChange("startTime", {
                          ...formData.startTime,
                          startTimeMinute: e.target.value,
                        });
                        setFormData((prev) => ({
                          ...prev,
                          startTime: {
                            ...prev.startTime,
                            startTimeMinute: e.target.value,
                          },
                        }));
                      }}
                      className="flex-1 min-w-0 px-1 sm:px-2 py-2 sm:py-3 text-sm bg-gray-50 border border-gray-200 rounded-md focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none transition-colors"
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
                        setFormData((prev) => ({
                          ...prev,
                          startTime: {
                            ...prev.startTime,
                            startTimeAmPm: e.target.value,
                          },
                        }));
                      }}
                      className="flex-1 min-w-0 px-1 sm:px-2 py-2 sm:py-3 text-sm bg-gray-50 border border-gray-200 rounded-md focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none transition-colors"
                    >
                      <option value="AM">AM</option>
                      <option value="PM">PM</option>
                    </select>
                  </div>
                </div>

                <div className="col-span-1 sm:col-span-2 md:col-span-1">
                  <label className="block text-sm font-medium text-left text-gray-700 mb-2">
                    End Time
                  </label>
                  <div className="flex space-x-1 sm:space-x-2">
                    {/* Similar structure as Start Time with responsive classes */}
                    <select
                      value={formData?.endTime?.endTimeHour || ""}
                      onChange={(e) => {
                        onInputChange("endTime", {
                          ...formData.endTime,
                          endTimeHour: e.target.value,
                        });
                        setFormData((prev) => ({
                          ...prev,
                          endTime: {
                            ...prev.endTime,
                            endTimeHour: e.target.value,
                          },
                        }));
                      }}
                      className="flex-1 min-w-0 px-1 sm:px-2 py-2 sm:py-3 text-sm bg-gray-50 border border-gray-200 rounded-md focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none transition-colors"
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
                    <span className="flex items-center text-sm sm:text-base">
                      :
                    </span>
                    <select
                      value={formData?.endTime?.endTimeMinute || ""}
                      onChange={(e) => {
                        onInputChange("endTime", {
                          ...formData.endTime,
                          endTimeMinute: e.target.value,
                        });
                        setFormData((prev) => ({
                          ...prev,
                          endTime: {
                            ...prev.endTime,
                            endTimeMinute: e.target.value,
                          },
                        }));
                      }}
                      className="flex-1 min-w-0 px-1 sm:px-2 py-2 sm:py-3 text-sm bg-gray-50 border border-gray-200 rounded-md focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none transition-colors"
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
                        setFormData((prev) => ({
                          ...prev,
                          endTime: {
                            ...prev.endTime,
                            endTimeAmPm: e.target.value,
                          },
                        }));
                      }}
                      className="flex-1 min-w-0 px-1 sm:px-2 py-2 sm:py-3 text-sm bg-gray-50 border border-gray-200 rounded-md focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none transition-colors"
                    >
                      <option value="AM">AM</option>
                      <option value="PM">PM</option>
                    </select>
                  </div>
                </div>
              </div>
            </div>

            {/* Position Setup */}
            <div className="bg-white rounded-lg shadow-sm overflow-hidden">
              <div className="p-3 sm:p-4 border-b border-gray-200 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                <h2 className="text-base sm:text-lg font-semibold text-gray-900">
                  Position Setup
                </h2>
                <button
                  onClick={() => setIsPositionPopupOpen(true)}
                  className="bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors w-full sm:w-auto"
                >
                  Add Position
                </button>
              </div>

              <div className="overflow-x-auto -mx-4 sm:mx-0">
                <div className="inline-block min-w-full align-middle">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-3 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap">
                          Position Name
                        </th>
                        <th className="px-3 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap">
                          Description
                        </th>
                        <th className="px-3 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap">
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {positions.map((position) => (
                        <tr key={position._id}>
                          <td className="px-3 sm:px-6 py-4 whitespace-nowrap">
                            <input
                              type="text"
                              value={
                                editingPositionId === position._id
                                  ? tempPositionName
                                  : position?.name
                              }
                              onChange={(e) =>
                                editingPositionId === position._id
                                  ? updateTempPosition("name", e.target.value)
                                  : null
                              }
                              className={`w-full min-w-[120px] px-2 py-1 text-sm transition-all duration-200 ${
                                editingPositionId === position._id
                                  ? "border-2 border-orange-500 rounded focus:outline-none focus:ring-2 focus:ring-orange-200 bg-white"
                                  : "border-transparent bg-transparent cursor-default"
                              }`}
                              readOnly={editingPositionId !== position._id}
                            />
                          </td>
                          <td className="px-3 sm:px-6 py-4">
                            <input
                              type="text"
                              value={
                                editingPositionId === position._id
                                  ? tempPositionDescription
                                  : position.description
                              }
                              onChange={(e) =>
                                editingPositionId === position._id
                                  ? updateTempPosition(
                                      "description",
                                      e.target.value
                                    )
                                  : null
                              }
                              className={`w-full min-w-[150px] px-2 py-1 text-sm transition-all duration-200 ${
                                editingPositionId === position._id
                                  ? "border-2 border-orange-500 rounded focus:outline-none focus:ring-2 focus:ring-orange-200 bg-white"
                                  : "border-transparent bg-transparent cursor-default"
                              }`}
                              readOnly={editingPositionId !== position._id}
                            />
                          </td>
                          <td className="px-3 sm:px-6 py-4 whitespace-nowrap">
                            <div className="flex space-x-1 sm:space-x-2">
                              {editingPositionId === position._id ? (
                                <>
                                  <button
                                    onClick={saveEditing}
                                    className="text-green-600 hover:text-green-800 p-1 rounded hover:bg-green-100 transition-colors"
                                    title="Save changes"
                                  >
                                    <Check className="w-3 h-3 sm:w-4 sm:h-4" />
                                  </button>
                                  <button
                                    onClick={cancelEditing}
                                    className="text-gray-600 hover:text-gray-800 p-1 rounded hover:bg-gray-100 transition-colors"
                                    title="Cancel editing"
                                  >
                                    <X className="w-3 h-3 sm:w-4 sm:h-4" />
                                  </button>
                                </>
                              ) : (
                                <>
                                  <button
                                    className="text-gray-600 hover:text-gray-800 p-1 rounded hover:bg-gray-100 transition-colors"
                                    onClick={() => startEditing(position)}
                                    title="Edit position"
                                  >
                                    <Edit2 className="w-3 h-3 sm:w-4 sm:h-4" />
                                  </button>
                                  <button
                                    onClick={() => deletePosition(position._id)}
                                    className="text-red-600 hover:text-red-800 p-1 rounded hover:bg-red-100 transition-colors"
                                    title="Delete position"
                                  >
                                    <Trash2 className="w-3 h-3 sm:w-4 sm:h-4" />
                                  </button>
                                </>
                              )}
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>

            {/* Contestant List */}
            <div className="bg-white rounded-lg shadow-sm overflow-hidden">
              <div className="p-4 border-b border-gray-200 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                <h2 className="text-lg font-semibold text-gray-900">
                  Contestant List
                </h2>
                <button
                  className="bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors w-full sm:w-auto"
                  onClick={() => setIsContestantPopupOpen(true)}
                >
                  Add Contestant
                </button>
              </div>

              <div className="overflow-x-auto -mx-4 sm:mx-0">
                <div className="inline-block min-w-full align-middle">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-3 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap">
                          Image
                        </th>
                        <th className="px-3 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap">
                          Name
                        </th>
                        <th className="px-3 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap">
                          Position
                        </th>
                        <th className="hidden sm:table-cell px-3 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Bio
                        </th>
                        <th className="px-3 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap">
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {contestants.map((contestant) => (
                        <tr key={contestant.id}>
                          <td className="px-3 sm:px-6 py-4 whitespace-nowrap">
                            <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gray-300 rounded-full flex items-center justify-center overflow-hidden flex-shrink-0">
                              {contestant?.image ? (
                                <img
                                  src={
                                    typeof contestant?.image === "string"
                                      ? contestant?.image
                                      : URL.createObjectURL(contestant?.image)
                                  }
                                  alt={contestant?.name}
                                  className="w-8 h-8 sm:w-10 sm:h-10 rounded-full object-cover"
                                />
                              ) : (
                                <span className="text-gray-600 text-xs font-medium">
                                  {contestant?.name?.charAt(0) || "?"}
                                </span>
                              )}
                            </div>
                          </td>
                          <td className="px-3 sm:px-6 py-4 text-sm text-left font-medium text-gray-900 whitespace-nowrap">
                            <div className="max-w-[100px] sm:max-w-[150px] truncate">
                              {contestant?.name}
                            </div>
                          </td>
                          <td className="px-3 sm:px-6 py-4 text-sm text-left text-gray-500 whitespace-nowrap">
                            <div className="max-w-[80px] sm:max-w-[120px] truncate">
                              {contestant?.position}
                            </div>
                          </td>
                          <td className="hidden sm:table-cell px-3 sm:px-6 py-4 text-sm text-left text-gray-600 hover:text-blue-800 cursor-pointer">
                            <div className="max-w-[150px] truncate">
                              {contestant.bio}
                            </div>
                          </td>
                          <td className="px-3 sm:px-6 py-4 whitespace-nowrap">
                            <div className="flex text-left space-x-1 sm:space-x-2">
                              <button
                                className="text-red-600 hover:text-red-800 p-1 rounded hover:bg-red-100 transition-colors flex-shrink-0"
                                onClick={() => {
                                  // Your delete logic here
                                }}
                                title="Delete contestant"
                              >
                                <Trash2 className="w-3 h-3 sm:w-4 sm:h-4" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>

            {/* Save Button */}
            <div className="flex flex-col sm:flex-row justify-end space-y-3 sm:space-y-0 sm:space-x-4">
              <button
                onClick={() => navigate(-1)}
                className="bg-gray-300 hover:bg-gray-400 text-black px-6 sm:px-8 py-3 rounded-md font-medium transition-colors order-2 sm:order-1"
              >
                Cancel
              </button>
              <button
                onClick={onPublishEdit}
                disabled={isUploading}
                className={`${
                  isUploading ? "opacity-30" : ""
                } bg-orange-500 hover:bg-orange-600 text-white px-6 sm:px-8 py-3 rounded-md font-medium transition-colors order-1 sm:order-2`}
              >
                {isUploading ? "Saving..." : "Save"}
              </button>
            </div>
          </div>
        </div>
      </div>

      <ContestantPopup
        isOpen={isContestantPopupOpen}
        onClose={() => setIsContestantPopupOpen(false)}
        onAddContestant={(newContestant) => {
          if (newContestant?.name.trim() === "") return;

          setContestants([...contestants, { ...newContestant }]);

          setPositions((prev) =>
            prev.map((pos) =>
              pos?.name === newContestant?.position
                ? {
                    ...pos,
                    contestants: [
                      ...(Array.isArray(pos.contestants)
                        ? pos.contestants
                        : []),
                      { ...newContestant, dateId: Date.now() },
                    ],
                  }
                : pos
            )
          );

          setFormData((prev) => ({
            ...prev,
            contestants: [...contestants, { ...newContestant, id: Date.now() }],
          }));

          setIsContestantPopupOpen(false);
        }}
        positions={positions}
      />
    </div>
  );
};

export default Editcontest;
