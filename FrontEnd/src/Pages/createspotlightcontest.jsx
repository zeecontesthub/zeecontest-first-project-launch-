import PositionPopup from "../Components/PositionPopup";

import React, { useState } from "react";
import Sidebar from "../Components/sidebar";
import ContestDetailsStep from "../Components/ContestDetailsStep";
import ImageUploadStep from "../Components/ImageUploadStep";
import ContestantDetailsStep from "../Components/ContestantDetailsStep";
import ReviewStep from "../Components/ReviewStep";
import axios from "axios";
import { uploadToCloudinary } from "../actions/cloudinaryAction";
import { useUser } from "../context/UserContext";

const CreateSpotlightContest = () => {
  const { user, setUserContests, createContest, setCreateContest } = useUser();
  const [currentStep, setCurrentStep] = useState(0);

  // State for Contest Details Step
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
  });

  // New state for position popup visibility
  const [isPositionPopupOpen, setIsPositionPopupOpen] = useState(false);

  const [positions, setPositions] = useState(
    createContest?.positions && createContest.positions.length > 0
      ? createContest.positions
      : [
          // {
          //   name: "",
          //   voters: [
          //     // { name: "", email: "" }
          //   ],
          //   contestants: [
          //     // { name: "", email: "", bio: "", imageUrl: "" }
          //   ],
          //   description: "",
          // },
        ]
  );
  const [contestants, setContestants] = useState(
    createContest?.contestants || []
  );

  console.log(createContest?.contestants);
  const [coverImage, setCoverImage] = useState(
    createContest?.coverImageUrl || null
  );
  const [logoImage, setLogoImage] = useState(
    createContest?.contestLogoImageUrl || null
  );

  // State for Contestant Details Step
  const [contestantForm, setContestantForm] = useState({
    name: "",
    bio: "",
    position: "",
    image: null,
    email: "",
  });

  // Handlers for Contest Details Step
  const onInputChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  // Modified onAddPosition to open popup
  const onAddPosition = () => {
    setIsPositionPopupOpen(true);
  };

  // Handler to add position from popup
  const handleAddPositionFromPopup = (position) => {
    setPositions((prev) => [...prev, position]);
    setCreateContest((prev) => ({
      ...prev,
      positions: [...positions, position],
    }));
    setIsPositionPopupOpen(false);
  };

  // Handler to close popup
  const handleClosePositionPopup = () => {
    setIsPositionPopupOpen(false);
  };

  // Handlers for Image Upload Step
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

  // Handlers for Contestant Details Step
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

    setContestantForm({ name: "", bio: "", position: "", image: null });
  };

  const onBulkUpload = (file) => {
    // Implement bulk upload logic here if needed
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
  const nextStep = async () => {
    console.log("Next step clicked. Current step:", currentStep);
    if (currentStep < 3) {
      return setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    console.log("Previous step clicked. Current step:", currentStep);
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const onEditStep = (step) => {
    if (step >= 0 && step <= 3) {
      setCurrentStep(step);
    }
  };

  const onPublish = async () => {
    // Implement publish logic here

    // On the last step (Publish), send data to backend
    try {
      // Prepare your payload
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
        status: "upcoming",
        type: "spot-light",
        uid: user?.firebaseUid,
      };

      const res = await axios.post(
        "/api/contest/create-contest",
        payload /*, { headers } */
      );

      if (res.data && res.data.contest) {
        setUserContests(res.data.contest);
        alert("Contest created successfully!");
        // Optionally redirect or reset form here
      }
    } catch (err) {
      console.error("Failed to create contest:", err);
      alert("Failed to create contest. Please try again.");
    }
    alert("Contest published!");
  };

  const onUpdatePosition = (index, field, value) => {
    setPositions((prev) =>
      prev.map((pos, i) => (i === index ? { ...pos, [field]: value } : pos))
    );
  };

  const onRemovePosition = (index) => {
    setPositions((prev) => prev.filter((_, i) => i !== index));
  };

  const steps = [
    <ContestDetailsStep
      formData={formData}
      onInputChange={onInputChange}
      positions={positions}
      onAddPosition={onAddPosition}
      onUpdatePosition={onUpdatePosition} // Add this
      onRemovePosition={onRemovePosition} // Add this
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
            onClick={prevStep}
            disabled={currentStep === 0}
            className="px-6 py-2 bg-gray-300 text-gray-700 rounded-md font-medium disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-400 transition-colors"
          >
            Back
          </button>
          <button
            onClick={currentStep === steps.length - 1 ? onPublish : nextStep}
            // disabled={currentStep === steps.length - 1}
            className="px-6 py-2 bg-orange-500 text-white rounded-md font-medium disabled:opacity-50 disabled:cursor-not-allowed hover:bg-orange-600 transition-colors"
          >
            {currentStep === steps.length - 1 ? "Publish" : "Next"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default CreateSpotlightContest;
