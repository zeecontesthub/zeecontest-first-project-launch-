import React, { useState } from "react";
import Sidebar from "../Components/sidebar";
import ContestDetailsStep from "../Components/ContestDetailsStep";
import ImageUploadStep from "../Components/ImageUploadStep";
import ContestantDetailsStep from "../Components/ContestantDetailsStep";
import ReviewStep from "../Components/ReviewStep";
import PositionPopup from "../Components/PositionPopup";
import Security from "../Components/Security";
import axios from "axios";
import { uploadToCloudinary } from "../actions/cloudinaryAction";
import { useUser } from "../context/UserContext";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

const CreateSpotlightContest = () => {
  const navigate = useNavigate();
  const { user, setUserContests, createContest, setCreateContest } = useUser();
  const [currentStep, setCurrentStep] = useState(0);
  const [isPositionPopupOpen, setIsPositionPopupOpen] = useState(false);
  const [isUploading, setIsUploading] = useState(false);

  // State for contest positions
  const [positions, setPositions] = useState(
    createContest?.positions && createContest.positions.length > 0
      ? createContest.positions
      : []
  );

  // State for contestants
  const [contestants, setContestants] = useState(
    createContest?.contestants || []
  );

  // State for images
  const [coverImage, setCoverImage] = useState(
    createContest?.coverImageUrl || null
  );
  const [logoImage, setLogoImage] = useState(
    createContest?.contestLogoImageUrl || null
  );

  // State for contestant form
  const [contestantForm, setContestantForm] = useState({
    name: "",
    bio: "",
    position: "",
    image: null,
    email: "",
  });

  // State for contest details
  const [formData, setFormData] = useState({
    contestName: createContest?.title || "",
    contestDescription: createContest?.description || "",
    startDate: createContest?.startDate || "",
    endDate: createContest?.endDate || "",
    startTime: createContest?.startTime || {
      startTimeHour: "",
      startTimeMinute: "00",
      startTimeAmPm: "AM",
    },
    endTime: createContest?.endTime || {
      endTimeHour: "",
      endTimeMinute: "00",
      endTimeAmPm: "AM",
    },
    payment: createContest?.payment || {
      isPaid: false,
      amount: 0,
    },
    allowMultipleVotes: createContest?.allowMultipleVotes || false,
  });

  // State for security settings
  const [isVoterRegistrationEnabled, setIsVoterRegistrationEnabled] = useState(
    createContest?.isVoterRegistrationEnabled || false
  );

  // Form validation
  const isFormValid = () => {
    return (
      formData.contestName &&
      formData.contestDescription &&
      formData.startDate &&
      formData.endDate &&
      contestants.length > 0
    );
  };

  // Handlers for Contest Details Step
  const onInputChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  // Position management
  const onAddPosition = () => {
    setIsPositionPopupOpen(true);
  };

  const handleAddPositionFromPopup = (position) => {
    setPositions((prev) => [...prev, position]);
    setCreateContest((prev) => ({
      ...prev,
      positions: [...positions, position],
    }));
    setIsPositionPopupOpen(false);
  };

  const handleClosePositionPopup = () => {
    setIsPositionPopupOpen(false);
  };

  const onUpdatePosition = (index, field, value) => {
    setPositions((prev) =>
      prev.map((pos, i) => (i === index ? { ...pos, [field]: value } : pos))
    );
  };

  const onRemovePosition = (index) => {
    setPositions((prev) => prev.filter((_, i) => i !== index));
  };

  // Image upload handlers with loading state
  const onFileUpload = async (file, type) => {
    if (!file) return;
    try {
      setIsUploading(true);

      const imgURL = await uploadToCloudinary(file);
      console.log("Uploaded Image URL:", imgURL);
      if (!imgURL) {
        console.error("Failed to upload image to Cloudinary.");
        // Optionally show a toast here:
        // toast.error("Image upload failed. Please try again.");
        return;
      }

      if (type === "cover") {
        setCreateContest((prev) => ({
          ...prev,
          coverImageUrl: imgURL,
        }));
        setCoverImage(imgURL);
      } else if (type === "logo") {
        setCreateContest((prev) => ({
          ...prev,
          contestLogoImageUrl: imgURL,
        }));
        setLogoImage(imgURL);
      }
    } catch (error) {
      console.error("Error uploading image:", error);
      // Optionally show a toast here:
      // toast.error("Something went wrong while uploading.");
    } finally {
      setIsUploading(false);
    }
  };

  // Contestant management
  const onContestantInputChange = (field, value) => {
    setContestantForm((prev) => ({ ...prev, [field]: value }));
  };

  const onContestantImageUpload = async (file) => {
    if (!file) return;
    try {
      setIsUploading(true);

      const imgURL = await uploadToCloudinary(file);
      if (!imgURL) {
        console.error("Failed to upload image to Cloudinary.");
        // Optionally show toast:
        toast.error("Image upload failed. Please try again.");
        return;
      }

      setContestantForm((prev) => ({
        ...prev,
        image: imgURL,
      }));
    } catch (error) {
      console.error("Error uploading contestant image:", error);
      // Optionally show toast:
      toast.error("Something went wrong while uploading.");
    } finally {
      setIsUploading(false);
    }
  };

  const onAddContestant = () => {
    if (contestantForm.name.trim() === "") return;

    setPositions((prev) =>
      prev.map((pos) =>
        pos.name === contestantForm.position
          ? {
            ...pos,
            contestants: [
              ...(Array.isArray(pos.contestants) ? pos.contestants : []),
              { ...contestantForm, dateId: Date.now() },
            ],
          }
          : pos
      )
    );

    setContestants((prev) => [...prev, { ...contestantForm, id: Date.now() }]);
    setCreateContest((prev) => ({
      ...prev,
      contestants: [...contestants, { ...contestantForm, id: Date.now() }],
    }));

    setContestantForm({
      name: "",
      bio: "",
      position: "",
      image: null,
      email: "",
    });
  };

  const onRemoveContestant = (id) => {
    setPositions((prev) =>
      prev.map((pos) =>
        pos.name === contestantForm.position
          ? {
            ...pos,
            contestants: pos.contestants.filter((c) => c.id !== id),
          }
          : pos
      )
    );
    setContestants((prev) => prev.filter((c) => c.id !== id));
    setCreateContest((prev) => ({
      ...prev,
      contestants: contestants.filter((c) => c.id !== id),
    }));
  };

  // Bulk upload and drag-drop handlers
  const onBulkUpload = (file) => {
    console.log("Bulk upload file:", file);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  const handleDrop = (e, type) => {
    e.preventDefault();
    const files = e.dataTransfer.files;
    if (files.length > 0) {
      if (type === "bulk") {
        onBulkUpload(files[0]);
      } else if (type === "contestantImage") {
        onContestantImageUpload(files[0]);
      }
    }
  };

  // Navigation handlers
  const nextStep = () => {
    if (currentStep < 4) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const onEditStep = (step) => {
    if (step >= 0 && step <= 4) {
      setCurrentStep(step);
    }
  };

  // Save draft functionality
  const saveDraft = async () => {
    try {
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
        _id: createContest?._id || null, // Include contest ID if editing
        status: "draft",
        type: "spot-light",
        uid: user?.firebaseUid,
      };

      const res = await axios.post("/api/contest/create-contest", payload);

      if (res.data && res.data.contest) {
        setUserContests(res.data.contest);
        toast.success("Contest Saved as Draft Successfully");
        navigate("/dashboard");
      }
    } catch (err) {
      console.error("Failed to Save contest:", err);
      toast.error("Failed to Save contest. Please try again.");
    }
  };

  // Publish contest
  const onPublish = async () => {
    try {
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
        status: "upcoming",
        type: "spot-light",
        uid: user?.firebaseUid,
        _id: createContest?._id || null, // Include contest ID if editing
      };

      const res = await axios.post("/api/contest/create-contest", payload);

      if (res.data && res.data.contest) {
        setUserContests(res.data.contest);
        toast.success("Contest created successfully");
        navigate("/dashboard");
      }
    } catch (err) {
      console.error("Failed to create contest:", err);
      toast.error("Failed to create contest. Please try again.");
    }
  };

  // Step components
  const steps = [
    <ContestDetailsStep
      formData={formData}
      onInputChange={onInputChange}
      positions={positions}
      onAddPosition={onAddPosition}
      onUpdatePosition={onUpdatePosition}
      onRemovePosition={onRemovePosition}
      setCreateContest={setCreateContest}
      setContestantForm={setContestantForm}
    />,
    <ImageUploadStep
      coverImage={coverImage}
      logoImage={logoImage}
      onFileUpload={onFileUpload}
      isUploading={isUploading}
    />,
    <ContestantDetailsStep
      contestantForm={contestantForm}
      onContestantInputChange={onContestantInputChange}
      onContestantImageUpload={onContestantImageUpload}
      onAddContestant={onAddContestant}
      onRemoveContestant={onRemoveContestant}
      contestants={contestants}
      onBulkUpload={onBulkUpload}
      handleDragOver={handleDragOver}
      handleDrop={handleDrop}
      positions={positions}
      isUploading={isUploading}
    />,
    <Security
      isVoterRegistrationEnabled={isVoterRegistrationEnabled}
      onToggleVoterRegistration={() => setIsVoterRegistrationEnabled(!isVoterRegistrationEnabled)}
    />,
    <ReviewStep
      coverImage={coverImage}
      logoImage={logoImage}
      formData={formData}
      contestants={contestants}
      onEditStep={onEditStep}
      onPublish={onPublish}
    />,
  ];

  const stepTitles = [
    "Contest Details",
    "Upload Images",
    "Add Contestants",
    "Security Settings",
    "Review & Publish",
  ];

  return (
    <div className="flex bg-white min-h-screen lg:gap-[10rem]">
      <Sidebar />

      {/* Main Container with improved mobile responsiveness */}
      <div className="flex-1 p-3 sm:p-4 md:p-6 lg:ml-20 w-full max-w-5xl mx-auto">

        {/* Header Section */}
        <div className="mb-4 sm:mb-6">
          <h2 className="text-center text-xl sm:text-2xl md:text-3xl font-semibold text-gray-900 leading-tight">
            Create Spotlight Contest
          </h2>
        </div>

        {/* Step Progress Indicator - Mobile Optimized */}
        <div className="mb-6 md:mb-8">
          {/* Mobile: Vertical Progress on small screens */}
          <div className="block sm:hidden">
            <div className="bg-gray-50 rounded-lg p-4 mb-4">
              <div className="text-sm font-medium text-gray-600 mb-2">
                Step {currentStep + 1} of {stepTitles.length}
              </div>
              <div className="text-lg font-semibold text-orange-600 mb-2">
                {stepTitles[currentStep]}
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className="bg-orange-500 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${((currentStep + 1) / stepTitles.length) * 100}%` }}
                />
              </div>
            </div>
          </div>

          {/* Desktop: Horizontal Progress on larger screens */}
          <div className="hidden sm:block">
  <div className="flex items-center mb-4">
    {/* Left Arrow */}
    <button
      type="button"
      className="bg-white border border-gray-300 rounded-full p-2 shadow hover:bg-gray-100 mr-2"
      onClick={() => {
        document.getElementById('step-progress-bar')?.scrollBy({ left: -200, behavior: 'smooth' });
      }}
      aria-label="Scroll left"
    >
      <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2"><path d="M13 17l-5-5 5-5" /></svg>
    </button>
    {/* Progress Bar */}
    <div
      id="step-progress-bar"
      className="flex items-center justify-between overflow-x-auto scroll-smooth pb-2"
      style={{ scrollbarWidth: 'none', maxWidth: 'calc(100vw - 120px)' }} // adjust 120px if needed for arrow width
    >
      {stepTitles.map((title, index) => (
        <div key={index} className="flex items-center min-w-fit">
          <div
            className={`w-8 h-8 lg:w-10 lg:h-10 rounded-full flex items-center justify-center text-sm lg:text-base font-medium transition-all duration-200 ${
              index <= currentStep
                ? "bg-orange-500 text-white shadow-md"
                : "bg-gray-200 text-gray-600"
            }`}
          >
            {index + 1}
          </div>
          <span
            className={`ml-2 lg:ml-3 text-sm lg:text-base whitespace-nowrap transition-all duration-200 ${
              index <= currentStep
                ? "text-orange-600 font-medium"
                : "text-gray-500"
            }`}
          >
            {title}
          </span>
          {index < stepTitles.length - 1 && (
            <div
              className={`ml-3 lg:ml-6 w-12 lg:w-20 h-0.5 transition-all duration-300 ${
                index < currentStep ? "bg-orange-500" : "bg-gray-200"
              }`}
            />
          )}
        </div>
      ))}
    </div>
    {/* Right Arrow */}
    <button
      type="button"
      className="bg-white border border-gray-300 rounded-full p-2 shadow hover:bg-gray-100 ml-2"
      onClick={() => {
        document.getElementById('step-progress-bar')?.scrollBy({ left: 200, behavior: 'smooth' });
      }}
      aria-label="Scroll right"
    >
      <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2"><path d="M7 17l5-5-5-5" /></svg>
    </button>
  </div>
</div>
        </div>

        {/* Step Content */}
        <div className="mb-6 md:mb-8">
          {steps[currentStep]}
        </div>

        {/* Position Popup */}
        <PositionPopup
          isOpen={isPositionPopupOpen}
          onClose={handleClosePositionPopup}
          onAddPosition={handleAddPositionFromPopup}
        />

        {/* Navigation Buttons - Mobile Optimized */}
        <div className="sticky bottom-0 bg-white border-t border-gray-200 p-4 -mx-3 sm:mx-0 sm:border-0 sm:bg-transparent sm:p-0 sm:static">
          {/* Mobile: Stacked Layout */}
          <div className="flex flex-col space-y-3 sm:hidden">
            <div className="flex space-x-3">
              <button
                onClick={prevStep}
                disabled={isUploading || currentStep === 0}
                className="flex-1 px-4 py-3 bg-gray-100 text-gray-700 rounded-lg font-medium disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-200 transition-colors text-sm"
              >
                Back
              </button>
              <button
                onClick={nextStep}
                className={`flex-1 px-4 py-3 rounded-lg font-medium transition-colors text-sm ${isUploading ? "opacity-50 cursor-not-allowed" : ""
                  } bg-orange-500 hover:bg-orange-600 text-white`}
                disabled={isUploading}
              >
                Next
              </button>
            </div>
            <button
              onClick={saveDraft}
              className={`w-full px-4 py-3 bg-teal-600 text-white rounded-lg font-medium hover:bg-teal-700 transition-colors text-sm ${isUploading ? "opacity-50 cursor-not-allowed" : ""
                }`}
              disabled={isUploading}
            >
              Save as Draft
            </button>
          </div>

          {/* Desktop: Horizontal Layout */}
          <div className="hidden sm:flex sm:flex-row sm:justify-between sm:items-center">
            <button
              onClick={saveDraft}
              className={`px-6 py-2 lg:px-8 lg:py-3 bg-teal-600 text-white rounded-lg font-medium hover:bg-teal-700 transition-colors ${isUploading ? "opacity-50 cursor-not-allowed" : ""
                }`}
              disabled={isUploading}
            >
              Save as Draft
            </button>
            <div className="flex space-x-4">
              <button
                onClick={prevStep}
                disabled={isUploading || currentStep === 0}
                className="px-6 py-2 lg:px-8 lg:py-3 bg-gray-100 text-gray-700 rounded-lg font-medium disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-200 transition-colors"
              >
                Back
              </button>
              {currentStep !== steps.length - 1 && (
                <button
                  onClick={nextStep}
                  className={`px-6 py-2 lg:px-8 lg:py-3 rounded-lg font-medium transition-colors ${isUploading ? "opacity-50 cursor-not-allowed" : ""} bg-orange-500 hover:bg-orange-600 text-white`}
                  disabled={isUploading}
                >
                  Next
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreateSpotlightContest;