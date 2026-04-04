import React, { useState } from 'react';
import TopNav from '../Components/TopNav';
import ContestDetailsStep from '../Components/ContestDetailsStep';
import ContestantDetailsStep from '../Components/ContestantDetailsStep';
import Security from '../Components/Security';
import axios from 'axios';
import { uploadToCloudinary } from '../actions/cloudinaryAction';
import { useUser } from '../context/UserContext';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import Papa from 'papaparse';
import convertGoogleDriveUrl from '../actions/convertGoogleDriveUrl';

const CreateSpotlightContest = () => {
  const navigate = useNavigate();
  const { user, setUserContests, createContest, setCreateContest } = useUser();
  const [currentStep, setCurrentStep] = useState(0);
  const [isUploading, setIsUploading] = useState(false);
  const [editingId, setEditingId] = useState(null);

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
    name: '',
    bio: '',
    position: '',
    image: null,
    email: '',
  });

  // State for contest details
  const [formData, setFormData] = useState({
    contestName: createContest?.title || '',
    contestDescription: createContest?.description || '',
    startDate: createContest?.startDate || '',
    endDate: createContest?.endDate || '',
    startTime: createContest?.startTime || {
      startTimeHour: '',
      startTimeMinute: '00',
      startTimeAmPm: 'AM',
    },
    endTime: createContest?.endTime || {
      endTimeHour: '',
      endTimeMinute: '00',
      endTimeAmPm: 'AM',
    },
    payment: createContest?.payment || {
      isPaid: false,
      amount: 0,
    },
    allowMultipleVotes: createContest?.allowMultipleVotes || false,
    contestType: createContest?.contestType || 'open',
    closedContestType: createContest?.closedContestType || 'pre-registration',
    authenticationField: createContest?.authenticationField || '',
    isVoteCountVisible: createContest?.isVoteCountVisible !== undefined ? createContest.isVoteCountVisible : true,
    resultRevealSetting: createContest?.resultRevealSetting || 'immediately',
    revealDate: createContest?.revealDate || '',
    revealTime: createContest?.revealTime || {
      revealHour: '',
      revealMinute: '00',
      revealAmPm: 'AM',
    },
  });

  const [customVoters, setCustomVoters] = useState(
    createContest?.closedContestVoters || []
  );

  const [isVoterRegistrationEnabled, setIsVoterRegistrationEnabled] = useState(
    createContest?.isVoterRegistrationEnabled || false
  );

  const onInputChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const onAddPosition = () => {
    setPositions((prev) => [...prev, { name: 'New Position', description: '', contestants: [] }]);
  };

  const onUpdatePosition = (index, field, value) => {
    setPositions((prev) =>
      prev.map((pos, i) => (i === index ? { ...pos, [field]: value } : pos))
    );
  };

  const onRemovePosition = (index) => {
    setPositions((prev) => prev.filter((_, i) => i !== index));
  };

  const onFileUpload = async (file, type) => {
    if (!file) return;
    try {
      setIsUploading(true);
      const imgURL = await uploadToCloudinary(file);
      if (!imgURL) return;

      if (type === 'cover') {
        setCoverImage(imgURL);
      } else if (type === 'logo') {
        setLogoImage(imgURL);
      }
    } catch (error) {
      console.error('Error uploading image:', error);
    } finally {
      setIsUploading(false);
    }
  };

  const onContestantInputChange = (field, value) => {
    setContestantForm((prev) => ({ ...prev, [field]: value }));
  };

  const onContestantImageUpload = async (file) => {
    if (!file) return;
    try {
      setIsUploading(true);
      const imgURL = await uploadToCloudinary(file);
      if (!imgURL) {
        toast.error('Image upload failed.');
        return;
      }
      setContestantForm((prev) => ({ ...prev, image: imgURL }));
    } catch (error) {
      console.error('Error uploading contestant image:', error);
    } finally {
      setIsUploading(false);
    }
  };

  const onAddContestant = () => {
    if (contestantForm.name.trim() === '') return;

    if (editingId) {
      setContestants((prev) =>
        prev.map((c) => (c.dateId === editingId ? { ...contestantForm, dateId: editingId } : c))
      );
      setEditingId(null);
      toast.success('Contestant updated!');
    } else {
      const newContestant = { ...contestantForm, dateId: Date.now() };
      setContestants((prev) => [...prev, newContestant]);
      toast.success('Contestant added!');
    }

    setContestantForm({ name: '', bio: '', position: '', image: null, email: '' });
  };

  const onEditContestant = (contestant) => {
    setEditingId(contestant.dateId);
    setContestantForm({
      name: contestant.name,
      bio: contestant.bio,
      position: contestant.position,
      image: contestant.image,
      email: contestant.email,
    });
    // Scroll to form or show indicator
    toast.info(`Editing ${contestant.name}`);
  };

  const onCancelEdit = () => {
    setEditingId(null);
    setContestantForm({ name: '', bio: '', position: '', image: null, email: '' });
  };

  const onRemoveContestant = (positionName, id) => {
    setContestants((prev) => prev.filter((c) => c.dateId !== id));
    if (editingId === id) onCancelEdit();
  };

  const findKey = (keys, regex) => keys.find((key) => regex.test(key));

  const onBulkUpload = (file) => {
    if (!file) return;
    setIsUploading(true);
    Papa.parse(file, {
      header: true,
      skipEmptyLines: true,
      complete: (results) => {
        const allKeys = results.meta.fields || [];
        const newContestants = [];
        const newPositionsToAdd = [];

        results.data.forEach((row) => {
          const nameKey = findKey(allKeys, /name|contestantName|c_name/i);
          const bioKey = findKey(allKeys, /bio|c_bio/i);
          const positionKey = findKey(allKeys, /position|pos/i);
          const emailKey = findKey(allKeys, /email|e_mail/i);
          const imageKey = findKey(allKeys, /image|img|url/i);

          const name = nameKey ? row[nameKey] : '';
          const position = positionKey ? row[positionKey] : '';

          if (name.trim() === '' || position.trim() === '') return;

          const newContestantData = {
            name: name,
            bio: bioKey ? row[bioKey] : '',
            position: position,
            image: imageKey ? convertGoogleDriveUrl(row[imageKey]) : null,
            email: emailKey ? row[emailKey] : '',
            dateId: Date.now() + newContestants.length,
          };

          newContestants.push(newContestantData);

          const positionExists = positions.some((pos) => pos.name.toLowerCase() === position.toLowerCase());
          const alreadyInNewPositions = newPositionsToAdd.some((pos) => pos.name.toLowerCase() === position.toLowerCase());

          if (!positionExists && !alreadyInNewPositions) {
            newPositionsToAdd.push({ name: position, description: `Auto-created`, contestants: [] });
          }
        });

        if (newContestants.length > 0) {
          if (newPositionsToAdd.length > 0) setPositions(prev => [...prev, ...newPositionsToAdd]);
          setContestants(prev => [...prev, ...newContestants]);
          toast.success(`Loaded ${newContestants.length} contestants.`);
        }
        setIsUploading(false);
      }
    });
  };

  const stepTitles = ['Identity & Schedule', 'Structure & Participants', 'Settings & Review'];

  const nextStep = () => {
    if (currentStep < 2) setCurrentStep(currentStep + 1);
  };

  const prevStep = () => {
    if (currentStep > 0) setCurrentStep(currentStep - 1);
  };

  // Auto-save to context (localStorage) whenever state changes
  React.useEffect(() => {
    const syncData = {
      ...formData,
      positions,
      contestants,
      coverImageUrl: coverImage,
      contestLogoImageUrl: logoImage,
      closedContestVoters: customVoters,
      isVoterRegistrationEnabled
    };
    setCreateContest(syncData);
  }, [formData, positions, contestants, coverImage, logoImage, customVoters, isVoterRegistrationEnabled]);

  const onPublish = async () => {
    try {
      const payload = {
        title: formData.contestName,
        description: formData.contestDescription,
        startDate: formData.startDate,
        endDate: formData.endDate,
        startTime: formData.startTime,
        endTime: formData.endTime,
        positions: positions.map(pos => ({
          ...pos,
          contestants: contestants.filter(c => c.position === pos.name)
        })),
        participants: contestants,
        coverImageUrl: coverImage,
        contestLogoImageUrl: logoImage,
        payment: formData.payment,
        allowMultipleVotes: formData.allowMultipleVotes,
        status: 'upcoming',
        type: 'spot-light',
        uid: user?.firebaseUid,
        isClosedContest: formData.contestType === 'closed',
        closedContestType: formData.closedContestType,
        authenticationField: formData.authenticationField,
        closedContestVoters: customVoters,
        isVoteCountVisible: formData.isVoteCountVisible,
        resultRevealSetting: formData.resultRevealSetting,
        revealDate: formData.revealDate,
        revealTime: formData.revealTime,
      };

      const res = await axios.post('/api/contest/create-contest', payload);
      if (res.data) {
        toast.success('Contest Published!');
        setCreateContest(null); // Clear draft after publish
        navigate('/dashboard');
      }
    } catch (err) {
      toast.error('Failed to create contest.');
    }
  };

  const onSaveDraft = async () => {
    try {
      const payload = {
        title: formData.contestName || "Untitled Draft",
        description: formData.contestDescription,
        startDate: formData.startDate,
        endDate: formData.endDate,
        startTime: formData.startTime,
        endTime: formData.endTime,
        positions: positions.map(pos => ({
          ...pos,
          contestants: contestants.filter(c => c.position === pos.name)
        })),
        participants: contestants,
        coverImageUrl: coverImage,
        contestLogoImageUrl: logoImage,
        payment: formData.payment,
        allowMultipleVotes: formData.allowMultipleVotes,
        status: 'draft',
        type: 'spot-light',
        uid: user?.firebaseUid,
        isClosedContest: formData.contestType === 'closed',
        closedContestType: formData.closedContestType,
        authenticationField: formData.authenticationField,
        closedContestVoters: customVoters,
        isVoteCountVisible: formData.isVoteCountVisible,
        resultRevealSetting: formData.resultRevealSetting,
        revealDate: formData.revealDate,
        revealTime: formData.revealTime,
      };

      await axios.post('/api/contest/create-contest', payload);
      toast.success('Draft saved successfully!');
      setCreateContest(null); // Clear local draft state after sync with backend
      navigate('/contest?tab=Draft'); // Navigating to contest page draft tab
    } catch (err) {
      console.error(err);
      toast.info('Saved to local storage (Backend draft failed)');
    }
  };

  const steps = [
    <ContestDetailsStep
      formData={formData}
      onInputChange={onInputChange}
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
      onEditContestant={onEditContestant}
      onCancelEdit={onCancelEdit}
      editingId={editingId}
      contestants={contestants}
      onBulkUpload={onBulkUpload}
      positions={positions}
      isUploading={isUploading}
      onAddPosition={onAddPosition}
      onRemovePosition={onRemovePosition}
      onUpdatePosition={onUpdatePosition}
    />,
    <Security
      contestType={formData.contestType}
      onContestTypeChange={(type) => onInputChange('contestType', type)}
      closedContestType={formData.closedContestType}
      onClosedContestTypeChange={(type) => onInputChange('closedContestType', type)}
      authenticationField={formData.authenticationField}
      onAuthenticationFieldChange={(field) => onInputChange('authenticationField', field)}
      customVoters={customVoters}
      setCustomVoters={setCustomVoters}
      payment={formData.payment}
      onPaymentChange={(val) => onInputChange('payment', val)}
      allowMultipleVotes={formData.allowMultipleVotes}
      onAllowMultipleVotesChange={(val) => onInputChange('allowMultipleVotes', val)}
      isVoteCountVisible={formData.isVoteCountVisible}
      onVoteCountVisibilityChange={(val) => onInputChange('isVoteCountVisible', val)}
      resultRevealSetting={formData.resultRevealSetting}
      onResultRevealSettingChange={(val) => onInputChange('resultRevealSetting', val)}
      revealDate={formData.revealDate}
      onRevealDateChange={(val) => onInputChange('revealDate', val)}
      revealTime={formData.revealTime}
      onRevealTimeChange={(val) => onInputChange('revealTime', val)}
      previewData={{
        contestName: formData.contestName,
        startDate: formData.startDate,
        endDate: formData.endDate,
        contestantCount: contestants.length,
        positionCount: positions.length
      }}
    />,
  ];

  return (
    <div className='flex bg-white min-h-screen'>
      <TopNav />
      <div className='px-4 sm:px-8 py-6 max-w-6xl mx-auto lg:p-10 w-full max-w-5xl mx-auto sm:ml-60'>
        <div className='mb-10 text-center'>
          <h2 className='text-3xl font-bold text-gray-900'>Create Spotlight Contest</h2>
          <p className='text-gray-500 mt-2'>Set up your election in 3 simple steps</p>
        </div>

        <div className='flex items-center justify-center gap-4 mb-12'>
          {stepTitles.map((title, i) => (
            <React.Fragment key={i}>
              <div className='flex flex-col items-center gap-2'>
                <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold transition-all ${i <= currentStep ? 'bg-orange-500 text-white scale-110 shadow-lg shadow-orange-100' : 'bg-gray-100 text-gray-400'}`}>
                  {i + 1}
                </div>
                <span className={`text-xs font-bold whitespace-nowrap ${i <= currentStep ? 'text-gray-900' : 'text-gray-300'}`}>{title}</span>
              </div>
              {i < 2 && <div className={`w-16 h-0.5 ${i < currentStep ? 'bg-orange-500' : 'bg-gray-100'}`} />}
            </React.Fragment>
          ))}
        </div>

        <div className='min-h-[500px] mb-12'>
          {steps[currentStep]}
        </div>

        <div className='flex justify-between items-center py-6 border-t border-gray-100 sticky bottom-0 bg-white/80 backdrop-blur-md px-4'>
          <button
            onClick={prevStep}
            disabled={currentStep === 0}
            className='px-8 py-3 rounded-xl font-bold text-gray-500 hover:bg-gray-50 disabled:opacity-0 transition-all'
          >
            Back
          </button>

          <div className='flex gap-4'>
            <button
              onClick={onSaveDraft}
              className='px-6 py-3 text-teal-600 font-bold hover:bg-teal-50 rounded-xl transition-all'
            >
              Save Draft
            </button>
            {currentStep === 2 ? (
              <button
                onClick={onPublish}
                className='px-10 py-3 bg-orange-500 text-white rounded-xl font-bold hover:bg-orange-600 shadow-lg shadow-orange-100 active:scale-95 transition-all'
              >
                Launch Contest
              </button>
            ) : (
              <button
                onClick={nextStep}
                className='px-10 py-3 bg-orange-500 text-white rounded-xl font-bold hover:bg-orange-600 shadow-lg shadow-orange-100 active:scale-95 transition-all'
              >
                Continue
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreateSpotlightContest;
