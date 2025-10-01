/* eslint-disable no-unused-vars */
import { useState, useRef, useEffect } from 'react';
import Sidebar from '../Components/sidebar';
import { ChevronLeft } from 'lucide-react';
import { useNavigate, useParams } from 'react-router-dom';
import BannerImage from '../assets/Rectangle _5189.png';
import LogoImage from '../assets/Ellipse 20.png';
import PositionPopup from '../Components/PositionPopup';
import ContestantPopup from '../Components/contestantpopup';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import axios from 'axios';
import { uploadToCloudinary } from '../actions/cloudinaryAction';
import { toast } from 'react-toastify';
import { useUser } from '../context/UserContext';
import { set } from 'date-fns';
import EditContestPositionSetup from '../Components/EditContestPositionSetup';
import EditContestContestantList from '../Components/EditContestContestantList';
import EditContestTypeSetup from '../Components/EditContestTypeSetup';

const Editcontest = () => {
  const { user } = useUser();
  const { contestId } = useParams();
  const navigate = useNavigate();
  const contestantImageInputRef = useRef(null);
  const [contest, setContest] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  const [editingContestantId, setEditingContestantId] = useState(null);
  const [isPositionPopupOpen, setIsPositionPopupOpen] = useState(false);
  const [isContestantPopupOpen, setIsContestantPopupOpen] = useState(false);
  const [originalContestantData, setOriginalContestantData] = useState(null);
  const [contestantImageUploading, setContestantImageUploading] =
    useState(false);
  const [editingPositionId, setEditingPositionId] = useState(null);
  const [tempPositionName, setTempPositionName] = useState('');
  const [tempPositionDescription, setTempPositionDescription] = useState('');
  const [originalPositionData, setOriginalPositionData] = useState(null);

  const [contestants, setContestants] = useState(contest?.contestants || []);
  const [coverImage, setCoverImage] = useState(BannerImage);
  const [logoImage, setLogoImage] = useState(LogoImage);
  const [tempContestantData, setTempContestantData] = useState({
    name: '',
    email: '',
    position: '',
    bio: '',
    image: null,
  });

  useEffect(() => {
    const fetchContest = async () => {
      try {
        const res = await axios.get(`/api/contest/${contestId}`);
        console.log(res);
        setContest(res.data.contest);
      } catch (err) {
        console.error('Failed to fetch contest:', err);
      }
    };
    if (contestId) fetchContest();
  }, [contestId]);

  //   console.log(contest);
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
          startTimeHour: '',
          startTimeMinute: '00',
          startTimeAmPm: 'AM',
        },
        endTime: contest.endTime || {
          endTimeHour: '',
          endTimeMinute: '00',
          endTimeAmPm: 'AM',
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
    contestName: contest?.title || '',
    contestDescription: contest?.description || '',
    startDate: contest?.startDate || '',
    endDate: contest?.endDate || '',
    startTime: contest?.startTime || {
      startTimeHour: '',
      startTimeMinute: '00',
      startTimeAmPm: 'AM',
    },
    endTime: contest?.endTime || {
      endTimeHour: '',
      endTimeMinute: '00',
      endTimeAmPm: 'AM',
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

  const addPosition = () => {
    const newPosition = {
      id: positions.length + 1,
      name: 'New Position',
      description: 'Description of position',
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
    setTempPositionName('');
    setTempPositionDescription('');
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
    setTempPositionName('');
    setTempPositionDescription('');
    setOriginalPositionData(null);
  };

  // Update temporary values while editing
  const updateTempPosition = (field, value) => {
    if (field === 'name') {
      setTempPositionName(value);
    } else if (field === 'description') {
      setTempPositionDescription(value);
    }
  };

  // Start editing a contestant
  const startEditingContestant = (contestant) => {
    setEditingContestantId(contestant._id);
    setTempContestantData({
      name: contestant.name || '',
      email: contestant.email || '',
      position: contestant.position || '',
      bio: contestant.bio || '',
      image: contestant.image || null,
    });
    // Store original data for cancel functionality
    setOriginalContestantData({
      name: contestant.name || '',
      email: contestant.email || '',
      position: contestant.position || '',
      bio: contestant.bio || '',
      image: contestant.image || null,
    });
  };

  const cancelEditingContestant = () => {
    if (originalContestantData && editingContestantId) {
      // Restore original values
      setContestants(
        contestants.map((contestant) =>
          contestant._id === editingContestantId
            ? {
                ...contestant,
                ...originalContestantData,
              }
            : contestant
        )
      );
    }

    // Reset editing state
    setEditingContestantId(null);
    setTempContestantData({
      name: '',
      email: '',
      position: '',
      bio: '',
      image: null,
    });
    setOriginalContestantData(null);
  };

  const saveEditingContestant = () => {
    // Check if the position was changed
    const originalContestant = originalContestantData;
    const positionChanged =
      originalContestant.position !== tempContestantData.position;

    // 1. Update the main contestants array
    setContestants(
      contestants.map((contestant) =>
        contestant._id === editingContestantId
          ? { ...contestant, ...tempContestantData }
          : contestant
      )
    );

    // 2. Update the positions array
    setPositions((prevPositions) => {
      let newPositions = prevPositions;

      if (positionChanged) {
        // Remove the contestant from their old position's list
        newPositions = newPositions.map((pos) => ({
          ...pos,
          contestants: pos.contestants?.filter(
            (c) => c._id !== editingContestantId
          ),
        }));

        // Find the new position and add the contestant to its list
        const newPositionName = tempContestantData.position;
        const updatedContestant = {
          ...originalContestant,
          ...tempContestantData,
        };

        newPositions = newPositions.map((pos) => {
          if (pos.name === newPositionName) {
            return {
              ...pos,
              contestants: [...(pos.contestants || []), updatedContestant],
            };
          }
          return pos;
        });
      } else {
        // If position did not change, just update the contestant in their current position's list
        newPositions = newPositions.map((pos) => ({
          ...pos,
          contestants:
            pos.contestants?.map((c) =>
              c._id === editingContestantId
                ? { ...c, ...tempContestantData }
                : c
            ) || [],
        }));
      }

      return newPositions;
    });

    // Reset editing state
    setEditingContestantId(null);
    setTempContestantData({
      name: '',
      email: '',
      position: '',
      bio: '',
      image: null,
    });
    setOriginalContestantData(null);
  };
  const updateTempContestant = (field, value) => {
    setTempContestantData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  // Delete contestant function
  const deleteContestant = (contestantId) => {
    // Remove from contestants array
    setContestants(contestants.filter((c) => c._id !== contestantId));

    // Remove from positions array as well
    setPositions(
      positions.map((pos) => ({
        ...pos,
        contestants:
          pos.contestants?.filter((c) => c._id !== contestantId) || [],
      }))
    );
  };

  const handleContestantImageChange = async (event) => {
    const file = event.target.files[0];

    if (file) {
      setContestantImageUploading(true);
      setIsUploading(true);

      // Create preview URL
      const imageFileUrl = URL.createObjectURL(file);
      updateTempContestant('image', imageFileUrl);

      try {
        // Upload to Cloudinary
        const imgURL = await uploadToCloudinary(file);
        updateTempContestant('image', imgURL);
      } catch (error) {
        console.error('Failed to upload contestant image:', error);
        toast.error('Failed to upload image. Please try again.');
      } finally {
        setIsUploading(false);
        setContestantImageUploading(false);
      }
    }
  };

  const handleContestantImageClick = () => {
    if (editingContestantId) {
      contestantImageInputRef.current.click();
    }
  };

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
      let status = 'upcoming'; // default

      if (formData.startDate) {
        const now = new Date();

        // Build start datetime
        const startDateTime = new Date(formData.startDate);

        if (formData.startTime) {
          let hour = parseInt(formData.startTime.startTimeHour, 10);
          if (formData.startTime.startTimeAmPm === 'PM' && hour < 12)
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
          status = contest?.status === 'completed' ? 'completed' : 'ongoing';
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
        type: 'spot-light',
        uid: user?.firebaseUid,
        _id: contest?._id || null,
      };

      const res = await axios.post('/api/contest/create-contest', payload);

      if (res.data && res.data.contest) {
        toast.success('Contest Edited successfully');
      }
    } catch (err) {
      console.error('Failed to create contest:', err);
      toast.error('Failed to create contest. Please try again.');
    }
  };

  return (
    <div className='flex min-h-screen bg-white lg:gap-[10rem]'>
      <Sidebar />
      <div className='flex-1 p-6 md:ml-20 '>
        {/* Header */}
        <div className='flex items-center mb-6 sm:mb-8 gap-4'>
          <button
            onClick={() => navigate(-1)}
            className='p-2 rounded-full hover:bg-gray-200 transition-colors'
            aria-label='Back to Contest Details'
          >
            <ChevronLeft size={24} />
          </button>
          <h2 className='text-xl sm:text-2xl lg:text-[30px] text-left font-bold text-gray-900'>
            Edit Contest
          </h2>
        </div>

        <div className='min-h-screen p-2 sm:p-4 lg:p-6'>
          <div className='mx-auto space-y-6 sm:space-y-8'>
            {/* Header */}
            <div className='bg-white rounded-lg shadow-sm'>
              <div className='p-4 border-b border-gray-200'>
                <h2 className='text-lg text-left font-semibold text-gray-900'>
                  Edit Contest Banner
                </h2>
              </div>

              {/* Banner Upload Area */}
              <div className='p-4 sm:p-6'>
                <div
                  className='relative h-32 sm:h-40 lg:h-48 rounded-lg overflow-hidden'
                  style={{
                    backgroundImage: `url(${coverImage || BannerImage})`,
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                    opacity: coverIsUploading ? 0.7 : 1,
                  }}
                >
                  {coverIsUploading ? (
                    <div className='flex flex-col items-center space-y-2 animate-pulse h-full justify-center'>
                      <svg
                        className='w-6 h-6 sm:w-8 sm:h-8 animate-spin text-teal-300'
                        fill='none'
                        stroke='currentColor'
                        viewBox='0 0 24 24'
                      >
                        <circle
                          className='opacity-25'
                          cx='12'
                          cy='12'
                          r='10'
                          stroke='currentColor'
                          strokeWidth='4'
                        ></circle>
                        <path
                          className='opacity-75'
                          fill='currentColor'
                          d='M4 12a8 8 0 018-8v8H4z'
                        ></path>
                      </svg>
                      <p className='text-xs sm:text-sm text-teal-300'>
                        Uploading...
                      </p>
                    </div>
                  ) : (
                    <div className='absolute inset-0 bg-[#000000]/50 flex flex-col items-center justify-center text-white'>
                      <p className='text-xs sm:text-sm mb-3 text-center px-4'>
                        Drag and Drop your Cover Image here
                      </p>
                      <p className='text-xs mb-4'>Or</p>
                      <button
                        onClick={handleBrowseClick}
                        className='bg-orange-500 hover:bg-orange-600 px-4 sm:px-6 py-2 rounded text-xs sm:text-sm font-medium transition-colors'
                      >
                        Browse
                      </button>
                      <input
                        type='file'
                        accept='image/*'
                        ref={fileInputRef}
                        onChange={handleFileChange}
                        className='hidden'
                      />
                    </div>
                  )}
                </div>
              </div>
            </div>
            {/* Logo Section */}
            <div className='p-4 sm:p-6'>
              <div
                className={`${
                  logoIsUploading ? 'opacity-70' : ''
                } relative w-20 h-20 sm:w-24 sm:h-24`}
              >
                <div className='w-full h-full bg-white border-2 border-gray-200 rounded-full flex items-center justify-center'>
                  <img
                    src={logoImage}
                    alt='Contest Logo'
                    className='w-16 h-16 sm:w-20 sm:h-20 object-cover rounded-full'
                  />
                  {logoIsUploading && (
                    <div className='flex flex-col items-center space-y-2 animate-pulse h-full justify-center absolute'>
                      <svg
                        className='w-6 h-6 sm:w-8 sm:h-8 animate-spin text-teal-300'
                        fill='none'
                        stroke='currentColor'
                        viewBox='0 0 24 24'
                      >
                        <circle
                          className='opacity-45'
                          cx='12'
                          cy='12'
                          r='10'
                          stroke='currentColor'
                          strokeWidth='4'
                        ></circle>
                        <path
                          className='opacity-85'
                          fill='currentColor'
                          d='M4 12a8 8 0 018-8v8H4z'
                        ></path>
                      </svg>
                    </div>
                  )}
                </div>
                <button
                  onClick={handleLogoClick}
                  className='absolute -bottom-1 -right-1 w-6 h-6 sm:w-8 sm:h-8 rounded-full border border-gray-200 flex items-center justify-center text-black bg-white hover:bg-gray-200 text-sm sm:text-base'
                >
                  +
                </button>
                <input
                  type='file'
                  accept='image/*'
                  ref={logoInputRef}
                  onChange={handleLogoChange}
                  className='hidden'
                  disabled={logoIsUploading}
                />
              </div>
            </div>
            {/* Basic Contest Information */}
            <div className='p-4 sm:p-6 space-y-4 sm:space-y-6'>
              {/* Contest Name */}
              <div>
                <label className='block text-sm text-left font-medium text-gray-700 mb-2'>
                  Contest Name
                </label>
                <input
                  type='text'
                  value={formData?.contestName}
                  onChange={(e) => onInputChange('contestName', e.target.value)}
                  placeholder='Enter the Name of your Contest'
                  className='w-full px-3 py-2 text-sm sm:text-base border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent'
                />
              </div>

              {/* Contest Description */}
              <div>
                <label className='block text-sm text-left font-medium text-gray-700 mb-2'>
                  Contest Description
                </label>
                <textarea
                  value={formData?.contestDescription}
                  onChange={(e) =>
                    onInputChange('contestDescription', e.target.value)
                  }
                  placeholder='Describe your contest'
                  rows={4}
                  className='w-full px-3 py-2 text-sm sm:text-base border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent resize-none'
                />
              </div>

              {/* Date and Time Fields - RESPONSIVE GRID */}
              <div className='grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6 text-left'>
                <div className='col-span-1 sm:col-span-2 md:col-span-1'>
                  <label className='block text-sm font-medium text-left text-gray-700 mb-2'>
                    Start Date
                  </label>
                  <DatePicker
                    selected={formData.startDate ? formData.startDate : null}
                    onChange={(date) => {
                      onInputChange(
                        'startDate',
                        date ? date.toISOString().split('T')[0] : ''
                      );
                      setFormData((prev) => ({
                        ...prev,
                        startDate: date ? date.toISOString().split('T')[0] : '',
                      }));
                    }}
                    minDate={new Date()}
                    dateFormat='yyyy-MM-dd'
                    className='w-full px-3 sm:px-4 py-2 sm:py-3 text-sm sm:text-base border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent'
                    placeholderText='Select start date'
                  />
                </div>

                <div className='col-span-1 sm:col-span-2 md:col-span-1'>
                  <label className='block text-sm font-medium text-left text-gray-700 mb-2'>
                    End Date
                  </label>
                  <DatePicker
                    selected={formData.endDate ? formData.endDate : null}
                    onChange={(date) => {
                      onInputChange(
                        'endDate',
                        date ? date.toISOString().split('T')[0] : ''
                      );
                      setFormData((prev) => ({
                        ...prev,
                        endDate: date ? date.toISOString().split('T')[0] : '',
                      }));
                    }}
                    minDate={
                      formData.startDate
                        ? new Date(formData.startDate)
                        : new Date()
                    }
                    dateFormat='yyyy-MM-dd'
                    className='w-full px-3 py-2 text-sm sm:text-base border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent'
                    placeholderText='Select end date'
                  />
                </div>

                <div className='col-span-1 sm:col-span-2 md:col-span-1'>
                  <label className='block text-sm font-medium text-left text-gray-700 mb-2'>
                    Start Time
                  </label>
                  <div className='flex space-x-1 sm:space-x-2'>
                    <select
                      value={formData?.startTime?.startTimeHour || ''}
                      onChange={(e) => {
                        onInputChange('startTime', {
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
                      className='flex-1 min-w-0 px-1 sm:px-2 py-2 sm:py-3 text-sm bg-gray-50 border border-gray-200 rounded-md focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none transition-colors'
                    >
                      <option value=''>HH</option>
                      {[...Array(12)].map((_, i) => {
                        const hour = i + 1;
                        return (
                          <option key={hour} value={hour}>
                            {hour}
                          </option>
                        );
                      })}
                    </select>
                    <span className='flex items-center text-sm sm:text-base'>
                      :
                    </span>
                    <select
                      value={formData?.startTime?.startTimeMinute || ''}
                      onChange={(e) => {
                        onInputChange('startTime', {
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
                      className='flex-1 min-w-0 px-1 sm:px-2 py-2 sm:py-3 text-sm bg-gray-50 border border-gray-200 rounded-md focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none transition-colors'
                    >
                      <option value=''>MM</option>
                      {[...Array(60)].map((_, i) => {
                        const minute = i.toString().padStart(2, '0');
                        return (
                          <option key={minute} value={minute}>
                            {minute}
                          </option>
                        );
                      })}
                    </select>
                    <select
                      value={formData?.startTime?.startTimeAmPm || 'AM'}
                      onChange={(e) => {
                        onInputChange('startTime', {
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
                      className='flex-1 min-w-0 px-1 sm:px-2 py-2 sm:py-3 text-sm bg-gray-50 border border-gray-200 rounded-md focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none transition-colors'
                    >
                      <option value='AM'>AM</option>
                      <option value='PM'>PM</option>
                    </select>
                  </div>
                </div>

                <div className='col-span-1 sm:col-span-2 md:col-span-1'>
                  <label className='block text-sm font-medium text-left text-gray-700 mb-2'>
                    End Time
                  </label>
                  <div className='flex space-x-1 sm:space-x-2'>
                    {/* Similar structure as Start Time with responsive classes */}
                    <select
                      value={formData?.endTime?.endTimeHour || ''}
                      onChange={(e) => {
                        onInputChange('endTime', {
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
                      className='flex-1 min-w-0 px-1 sm:px-2 py-2 sm:py-3 text-sm bg-gray-50 border border-gray-200 rounded-md focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none transition-colors'
                    >
                      <option value=''>HH</option>
                      {[...Array(12)].map((_, i) => {
                        const hour = i + 1;
                        return (
                          <option key={hour} value={hour}>
                            {hour}
                          </option>
                        );
                      })}
                    </select>
                    <span className='flex items-center text-sm sm:text-base'>
                      :
                    </span>
                    <select
                      value={formData?.endTime?.endTimeMinute || ''}
                      onChange={(e) => {
                        onInputChange('endTime', {
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
                      className='flex-1 min-w-0 px-1 sm:px-2 py-2 sm:py-3 text-sm bg-gray-50 border border-gray-200 rounded-md focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none transition-colors'
                    >
                      <option value=''>MM</option>
                      {[...Array(60)].map((_, i) => {
                        const minute = i.toString().padStart(2, '0');
                        return (
                          <option key={minute} value={minute}>
                            {minute}
                          </option>
                        );
                      })}
                    </select>
                    <select
                      value={formData?.endTime?.endTimeAmPm || 'AM'}
                      onChange={(e) => {
                        onInputChange('endTime', {
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
                      className='flex-1 min-w-0 px-1 sm:px-2 py-2 sm:py-3 text-sm bg-gray-50 border border-gray-200 rounded-md focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none transition-colors'
                    >
                      <option value='AM'>AM</option>
                      <option value='PM'>PM</option>
                    </select>
                  </div>
                </div>
              </div>
            </div>

            {/* Position List */}
            <EditContestPositionSetup
              positions={positions}
              editingPositionId={editingPositionId}
              tempPositionName={tempPositionName}
              tempPositionDescription={tempPositionDescription}
              setIsPositionPopupOpen={setIsPositionPopupOpen}
              startEditing={startEditing}
              saveEditing={saveEditing}
              cancelEditing={cancelEditing}
              deletePosition={deletePosition}
              updateTempPosition={updateTempPosition}
            />

            {/* Contestant List */}
            <EditContestContestantList
              contestants={contestants}
              positions={positions}
              editingContestantId={editingContestantId}
              tempContestantData={tempContestantData}
              contestantImageUploading={contestantImageUploading}
              contestantImageInputRef={contestantImageInputRef}
              setIsContestantPopupOpen={setIsContestantPopupOpen}
              handleContestantImageClick={handleContestantImageClick}
              handleContestantImageChange={handleContestantImageChange}
              updateTempContestant={updateTempContestant}
              saveEditingContestant={saveEditingContestant}
              cancelEditingContestant={cancelEditingContestant}
              startEditingContestant={startEditingContestant}
              deleteContestant={deleteContestant}
            />

            {/* Contest type - paid/free, open/closed */}

            <EditContestTypeSetup
              payment={formData.payment}
              isOpen={contest?.isOpen}
              allowMultipleVotes={formData.allowMultipleVotes}
              onPaymentChange={(payment) =>
                setFormData((prev) => ({ ...prev, payment }))
              }
              onMultipleVotesChange={(allowMultipleVotes) =>
                setFormData((prev) => ({ ...prev, allowMultipleVotes }))
              }
            />

            {/* Save Button */}
            <div className='flex flex-col sm:flex-row justify-end space-y-3 sm:space-y-0 sm:space-x-4 gap-2'>
              <button
                onClick={() => navigate(-1)}
                className='bg-gray-300 hover:bg-gray-400 text-black px-6 sm:px-8 py-3 rounded-md font-medium transition-colors order-2 sm:order-1'
              >
                Cancel
              </button>
              <button
                onClick={onPublishEdit}
                disabled={isUploading}
                className={`${
                  isUploading ? 'opacity-30' : ''
                } bg-orange-500 hover:bg-orange-600 text-white px-6 sm:px-8 py-3 rounded-md font-medium transition-colors order-1 sm:order-2`}
              >
                {isUploading ? 'Saving...' : 'Save'}
              </button>
            </div>
          </div>
        </div>
      </div>

      <PositionPopup
        isOpen={isPositionPopupOpen}
        onClose={() => setIsPositionPopupOpen(false)}
        onAddPosition={(newPosition) => {
          if (!newPosition.name.trim()) return;
          setPositions((prev) => [...prev, { ...newPosition }]);
          setIsPositionPopupOpen(false);
        }}
      />

      <ContestantPopup
        isOpen={isContestantPopupOpen}
        onClose={() => setIsContestantPopupOpen(false)}
        onAddContestant={(newContestant) => {
          if (newContestant?.name.trim() === '') return;

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
