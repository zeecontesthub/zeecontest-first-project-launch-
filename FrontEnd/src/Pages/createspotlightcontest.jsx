import React, { useState } from "react";
import Sidebar from "../Components/sidebar";
import ContestDetailsStep from "../Components/ContestDetailsStep";
import ImageUploadStep from "../Components/ImageUploadStep";
import ContestantDetailsStep from "../Components/ContestantDetailsStep";
import ReviewStep from "../Components/ReviewStep";
import PositionPopup from "../Components/PositionPopup";
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

  // Image upload handlers
  const onFileUpload = async (file, type) => {
    if (type === "cover") {
      const imgURL = await uploadToCloudinary(file);
      setCreateContest((prev) => ({
        ...prev,
        coverImageUrl: imgURL,
      }));
      setCoverImage(imgURL);
    } else if (type === "logo") {
      const imgURL = await uploadToCloudinary(file);
      setCreateContest((prev) => ({
        ...prev,
        contestLogoImageUrl: imgURL,
      }));
      setLogoImage(imgURL);
    }
  };

  // Contestant management
  const onContestantInputChange = (field, value) => {
    setContestantForm((prev) => ({ ...prev, [field]: value }));
  };

  const onContestantImageUpload = async (file) => {
    const imgURL = await uploadToCloudinary(file);
    setContestantForm((prev) => ({ ...prev, image: imgURL }));
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
    if (currentStep < 3) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const onEditStep = (step) => {
    if (step >= 0 && step <= 3) {
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
    "Review & Publish",
  ];

  return (
    <div className="bg-white min-h-screen">
      <Sidebar />
      <div className="ml-60 p-8">
        <div>
          <h2 className="text-xl font-semibold text-gray-900 mb-6">
            Create Spotlight Contest
          </h2>
        </div>

        {/* Step Progress Indicator */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            {stepTitles.map((title, index) => (
              <div key={index} className="flex items-center">
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                    index <= currentStep
                      ? "bg-orange-500 text-white"
                      : "bg-gray-200 text-gray-600"
                  }`}
                >
                  {index + 1}
                </div>
                <span
                  className={`ml-2 text-sm ${
                    index <= currentStep
                      ? "text-orange-600 font-medium"
                      : "text-gray-500"
                  }`}
                >
                  {title}
                </span>
                {index < stepTitles.length - 1 && (
                  <div
                    className={`ml-4 w-16 h-0.5 ${
                      index < currentStep ? "bg-orange-500" : "bg-gray-200"
                    }`}
                  />
                )}
              </div>
            ))}
          </div>
        </div>

        {steps[currentStep]}

        <PositionPopup
          isOpen={isPositionPopupOpen}
          onClose={handleClosePositionPopup}
          onAddPosition={handleAddPositionFromPopup}
        />

        {/* Navigation Buttons */}
        <div className="flex justify-between mt-8">
          <button
            onClick={saveDraft}
            className="px-6 py-2 bg-teal-900 text-white rounded-md font-medium hover:bg-blue-600 transition-colors"
          >
            Save as Draft
          </button>
          <div className="flex space-x-4">
            <button
              onClick={prevStep}
              disabled={currentStep === 0}
              className="px-6 py-2 bg-gray-300 text-gray-700 rounded-md font-medium disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-400 transition-colors"
            >
              Back
            </button>
            <button
              onClick={currentStep === steps.length - 1 ? onPublish : nextStep}
              className={`px-6 py-2 rounded-md font-medium transition-colors ${
                currentStep === steps.length - 1
                  ? isFormValid()
                    ? "bg-orange-500 hover:bg-orange-600 text-white"
                    : "bg-gray-300 text-gray-500 cursor-not-allowed"
                  : "bg-orange-500 hover:bg-orange-600 text-white"
              }`}
              disabled={currentStep === steps.length - 1 && !isFormValid()}
            >
              {currentStep === steps.length - 1 ? "Publish" : "Next"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreateSpotlightContest;
