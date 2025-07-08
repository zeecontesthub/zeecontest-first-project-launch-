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
        startTimeHour: '',
        startTimeMinute: '',
        startTimeAmPm: 'AM',
        endTimeHour: '',
        endTimeMinute: '',
        endTimeAmPm: 'AM',
        isPaidContest: null,
        voterFee: '',
        allowMultipleVotes: false
    });

    const [positions, setPositions] = useState([]);
    const [isPositionPopupOpen, setIsPositionPopupOpen] = useState(false);
    const [coverImage, setCoverImage] = useState(null);
    const [logoImage, setLogoImage] = useState(null);
    const [contestantForm, setContestantForm] = useState({
        name: '',
        bio: '',
        position: '',
        image: null,
    });
    const [contestants, setContestants] = useState([]);

    // Form validation function
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
        setFormData(prev => ({ ...prev, [field]: value }));
    };

    const onAddPosition = () => {
        setIsPositionPopupOpen(true);
    };

    const handleAddPositionFromPopup = (position) => {
        setPositions(prev => [...prev, position]);
        setIsPositionPopupOpen(false);
    };

    const handleClosePositionPopup = () => {
        setIsPositionPopupOpen(false);
    };

    const onUpdatePosition = (index, field, value) => {
        setPositions(prev => prev.map((pos, i) =>
            i === index ? { ...pos, [field]: value } : pos
        ));
    };

    const onRemovePosition = (index) => {
        setPositions(prev => prev.filter((_, i) => i !== index));
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
        if (currentStep < 3) {
            setCurrentStep(currentStep + 1);
        } else if (currentStep === 3) {
            onPublish();
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

    const onPublish = () => {
        if (isFormValid()) {
            // Here you would typically make an API call to publish the contest
            alert('Contest published successfully!');
            // resetForm(); // Uncomment if you want to reset after publishing
        } else {
            alert('Please complete all required fields before publishing:\n' +
                (!formData.contestName ? '- Contest Name\n' : '') +
                (!formData.contestDescription ? '- Contest Description\n' : '') +
                (!formData.startDate ? '- Start Date\n' : '') +
                (!formData.endDate ? '- End Date\n' : '') +
                (contestants.length === 0 ? '- At least one contestant\n' : '')
            );
        }
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

    const steps = [
        <ContestDetailsStep
            formData={formData}
            onInputChange={onInputChange}
            positions={positions}
            onAddPosition={onAddPosition}
            onUpdatePosition={onUpdatePosition}
            onRemovePosition={onRemovePosition}
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
        />
    ];

    const stepTitles = ['Contest Details', 'Upload Images', 'Add Contestants', 'Review & Publish'];

    return (
        <div className="bg-white min-h-screen">
            <Sidebar />
            <div className="p-8 ml-20">
                <div>
                    <h2 className='text-xl font-semibold text-gray-900 mb-6'>Create Spotlight Contest</h2>
                </div>
                
                {/* Step Progress Indicator */}
                <div className="mb-8">
                    <div className="flex items-center justify-between mb-4">
                        {stepTitles.map((title, index) => (
                            <div key={index} className="flex items-center">
                                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                                    index <= currentStep
                                        ? 'bg-orange-500 text-white'
                                        : 'bg-gray-200 text-gray-600'
                                }`}>
                                    {index + 1}
                                </div>
                                <span className={`ml-2 text-sm ${
                                    index <= currentStep ? 'text-orange-600 font-medium' : 'text-gray-500'
                                }`}>
                                    {title}
                                </span>
                                {index < stepTitles.length - 1 && (
                                    <div className={`ml-4 w-16 h-0.5 ${
                                        index < currentStep ? 'bg-orange-500' : 'bg-gray-200'
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
                            className={`px-6 py-2 rounded-md font-medium transition-colors ${
                                currentStep === steps.length - 1
                                    ? isFormValid()
                                        ? 'bg-orange-500 hover:bg-orange-600 text-white'
                                        : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                                    : 'bg-orange-500 hover:bg-orange-600 text-white'
                            }`}
                            disabled={currentStep === steps.length - 1 && !isFormValid()}
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