import PositionPopup from '../Components/PositionPopup';

import React, { useState } from 'react';
import Sidebar from '../Components/sidebar';
import ContestDetailsStep from '../Components/ContestDetailsStep';
import ImageUploadStep from '../Components/ImageUploadStep';
import ContestantDetailsStep from '../Components/ContestantDetailsStep';
import ReviewStep from '../Components/ReviewStep';


const CreateSpotlightContest = () => {
    const [currentStep, setCurrentStep] = useState(0);

    // State for Contest Details Step
    const [formData, setFormData] = useState({
        contestName: '',
        contestDescription: '',
        startDate: '',
        endDate: '',
        startTime: '',
        endTime: '',
    });
    const [positions, setPositions] = useState([]);

    // New state for position popup visibility
    const [isPositionPopupOpen, setIsPositionPopupOpen] = useState(false);

    // State for Image Upload Step
    const [coverImage, setCoverImage] = useState(null);
    const [logoImage, setLogoImage] = useState(null);

    // State for Contestant Details Step
    const [contestantForm, setContestantForm] = useState({
        name: '',
        bio: '',
        position: '',
        image: null,
    });
    const [contestants, setContestants] = useState([]);

    // Handlers for Contest Details Step
    const onInputChange = (field, value) => {
        setFormData(prev => ({ ...prev, [field]: value }));
    };

    // Modified onAddPosition to open popup
    const onAddPosition = () => {
        setIsPositionPopupOpen(true);
    };

    // Handler to add position from popup
    const handleAddPositionFromPopup = (position) => {
        setPositions(prev => [...prev, position]);
        setIsPositionPopupOpen(false);
    };

    // Handler to close popup
    const handleClosePositionPopup = () => {
        setIsPositionPopupOpen(false);
    };

    // Handlers for Image Upload Step
    const onFileUpload = (file, type) => {
        if (type === 'cover') {
            setCoverImage(file);
        } else if (type === 'logo') {
            setLogoImage(file);
        }
    };

    // Handlers for Contestant Details Step
    const onContestantInputChange = (field, value) => {
        setContestantForm(prev => ({ ...prev, [field]: value }));
    };

    const onContestantImageUpload = (file) => {
        setContestantForm(prev => ({ ...prev, image: file }));
    };

    const onAddContestant = () => {
        if (contestantForm.name.trim() === '') return;
        setContestants(prev => [...prev, { ...contestantForm, id: Date.now() }]);
        setContestantForm({ name: '', bio: '', position: '', image: null });
    };

    const onRemoveContestant = (id) => {
        setContestants(prev => prev.filter(c => c.id !== id));
    };

    const onBulkUpload = (file) => {
        // Implement bulk upload logic here if needed
        console.log('Bulk upload file:', file);
    };

    const handleDragOver = (e) => {
        e.preventDefault();
    };

    const handleDrop = (e, type) => {
        e.preventDefault();
        const files = e.dataTransfer.files;
        if (files.length > 0) {
            if (type === 'bulk') {
                onBulkUpload(files[0]);
            } else if (type === 'contestantImage') {
                onContestantImageUpload(files[0]);
            }
        }
    };

    // Navigation handlers
    const nextStep = () => {
        console.log('Next step clicked. Current step:', currentStep);
        if (currentStep < 3) {
            setCurrentStep(currentStep + 1);
        }
    };

    const prevStep = () => {
        console.log('Previous step clicked. Current step:', currentStep);
        if (currentStep > 0) {
            setCurrentStep(currentStep - 1);
        }
    };

    const onEditStep = (step) => {
        if (step >= 0 && step <= 3) {
            setCurrentStep(step);
        }
    };

    const onPublish = () => {
        // Implement publish logic here
        alert('Contest published!');
    };

    const saveDraft = () => {
        const draftData = {
            formData,
            positions,
            coverImage: coverImage ? coverImage.name || coverImage : null,
            logoImage: logoImage ? logoImage.name || logoImage : null,
            contestantForm,
            contestants,
            currentStep
        };
        try {
            localStorage.setItem('spotlightContestDraft', JSON.stringify(draftData));
            alert('Draft saved successfully!');
        } catch (error) {
            alert('Failed to save draft.');
            console.error('Save draft error:', error);
        }
    };

    const onUpdatePosition = (index, field, value) => {
        setPositions(prev => prev.map((pos, i) =>
            i === index ? { ...pos, [field]: value } : pos
        ));
    };

    const onRemovePosition = (index) => {
        setPositions(prev => prev.filter((_, i) => i !== index));
    };

    const steps = [
        <ContestDetailsStep
            formData={formData}
            onInputChange={onInputChange}
            positions={positions}
            onAddPosition={onAddPosition}
            onUpdatePosition={onUpdatePosition}  // Add this
            onRemovePosition={onRemovePosition}  // Add this

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
        />,
        <ReviewStep
            coverImage={coverImage}
            logoImage={logoImage}
            formData={formData}
            contestants={contestants}
            onEditStep={onEditStep}
            onPublish={onPublish}
        />
    ];

    const stepTitles = ['Contest Details', 'Upload Images', 'Add Contestants', 'Review & Publish'];

    return (
        <div className="bg-white min-h-screen flex">
            <Sidebar />
            <div className="flex-1 w-full p-6 ml-20">
                <div>
                    <h2 className='text-xl font-semibold text-gray-900 mb-6'>Create Spotlight Contest</h2>
                </div>
                {/* Step Progress Indicator */}
                <div className="mb-8">
                    <div className="flex items-center justify-between mb-4">
                        {stepTitles.map((title, index) => (
                            <div key={index} className="flex items-center">
                                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${index <= currentStep
                                    ? 'bg-orange-500 text-white'
                                    : 'bg-gray-200 text-gray-600'
                                    }`}>
                                    {index + 1}
                                </div>
                                <span className={`ml-2 text-sm ${index <= currentStep ? 'text-orange-600 font-medium' : 'text-gray-500'
                                    }`}>
                                    {title}
                                </span>
                                {index < stepTitles.length - 1 && (
                                    <div className={`ml-4 w-16 h-0.5 ${index < currentStep ? 'bg-orange-500' : 'bg-gray-200'
                                        }`} />
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
                            onClick={nextStep}
                            disabled={currentStep === steps.length - 1}
                            className="px-6 py-2 bg-orange-500 text-white rounded-md font-medium disabled:opacity-50 disabled:cursor-not-allowed hover:bg-orange-600 transition-colors"
                        >
                            {currentStep === steps.length - 1 ? 'Publish' : 'Next'}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CreateSpotlightContest;
